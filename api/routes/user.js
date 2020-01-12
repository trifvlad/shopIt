const express = require("express");
const Router = express.Router();
const mySqlConnection = require("../connection");

// get all users
Router.get("/", (req, res) => {
    mySqlConnection.query("SELECT * from user", (err, rows, fields) => {
        if(!err){
            res.send(
                JSON.stringify({
                  status: 'ok',
                  data: rows
                })
              );
        }
        else{
            res.send(
                JSON.stringify({
                  status: 'fail'
                })
              );
            console.log(err);
        }
    })
});

// get user by id
Router.get("/:id", (req, res) => {
    mySqlConnection.query("SELECT * from user WHERE uid=" + req.params.id, (err, rows, fields) => {
        if(!err){
            res.send(
                JSON.stringify({
                  status: 'ok',
                  data: rows
                })
              );
        }
        else{
            res.send(
                JSON.stringify({
                  status: 'fail'
                })
              );
            console.log(err);
        }
    })
});

//login
Router.post("/login/", (req, res) => {
    mySqlConnection.query("SELECT * from user WHERE uname='" + req.body.username + "' AND pwd='" + req.body.password + "'", (err, rows, fields) => {
        if(!err){
          if (rows.length === 1)
            res.send(
              JSON.stringify({
                status: 'ok',
                data: rows[0]
              })
            );
          else
            res.send(
              JSON.stringify({
                status: 'fail'
              })
            );
        }
        else{
            res.send("fail");
            console.log(err.message);
        }
    })
});

// insert user into DB
//example
// {
//     "uname": "userName",
//     "password": "password",
//     "fname": "firstName",
//     "lname": "lastName",
//     "type": 1,
//     "email": "e-mail@shopit.com"
// }
Router.post("/register/", (req, res) => {
    mySqlConnection.query("INSERT INTO `user` (`uname`, `pwd`, `fname`, `lname`, `type`, `email`, `cardno`, `sid`) VALUES ('"+req.body.uname+"', '"+req.body.password+"', '"+req.body.fname+"', '"+req.body.lname+"', "+req.body.type+", '"+req.body.email+"', '" + 0 + "', " + req.body.sid + ")", (err, result) => {
      console.log(req.body);
        if(!err){
            var insertId = result.insertId;
            res.send(
                JSON.stringify({
                  status: 'ok',
                  data: '' + insertId
                })
              );
        }
        else{
            res.send(
                JSON.stringify({
                  status: 'fail'
                })
              );
            console.log(err);
        }
    })
});

// delete user by id
Router.delete("/:id", (req, res) => {
    mySqlConnection.query("DELETE FROM `user` WHERE `user`.`uid`=" + req.params.id, (err) => {
        if(!err){
            res.send(
                JSON.stringify({
                  status: 'ok'
                })
              );
        }
        else{
            res.send(
                JSON.stringify({
                  status: 'fail'
                })
              );
            console.log(err);
        }
    })
});

module.exports = Router;
