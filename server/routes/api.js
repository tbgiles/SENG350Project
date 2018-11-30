const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const fs = require('fs');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const RSA_PUBLIC_KEY = fs.readFileSync('public.key', 'utf-8');

// Connect to the database to make a data request
const connection = (closure) => {
  return MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, (err, client) => {
    if (err) return console.log(err);
    let db = client.db('projects');
    closure(db);
  });
};

// Error handling
const sendError = (err, res) => {
  response.status = 501;
  response.message = typeof err == 'object' ? err.message : err;
  res.status(501).json(response);
};

// Response handling
let response = {
  status: 200,
  data: [],
  message: null
}

const verifyAdmin = (token) => {
  let username = "";
  jwt.verify(token, RSA_PUBLIC_KEY, (err, decoded) => {
    username = decoded.name;
  });
  return (username == "Admin");
}


/*
  USER CONTROL
*/

// Get single user
router.get('/user/:userId', (req, res) => {
  connection((db) => {
    db.collection('users')
      .find({
        _id: ObjectID(req.params.userId)
      })
      .toArray()
      .then((user) => {
        res.setHeader('Content-Type', 'application/json');
        response.data = user;
        console.dir(response.data);
        res.json(response);
      })
      .catch((err) => {
        sendError(err, res);
      });
  });
});

// Get users
router.get('/users', (req, res) => {
  connection((db) => {
    db.collection('users')
      .find()
      .toArray()
      .then((users) => {
        res.setHeader('Content-Type', 'application/json');
        response.data = users;
        res.json(response);
      })
      .catch((err) => {
        sendError(err, res);
      });
  });
});

// Takes a 'newUser' User in body and creates it in the database.
router.post('/user/create', (req, res) => {
  const newUserName = req.body.name;
  if (!verifyAdmin(req.headers.authorization)) {
    console.log("UNAUTHORIZED ACCESS");
    res.status(501).send({"message": "Not Authorized"});
  } else {
    connection((db) => {
      db.collection('users')
        .insertOne({
          "name": newUserName,
          "role": "user",
          "projects": []
        })
        .then(() => {
          res.status(200).send({"message" : "OK"});
        })
        .catch((err) => {
          console.dir(err);
          sendError(err, res);
        });
    });
  }
});

// Takes a _id in body and updates it in the database.
router.post('/user/update', (req, res) => {
  const user = req.body;
  if (!verifyAdmin(req.headers.authorization)) {
    console.log("UNAUTHORIZED ACCESS");
    res.status(501).send({"message": "Not Authorized"});
  } else {
    connection((db) => {
      db.collection('users')
        .updateOne({
          _id:ObjectID(user._id)
        },{
          $set: {"name":user.name}
        })
        .then(() => {
          res.status(200).send({"message" : "OK"});
        })
        .catch((err) => {
          console.dir(err);
          sendError(err, res);
        });
    });
  }
});

// Takes a _id in body and deletes it from the database.
router.post('/user/delete', (req, res) => {
  const userID = req.body._id;
  if (!verifyAdmin(req.headers.authorization)) {
    console.log("UNAUTHORIZED ACCESS");
    res.status(501).send({"message": "Not Authorized"});
  } else {
    connection((db) => {
      db.collection('users')
        .deleteOne({_id:ObjectID(userID)})
        .then(() => {
          res.status(200).send({"message" : "OK"});
        })
        .catch((err) => {
          console.dir(err);
          sendError(err, res);
        });
    });
  }
});


/*
  PROJECT CONTROL
*/

// Get a single project
router.get('/projects/:projectID',(req, res)=>{
  connection((db) => {
    db.collection('projects').findOne({_id: ObjectID(req.params.projectID)})
    .then((project) => {
      res.setHeader('Content-Type', 'application/json');
      response.data = project;
      res.json(response);
    })
    .catch((err) => {
      sendError(err, res);
    });
  });
});

