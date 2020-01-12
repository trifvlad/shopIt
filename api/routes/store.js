const express = require("express");
const Router = express.Router();
const mySqlConnection = require("../connection");

//get store by id
Router.get("/:id", (req, res) => {
    mySqlConnection.query("SELECT * from store WHERE sid=" + req.params.id, (err, rows, fields) => {
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

// get all stores
Router.get("/", (req, res) => {
    mySqlConnection.query("SELECT * from store", (err, rows, fields) => {
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

// insert store into DB
// request body example
// {
//     "name": "Mega Image",
//     "address": "str. Traian #30"
// }
Router.post("/", (req, res) => {
    mySqlConnection.query("INSERT INTO `store` (`name`, `adress`) VALUES ('"+req.body.name+"', '"+req.body.address+"')", (err, result) => {
        if(!err){
          console.log("result ");
          console.log(result);
            var sid = result.insertId;

            res.send(
                JSON.stringify({
                  status: 'ok',
                  data: '' + sid
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

// delete store by id
Router.delete("/:id", (req, res) => {
    mySqlConnection.query("DELETE FROM `store` WHERE `store`.`sid`=" + req.params.id, (err) => {
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

//get store by id
Router.get("/getAllProducts/:id", (req, res) => {
    mySqlConnection.query("SELECT * from stock left join product on stock.barcode=product.barcode WHERE stock.sid=" + req.params.id , (err, rows, fields) => {
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
module.exports = Router;
