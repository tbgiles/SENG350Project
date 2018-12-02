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
      .findOne({
        _id: ObjectID(req.params.userId)
      })
      .then((user) => {
        res.setHeader('Content-Type', 'application/json');
        response.data = user;
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
          "name": newUserName.trim(), // trim username so we can search later
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
          $set: {"name":user.name.trim()} // trim username so we can search later
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
  const deletingUser = req.body;
  if (!verifyAdmin(req.headers.authorization)) {
    console.log("UNAUTHORIZED ACCESS");
    res.status(501).send({"message": "Not Authorized"});
  } else {
    connection((db) => {
      const ownedProjects = []; // For all projects the user owns
      const affectedProjects = []; // For all other projects the user has permissiosn in
      const affectedUsers = []; // For all other users with permissions in this user's owned projects
      deletingUser.projects.forEach((project) => {
        if (project.permission == "owner") {
          ownedProjects.push(ObjectID(project._id));
        } else {
          affectedProjects.push(ObjectID(project._id));
        }
      });
      db.collection('projects').find({_id: {$in: ownedProjects}})
        .toArray()
        .then((projects) => {
          projects.forEach((project) => {
            project.users.forEach((user) => {
              if (user.permission != "owner") {
                affectedUsers.push(user._id);
              }
            });
          });
          let promises = [];
          // Remove all owned projects
          promises.push(db.collection('projects').deleteMany({_id: {$in: ownedProjects}}));
          // Remove all permissions for deleting user from other projects
          affectedProjects.forEach((project) => {
            promises.push(db.collection('projects').updateOne({_id: project}, {
              $pull: {'users': {_id: ObjectID(deletingUser._id)}}
            }));
          });
          // Remove all permissions for other users from deleting user's owned projects
          affectedUsers.forEach((user) => {
            promises.push(db.collection('users').updateOne({_id: user}, {
              $pull: {'projects': {_id: {$in: ownedProjects}}}
            }));
          });
          // Delete user.
          promises.push(db.collection('users').deleteOne({_id: ObjectID(deletingUser._id)}));
          // Submit all database queries
          console.dir(promises);
          Promise.all(promises)
            .then((data) => {
              res.status(200).send({"message" : "OK"});
            })
            .catch((err) => {
              console.log("OH NOES");
              console.dir(err);
              sendError(err, res);
            });
        })
        .catch((err) => {
          console.log("OH NOES2");
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
        user.projects.forEach(project => projectList.push(ObjectID(project._id)));
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
  const project = req.body;
    connection ((db) => {
      db.collection('projects').insertOne(project)
        .then((obj) => {
          promises = [];
          project.users.forEach((user) => {
            promises.push(db.collection('users').updateOne({_id: ObjectID(user._id)}, {
              $push: {"projects": {"_id":project._id, "permission": user.permission}}
            }));
          });
          Promise.all(promises)
            .then((data) => {
              res.status(200).send({"message" : "OK"});
            })
            .catch((err) => {
              console.dir(err);
            })
        })
        .catch((err) => {
          console.dir(err);
          sendError(err, res);
        })
    });
});

// Update an existing project
router.post ('/project/update', (req,res) => {
  const project = req.body;
  let promises = [];
  connection((db) => {
   db.collection('projects').findOne ({_id: ObjectID(project._id)}).then ((obj) => { // Find the project to Update
     console.dir(obj);
     promises.push (db.collection('projects').replaceOne({_id:ObjectID(project._id.trim())}, // Replace it with the new user list
      {"useCases": obj.useCases, "users": project.users , "title": project.title, "description": project.description}));
      obj.users.forEach ((user)=>{ // For each previous user
        promises.push(db.collection ('users').findOne ({_id: ObjectID(user._id)}).then ((user) =>{
            let index = user.projects.findIndex(function(i){ return JSON.stringify(i._id) === JSON.stringify(obj._id);}); //Splice out the project we're updating
            let arr = user.projects;
            if (index != -1){arr.splice (index, 1);}
            promises.push (db.collection('users').replaceOne({_id:ObjectID(user._id)}, {"role": user.role, "name": user.name, "projects": arr}));
        }));
      });
      Promise.all (promises).then (() => {
        project.users.forEach ((user) =>{
         db.collection('users').findOne ({_id: ObjectID (user._id.trim())}).then ((obj) => {
          db.collection('users').updateOne({_id: obj._id}, {
             $push: {"projects": {"_id":ObjectID(project._id.trim()), "permission": user.permission}}
           });
         });
       });
      });
    })
  });
});
// Delete a project
router.post('/project/delete', (req,res) => {
  let projectID = req.body._id;
  connection ((db) => {
    db.collection('projects').findOne({_id: ObjectID(projectID)})
      .then((project) => {
        let promises = [];
        project.useCases.forEach((useCase) => {
          promises.push(db.collection('usecases').deleteOne({_id: useCase._id}));
        });
        project.users.forEach((user) => {
          promises.push(db.collection('users').updateOne({_id: user._id},{
            $pull: {'projects': {_id: project._id}}
          }));
        });
        promises.push(db.collection('projects').deleteOne({_id: project._id}));
        Promise.all(promises)
          .then(() => {
            res.status(200).send({"message" : "OK"});
          });
      })
      .catch((err) => {
        sendError(err, res);
      })
  });
});

router.post('/project/transfer', (req,res) => {
  let donorID = req.body.donor;
  let recipientID = req.body.recipient;
  let projectID = req.body.project;
  connection ((db) => {
    let arr = [];
    let index = 0; // Need to use index due to JS asynchronous
    const token = req.headers.authorization;
    let userID = "";
    jwt.verify(token, RSA_PUBLIC_KEY, (err, decoded) => { // Verify user ID;
      userID = decoded._id;
    });
    db.collection("projects").updateOne({_id:ObjectID(projectID), "users._id" : donorID}, {$set:{"users.$.permission":"write"}});
    db.collection("projects").updateOne({_id:ObjectID(projectID), "users._id" : recipientID}, {$set:{"users.$.permission":"owner"}});
    db.collection("users").updateOne({_id:ObjectID(donorID), "projects._id" : ObjectID(projectID)}, {$set:{"projects.$.permission":"write"}});
    db.collection("users").updateOne({_id:ObjectID(recipientID), "projects._id" : ObjectID(projectID)}, {$set:{"projects.$.permission":"owner"}});
  });
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
        user.projects.forEach(project => projectList.push(ObjectID(project._id)));
        // Retrieve the projects matching those IDs.
        db.collection('projects').find({_id: {$in: projectList}})
          .toArray()
          .then(projects => {
            let useCaseList = [];
            projects.forEach(project => {
              project.useCases.forEach(useCase => {
                useCaseList.push(ObjectID(useCase._id));
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
