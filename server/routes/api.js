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
      .then((user) => {
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
    db.collection('usecases').findOne({_id: ObjectID(req.params.projectID)})
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
  console.dir("Body should be here");
  console.dir(req.body);
  res.status(200).send({"message" : "OK"});
});

module.exports = router;
