const express = require("express");
const Router = express.Router();
const mysqlConnection = require("../connection");

Router.get("/", (req, res) => {
    mysqlConnection.query("SELECT * from user", (err, rows, fields) => {
        if (!err){
            res.send(rows);
        } else {
            console.log(err);
        }
    })
})

Router.get("/:id", (req, res) => {
    mysqlConnection.query("SELECT * from user WHERE uid=" + req.params.id, (err, rows, fields) => {
        if (!err){
            res.send(rows);
        } else {
            console.log(err);
        }
    })
})

Router.post("/", (req, res) => {
    console.log(req.body);
    res.send(req.body);
})

module.exports = Router;