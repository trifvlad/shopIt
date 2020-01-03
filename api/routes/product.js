const express = require("express");
const Router = express.Router();
const mysqlConnection = require("../connection");

Router.get("/:barcode", (req, res) => {
    mysqlConnection.query("SELECT * from product WHERE barcode=" + req.params.barcode, (err, rows, fields) => {
        if (!err){
            res.send(rows);
        } else {
            console.log(err);
        }
    })
})

module.exports = Router;