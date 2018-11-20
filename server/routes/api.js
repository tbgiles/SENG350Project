const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

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


router.get('/projects', (req, res)=>{
  connection((db) => {
    db.collection('projects')
      .find()
      .toArray()
      .then((projects) => {
        res.setHeader('Content-Type', 'application/json');
        response.data = projects; // We are assuming there is no duplicate data.
        //console.log(useCases);
        res.json(response);
      })
      .catch((err) => {
        sendError(err, res);
      });
  });
});

router.get('/projects/:projectID',(req, res)=>{
  connection((db) => {
    console.dir(req.params.projectID);
    db.collection('projects').findOne({_id: ObjectID(req.params.projectID)})
    .then((project) => {
      res.setHeader('Content-Type', 'application/json');
      console.dir(project);
      response.data = project; // We are assuming there is no duplicate data.
      res.json(response);
    })
    .catch((err) => {
      sendError(err, res);
    });
  });
});

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

module.exports = router;
