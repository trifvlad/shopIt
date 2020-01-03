const express = require("express");
const bodyParser = require("body-parser");
const mysqlConnection = require("./connection");
const UserRoutes = require("./routes/user");
const ProductRoutes = require("./routes/product");
const StoreRoutes = require("./routes/store");

var app = express();
app.use(bodyParser.json());

app.use("/user", UserRoutes);
app.use("/product", ProductRoutes);
app.use("/store", StoreRoutes);

app.listen(3000);