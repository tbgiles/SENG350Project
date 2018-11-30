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

// Get single user
// TODO: Make userId a unique value for each document
router.get('/user/:userId', (req, res) => {
  connection((db) => {
    db.collection('users')
      .find({
        'userId': Number(req.params.userId)
      })
      .toArray()
      .then((user) => {
        res.setHeader('Content-Type', 'application/json');
        response.data = user[0]; // We are assuming there is no duplicate data.
        res.json(response);
      })
      .catch((err) => {
        sendError(err, res);
      });
  });
});

// Edit a single user
// TODO: Make userId a unique value for each document
router.get('/user/edit/:userId', (req, res) => {
  connection((db) => {
    db.collection('users')
      .find({
        'userId': Number(req.params.userId)
      })
      .toArray()
      .then((user) => {
        res.setHeader('Content-Type', 'application/json');
        response.data = user[0]; // We are assuming there is no duplicate data.
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

// This is for the requirement of having an overview page of usecases.
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

router.post('/submit/usecase', (req, res) => {
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

router.post ('/submit/project', (req,res) => {
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

router.post('/update/usecase', (req, res) => {
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

router.post('/drop/usecase', (req, res) => {
  let useCaseID = req.body._id;
  const token = req.headers.authorization;
  let userID = "";
  jwt.verify(token, RSA_PUBLIC_KEY, (err, decoded) => {
    userID = decoded._id;
  });
  connection((db) => {
    db.collection('usecases').deleteOne({_id:ObjectID(useCaseID)});
    db.collection('projects').updateOne({ _id: ObjectID(req.body.project) },{ $pull: { 'useCases': { _id: ObjectID(useCaseID) } } });
  });
  res.status(200).send({"message" : "OK"});
});

module.exports = router;
