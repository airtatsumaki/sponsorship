const express = require("express");
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
require('dotenv').config();

const app = express();
//const bodyParser = require('body-parser');
// instead of body-parser
//app.use(express.urlencoded({extended: true})); 
app.use(express.urlencoded()); 
app.use(express.json());

app.set("view engine", "ejs");
app.use(express.static("public"));

app.route("/")
  .get((req,res) => {
    res.render("pages/index");
  })

app.listen(process.env.PORT || 3000, () => console.log("Server is running on port 3000"));