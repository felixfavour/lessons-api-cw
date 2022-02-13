var express = require("express");
var cors = require("cors");

var http = require("http");
var app = express();
const port = 3000;

var lessons = require("./data/lessons.json");
var user = require("./data/user.json");

//CORS allows you to configure the web API's security. It has to do with allowing other domains to make requests against your web API.
app.use(cors());

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.get("/lessons", (req, res) => {
  res.status(200).json(lessons); 
});

app.get("/user", (req, res) => {
  res.status(200).json(user); 
});