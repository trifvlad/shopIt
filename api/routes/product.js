const express = require("express");
const Router = express.Router();
const mySqlConnection = require("../connection");

//get product by barcode
Router.get("/:barcode/:sid", (req, res) => {
    mySqlConnection.query("SELECT * from product left join stock on stock.barcode = product.barcode AND stock.sid="+req.params.sid+" WHERE product.barcode=" + req.params.barcode, (err, rows, fields) => {
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
function insertStock(barcode,storeId, quantity, price,stockId = null, type ='insert')
{
    if(type === 'insert')
    {
        mySqlConnection.query("INSERT INTO `stock` (`barcode`, `sid`,`quantity`,`price`) VALUES ('"+
        barcode+"', "+storeId+", "+quantity+", "+price+")"
        , (err, result) => {
            if(!err){
               return true;
            }
            else{
                console.log(err);
               return false;
            }
        })
    }
    else if(type ==='update'){
        console.log("UPDATE");
        console.log("price: " + price);
        console.log("quantity: " + quantity);
        mySqlConnection.query("UPDATE `stock` SET `quantity`="+quantity + "," + '`price`='+price
        + ' WHERE `id` = '+stockId
        , (err, result) => {
            if(!err){
               return true;
            }
            else{
                console.log(err);
               return false;
            }
        })
    }

}
function addToStock(barcode, storeId,quantity,price)
{
  console.log("qt: " + quantity + " price: " + price)
    console.log("check if product exists in stock");
   return mySqlConnection.query("SELECT * from stock WHERE barcode=" + barcode + " AND sid=" + storeId, (err, rows, fields) => {
        if(!err){
            if(rows.length === 0){
                insertStock(barcode,storeId,quantity,price)
            }
            else{
                console.log(rows[0]);
                insertStock(barcode,storeId,quantity,price,rows[0].id,"update")
                return true;
            }
        }
        else {
            console.log(err);
           return false;
        }
    })
}
Router.post("/addProduct", (req, res) => {
    mySqlConnection.query("SELECT * from product WHERE barcode=" + req.body.barcode, (err, rows, fields) => {
      console.log(req.body);
        if(!err){
            var barcode = req.body.barcode;
            if(rows.length === 0){
                insertIntoProduct(barcode, req.body.pname);
                if(barcode === false) {
                    console.log("barcode false");
                    res.send(
                        JSON.stringify({
                          status: 'fail'
                        })
                      );
                    console.log(err);
                }
            }
            console.log(req.body);
            if(addToStock(barcode, req.body.sid,req.body.quantity,req.body.price)){
                res.send(
                    JSON.stringify({
                        status: 'ok',
                    })
                )
            }
            else
            {
                res.send(
                    JSON.stringify({
                      status: 'fail'
                    })
                  );
            }
        }
        else {
            res.send(
                JSON.stringify({
                  status: 'fail'
                })
              );
            console.log(err);
        }
    }
    )
});
function insertIntoProduct(barcode, productName){
    mySqlConnection.query("INSERT INTO `product` (`barcode`, `pname`) VALUES ('"+barcode+"', '"+productName+"')", (err, result) => {
        if(!err){
           return barcode;
        }
        else{
           return false;
        }
    })
}
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
