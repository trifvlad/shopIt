const express = require("express");
const Router = express.Router();
const mySqlConnection = require("../connection");

// get all users
Router.get("/", (req, res) => {
    mySqlConnection.query("SELECT * from user", (err, rows, fields) => {
        if(!err){
            res.send(rows);
        }
        else{
            res.send("fail");
            console.log(err);
        }
    })
});

// get user by id
Router.get("/:id", (req, res) => {
    mySqlConnection.query("SELECT * from user WHERE uid=" + req.params.id, (err, rows, fields) => {
        if(!err){
            res.send(rows);
        }
        else{
            res.send("fail")
            console.log(err);
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
Router.post("/", (req, res) => {
    mySqlConnection.query("INSERT INTO `user` (`uname`, `pwd`, `fname`, `lname`, `type`, `email`) VALUES ('"+req.body.uname+"', '"+req.body.password+"', '"+req.body.fname+"', '"+req.body.lname+"', "+req.body.type+", '"+req.body.email+"')", (err, result) => {
        if(!err){
            var insertId = result.insertId;
            res.send("" + insertId);
        }
        else{
            res.send("fail");
            console.log(err.message);
        }
    })
});

// delete user by id
Router.delete("/:id", (req, res) => {
    mySqlConnection.query("DELETE FROM `user` WHERE `user`.`uid`=" + req.params.id, (err) => {
        if(!err){
            res.send("success");
        }
        else{
            console.log(err.message);
            res.send("fail");
        }
    })
});

module.exports = Router;