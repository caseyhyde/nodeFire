var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Secret = require('../models/secret');

router.get("/", function(req, res){
  var userEmail = req.decodedToken.email; /*this is an object that has the
  user that just logged in's info (including email)*/;
  console.log(req.decodedToken);
  // Check the user's level of permision based on their email
  User.findOne({ email: userEmail }, function (err, queryResult) {
    /*This is
  a method that uses the Mongoose Schema to make a query to our db */
    if (err) {
      //Query errror
      console.log('Error COMPLETING clearanceLevel query task', err);
      res.sendStatus(500);//send a 500 error status
    } else {
      console.log("query result: ", queryResult);//Log the results of the query
      if(queryResult == null) {
        // If the user is not in the database, return a forbidden error status
        console.log('No user found with that email. Have you added this person to the database? Email: ', req.decodedToken.email);
        res.sendStatus(403);
      } else {
        // Based on the clearance level of the individual, give them access to different information
        Secret.find({ secrecyLevel: { $lte: queryResult.clearanceLevel } }, function (err, secrets){
          /* Uses the secret mongoose schema to make a db query to
          get the correct secrets based on queryResults from user schema */
          if (err) {
            console.log('Error COMPLETING secrecyLevel query task', err);
            res.sendStatus(500);
          } else {
            console.log("secrets: ", secrets);
            // return all of the results where a specific user has permission
            res.send(secrets);
          }
        });
      }
    }
  });//end find
});//end route

router.post("/", function(req, res){
  var userEmail = req.decodedToken.email; /*this is an object that has the
  user that just logged in's info (including email)*/;
  console.log(req.decodedToken);
  // Check the user's level of permision based on their email
  User.findOne({ email: userEmail }, function (err, queryResult) {
    /*This is
  a method that uses the Mongoose Schema to make a query to our db */
    if (err) {
      //Query errror
      console.log('Error COMPLETING clearanceLevel query task', err);
      res.sendStatus(500);//send a 500 error status
    } else {
      console.log("query result: ", queryResult);//Log the results of the query
      if(queryResult == null) {
        // If the user is not in the database, return a forbidden error status
        console.log('No user found with that email. Have you added this person to the database? Email: ', req.decodedToken.email);
        res.sendStatus(403);
      } else {
        // Based on the clearance level of the individual, give them access to different information
        Secret.find({ secrecyLevel: { $lte: queryResult.clearanceLevel } }, function (err, secrets){
          /* Uses the secret mongoose schema to make a db query to
          get the correct secrets based on queryResults from user schema */
          if (err) {
            console.log('Error COMPLETING secrecyLevel query task', err);
            res.sendStatus(500);
          } else {
            console.log("secrets: ", secrets);
            // return all of the results where a specific user has permission
            res.send(secrets);
          }
        });
      }
    }
  });//end find
});//end route

module.exports = router;
