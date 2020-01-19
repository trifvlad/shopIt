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
    mySqlConnection.query("INSERT INTO `user` (`uname`, `pwd`, `fname`, `lname`, `type`, `email`, `sid`, `balance`) VALUES ('"+req.body.uname+"', '"+req.body.password+"', '"+req.body.fname+"', '"+req.body.lname+"', "+req.body.type+", '"+req.body.email+"', '" + "', " + req.body.sid + ", "+ 0 +")", (err, result) => {
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

Router.post("/topup/:id", (req, res) => {
  let balance = 0;
  mySqlConnection.query("SELECT balance FROM user WHERE uid=" + req.params.id, (err, rows, fields) => {
    if(err){
        res.send(
          JSON.stringify({
            status: 'fail'
          })
        );
        console.log(err.message)
      } else {
        console.log(req.body, 'uid ' + req.params.id);
        balance = rows[0].balance + parseInt(req.body.amount, 10);
        mySqlConnection.query("update user set balance=" + balance + " WHERE uid=" + req.params.id, (err, rows, fields) => {
          if(!err){
            res.send(JSON.stringify({ status: 'ok' }));
            console.log('ok');
          } else {
            res.send(JSON.stringify({ status: 'fail' }));
            console.log(err.message)
          }
        });
      }
  });
});

function updateUserBalance(uid, balance) {
  mySqlConnection.query("update user set balance=" + balance + " WHERE uid=" + uid, (err,rows, fields) => {
    console.log("update Urer Balance");
    if(!err){
      return true;
    }
    else{
      console.log(err.message)
      return false;
    }
  });
}

function updateStockForStore(sid, cartElem) {
  mySqlConnection.query("update stock set quantity=" + cartElem.quantity + " WHERE sid=" + sid + " AND barcode=" + cartElem.barcode, (err,rows, fields) => {
    console.log("updateStock from Store");
    if(!err){
      return true;
    }
    else{
      console.log(err.message)
      return false;
    }
  });
}

Router.put("/checkout", (req, res) => {
  let sid = req.body.sid;
  let uid = req.body.uid;
  let cart = req.body.cart;
  mySqlConnection.query("SELECT balance FROM user WHERE uid="+uid, (err, rows, fields) => {
    if(err){
        res.send(
          JSON.stringify({
            status: 'fail, nu poate lua balansul din user'
          })
        );
        console.log(err.message)
      }
      else{
        balance = rows[0].balance
        console.log(balance + " balansul de pe server");
        
        let sumOfAllProducts = 0;
        let cevanuebine = false;

        mySqlConnection.query("select * from stock WHERE sid=" + sid, (err,rows, fields) => {
          console.log("am ajuns in stock cu storul sid");
          if(!err){
            let stocks = rows;
            console.log(stocks);
            console.log(cart);
            cart.forEach(cartElem => {
              let cartElemExists = 0;
              stocks.forEach(stock => {
                if (stock.barcode == cartElem.barcode) {
                  cartElemExists = stock.barcode;
                  if (stock.quantity >= cartElem.quantity) {
                    sumOfAllProducts = sumOfAllProducts + cartElem.quantity * stock.price;
                    cartElem.quantity = stock.quantity - cartElem.quantity;
                  }
                  else{
                    
                    res.send(
                      JSON.stringify({
                        status: 'fail, stock not available'
                      })
                    );
                    cevanuebine = true;
                  }
                }
              });
              if (cartElemExists === 0) {
                res.send(
                  JSON.stringify({
                    status: 'fail, barcode not found' + cartElemExists
                  })
                );
                cevanuebine = true;
              }
            });
            if (cevanuebine === false) {
              if (sumOfAllProducts <= balance) {
                updateUserBalance(uid, balance - sumOfAllProducts);
                console.log(cart);
                cart.forEach(cartElem => {
                  updateStockForStore(sid, cartElem);
                });
                res.send(
                  JSON.stringify({
                    status: 'ok'
                  })
                );
              }
              else {
                res.send(
                  JSON.stringify({
                    status: 'fail, put more money in your balance dude'
                  })
                );
                cevanuebine = true;
              }
            }
          }
          else{
            res.send(
              JSON.stringify({
                status: 'fail, did not get the stocks with the store id'
              })
            );
            console.log(err.message)
          }
        });
      }
  });
})


module.exports = Router;