const express = require("express");
const Router = express.Router();
const mySqlConnection = require("../connection");

//get product by barcode
Router.get("/:barcode", (req, res) => {
    mySqlConnection.query("SELECT * from product WHERE barcode=" + req.params.barcode, (err, rows, fields) => {
      console.log(rows);
        if(!err){
          if(rows.length !== 0) {
            res.send(
                JSON.stringify({
                  status: 'exists',
                  data: rows[0]
                })
              );
          }
          else{
              res.send(
                  JSON.stringify({
                    status: 'nonExistant'
                  })
                );
              console.log(err);
          }
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

// get all products
Router.get("/", (req, res) => {
    mySqlConnection.query("SELECT * from product", (err, rows, fields) => {
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

// insert product into DB
// example
// {
//     "barcode": "5449000108357",
//     "name": "Apa Dorna-plata 0.5l"
// }
Router.post("/", (req, res) => {
    mySqlConnection.query("INSERT INTO `product` (`barcode`, `pname`) VALUES ('"+req.body.barcode+"', '"+req.body.name+"')", (err, result) => {
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

// update product by barcode
Router.put("/:barcode", (req, res)=> {
    mySqlConnection.query("UPDATE product SET pname='" + req.body.name + "' WHERE barcode=" +req.params.barcode, (err) => {
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

// delete product by barcode
Router.delete("/:barcode", (req, res) => {
    mySqlConnection.query("DELETE FROM `product` WHERE `product`.`barcode`=" + req.params.barcode, (err) => {
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
