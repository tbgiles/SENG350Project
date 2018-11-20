const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
const app = express();
const jwt = require('jsonwebtoken');
const expressJwt= require('express-jwt');
const fs = require('fs');

// API file for interacting with MongoDB
const api = require("./server/routes/api");

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));

// API location
app.use('/api', api);

// Authentication
const RSA_PRIVATE_KEY = fs.readFileSync('./private.key', 'utf-8');
const RSA_PUBLIC_KEY = fs.readFileSync('./public.key', 'utf-8');

// This function is called when AuthService calls the '/auth' path.
const loginRoute = (req, res) => {
  const _id = req.body._id;
  const name = req.body.name;
  const jwtBearerToken = jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
    _id: _id
  }, RSA_PRIVATE_KEY, {
    algorithm: 'RS256'
  })
  res.status(200).json({
    idToken: jwtBearerToken,
    expiresIn: "1",
    _id: _id,
    name: name
  });
}
app.route('/auth').post(loginRoute);

// Send all other requests to the Angular app
app.route('*').get((req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Set port
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));
