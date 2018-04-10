// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var logger = require("morgan");
var bodyParser = require('body-parser');
var Article = require("./articleschema");
var mongoose = require("mongoose");

var PORT = process.env.PORT || 3002;
var app = express();

// Set the app up with morgan
app.use(logger("dev"));

// set the app up with bodyparser
app.use(bodyParser());

// Database configuration
var databaseUrl = "mongodb://newuser:newuser123@ds241059.mlab.com:41059/nytreact";
// var collections = ["articles"];



mongoose.connect(databaseUrl)

// app.use(express.static("hello"))

app.get("/test", function (req, res) {
  res.send('hello');
})

// allow the api to be accessed by other apps
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
  next();
});

app.post("/new-article", function (req, res) {
  const article = new Article(req.body)
  article.save().then(function (result) {
    res.json(result)
  }).catch(function (error) {
    res.send(error)
  })

})

//get route to get articles
app.get("/all", function (req, res) {
  Article.find().exec().then(function (doc) {
    res.send(doc)
  }).catch(function (error) {
    res.send(error)
  })
})
//delete route that deltes by id
app.delete("/delete/:id", function (req, res) {
  var id = req.params.id
  Article.remove({ _id: id })
    .exec().then(function (result) {
      res.send(result)
    }).catch(function (error) {
      res.send(error)
    })
})



// Listen on port 3001
app.listen(PORT, function () {
  console.log('🌎 ==> Now listening on PORT %s! Visit http://localhost:%s in your browser!', PORT, PORT);
});