// Get all projects a user is associated with
router.get('/projects', (req, res)=>{
  // Validate the user's identity using their JWT
  const token = req.headers.authorization;
  let userID = "";
  jwt.verify(token, RSA_PUBLIC_KEY, (err, decoded) => {
    userID = decoded._id;
  });
  connection((db) => {
    // Get a list of project IDs associated with the user.
    db.collection('users').findOne({_id: ObjectID(userID)})
      .then(user => {
        let projectList = [];
        user.projects.forEach(project => projectList.push(project._id));
        // Retrieve the projects matching those IDs.
        db.collection('projects').find({_id: {$in: projectList}})
          .toArray()
          .then(projects => {
            // Return to sender ^.^
            res.setHeader('Content-Type', 'application/json');
            response.data = projects;
            res.json(response);
          })
      })
      .catch((err) => {
        sendError(err, res);
      });
  });
});

// Create a new project
router.post ('/project/create', (req,res) => {
    connection ((db) => {
      let arr = [];
      let index = 0; // Need to use index due to JS asynchronous
      const token = req.headers.authorization;
      let userID = "";
      jwt.verify(token, RSA_PUBLIC_KEY, (err, decoded) => { // Verify user ID;
        userID = decoded._id;
      });
      for (var i = 0; i < req.body.users.length; i++){
          db.collection('users').findOne({name: req.body.users[i].user.trim()}, (err, respObj) => { // Get Each User's ID
          if (userID != respObj._id)
            arr.push ({"_id": respObj._id, "permission": req.body.users[index++].permission});  //Format it to push into projects
        });
      }
       db.collection ("projects").insertOne ({"useCases": [], "users": [], "title": req.body.title}, (err, respObj) => { // Create a new project
        arr.push ({"_id": userID, "permission": "owner"});
         db.collection("projects").replaceOne ({"_id":ObjectID(respObj.insertedId)}, {"useCases": req.body.useCases, "users": arr, "title": req.body.title}); // Add in users array
         for (var i = 0; i < arr.length; i++){
           db.collection('users').updateOne ({"_id":ObjectID (arr[i]._id)}, {$push:{"projects": {"_id":respObj.insertedId, "permission": arr[i].permission}}}); // Update user projects
         }
      });
    });
});

// Update an existing project
router.post ('/project/update', (req,res) => {
    connection ((db) => {
      let arr = [];
      let index = 0; // Need to use index due to JS asynchronous
      const token = req.headers.authorization;
      let userID = "";
      jwt.verify(token, RSA_PUBLIC_KEY, (err, decoded) => { // Verify user ID;
        userID = decoded._id;
      });
      for (var i = 0; i < req.body.users.length; i++){
          db.collection('users').findOne({name: req.body.users[i].user.trim()}, (err, respObj) => { // Get Each User's ID
          if (userID != respObj._id)
            arr.push ({"_id": respObj._id, "permission": req.body.users[index++].permission});  //Format it to push into projects
        });
      }
       db.collection ("projects").insertOne ({"useCases": [], "users": [], "title": req.body.title}, (err, respObj) => { // Create a new project
        arr.push ({"_id": userID, "permission": "owner"});
         db.collection("projects").replaceOne ({"_id":ObjectID(respObj.insertedId)}, {"useCases": req.body.useCases, "users": arr, "title": req.body.title}); // Add in users array
         for (var i = 0; i < arr.length; i++){
           db.collection('users').updateOne ({"_id":ObjectID (arr[i]._id)}, {$push:{"projects": {"_id":respObj.insertedId, "permission": arr[i].permission}}}); // Update user projects
         }
      });
    });
});

// Delete a project
router.post('/project/delete', (req,res) => {

  // PLACEHOLDER

  res.status(200).send({"message": "ok"});
});


/*
  USE CASE CONTROL
*/

