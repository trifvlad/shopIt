const express = require("express");
const Router = express.Router();
const mySqlConnection = require("../connection");

//get store by id
Router.get("/:id", (req, res) => {
    mySqlConnection.query("SELECT * from store WHERE sid=" + req.params.id, (err, rows, fields) => {
        if (!err){
            res.send(rows);
        } else {
            res.send("fail")
            console.log(err);
        }
    })
});

// get all stores
Router.get("/", (req, res) => {
    mySqlConnection.query("SELECT * from store", (err, rows, fields) => {
        if(!err){
            res.send(rows);
        }
        else{
            res.send("fail");
            console.log(err);
        }
    })
});

// insert store into DB
// request body example
// {
//     "name": "Mega Image",
//     "address": "str. Traian #30"
// }
Router.post("/", (req, res) => {
    mySqlConnection.query("INSERT INTO `store` (`name`, `adress`) VALUES ('"+req.body.name+"', '"+req.body.address+"')", (err, result) => {
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

// update store by id
// request body example
// {
//     "name": "Mega Image",
//     "address": "str. Traian #30",
//     "iban": "12354246578321"
// }
Router.put("/:id", (req, res)=> {
    mySqlConnection.query("UPDATE store SET name='" + req.body.name + "', adress='" + req.body.address + "', iban='" + req.body.iban + "' WHERE sid=" +req.params.id, (err) => {
        if(!err){
            res.send("success");
        }
        else{
            console.log(err.message)
            res.send("fail");
        }
    })
});

// delete store by id
Router.delete("/:id", (req, res) => {
    mySqlConnection.query("DELETE FROM `store` WHERE `store`.`sid`=" + req.params.id, (err) => {
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