// Get a single use case
router.get('/usecase/:useCaseID',(req, res)=>{
  connection((db) => {
    db.collection('usecases').findOne({_id: ObjectID(req.params.useCaseID)})
    .then((useCase) => {
      res.setHeader('Content-Type', 'application/json');
      response.data = useCase;
      res.json(response);
    })
    .catch((err) => {
      sendError(err, res);
    });
  });
});

// Get all use cases associated with a user
router.get('/usecases', (req, res)=>{
  // Validate the user's identity using their JWT
  const token = req.headers.authorization;
  let userID = "";
  jwt.verify(token, RSA_PUBLIC_KEY, (err, decoded) => {
    userID = decoded._id;
  });
  connection((db) => {
    // Get a list of project IDs associated with the user.
    db.collection('users').findOne({_id: ObjectID(userID)})
      .then(user => {
        let projectList = [];
        user.projects.forEach(project => projectList.push(project._id));
        // Retrieve the projects matching those IDs.
        db.collection('projects').find({_id: {$in: projectList}})
          .toArray()
          .then(projects => {
            let useCaseList = [];
            projects.forEach(project => {
              project.useCases.forEach(useCase => {
                useCaseList.push(useCase._id);
              });
            });
            // Retrieve all use cases associated with these projects.
            db.collection('usecases').find({_id: {$in: useCaseList}})
              .toArray()
              .then(usecases => {
                // Return to sender ^.^
                res.setHeader('Content-Type', 'application/json');
                response.data = usecases;
                res.json(response);
              })
          })
      })
      .catch((err) => {
        sendError(err, res);
      });
  });
});

router.post('/usecase/create', (req, res) => {
  delete req.body._id; // Make sure there's no attached ID
  let projectID = req.body.project;

  const token = req.headers.authorization;
  let userID = "";
  jwt.verify(token, RSA_PUBLIC_KEY, (err, decoded) => {
    userID = decoded._id;
  });

  connection((db)=>{
    db.collection('users').findOne({_id: ObjectID(userID)})
      .then(user => {
        user.projects.forEach( project => {
          if(project._id == projectID && (project.permission == "write" || project.permission == "owner")){
            db.collection('usecases').insertOne(req.body, (err, respObj) => {
              db.collection('projects').updateOne({_id:ObjectID(projectID)}, {$push:{"useCases":{"_id":respObj.insertedId}}});
            });
          }
        });
      });
  });
  res.status(200).send({"message" : "OK"});
});


router.post('/usecase/update', (req, res) => {
  let useCaseID = req.body._id;
  let projectID = req.body.project;

  const token = req.headers.authorization;
  let userID = "";
  jwt.verify(token, RSA_PUBLIC_KEY, (err, decoded) => {
    userID = decoded._id;
  });

  delete req.body._id;
  delete req.body.project;

  connection((db)=>{
    db.collection('users').findOne({_id: ObjectID(userID)})
      .then(user => {
        user.projects.forEach( project => {
          if(project._id == projectID && (project.permission == "write" || project.permission == "owner")){
            db.collection('usecases').updateOne({_id:ObjectID(useCaseID)}, {$set: req.body}, (err, respObj) => {});
          }
        });
      });
  });
  res.status(200).send({"message" : "OK"});
});



router.post('/usecase/delete', (req, res) => {
  let projectID = req.body.project;
  let useCaseID = req.body._id;
  const token = req.headers.authorization;

  let userID = "";
  jwt.verify(token, RSA_PUBLIC_KEY, (err, decoded) => {
    userID = decoded._id;
  });
  connection((db)=>{
    db.collection('users').findOne({_id: ObjectID(userID)})
      .then(user => {
        user.projects.forEach( project => {
          if(project._id == projectID && (project.permission == "write" || project.permission == "owner")){
            db.collection('usecases').deleteOne({_id:ObjectID(useCaseID)});
            db.collection('projects').updateOne({ _id: ObjectID(req.body.project) },{ $pull: { 'useCases': { _id: ObjectID(useCaseID) } } });
          }
        });
      });
  });
  res.status(200).send({"message" : "OK"});
});

module.exports = router;
