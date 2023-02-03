const express = require("express");
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
require('dotenv').config();

const app = express();
// instead of body-parser
app.use(express.urlencoded({extended: true})); 
app.use(express.json());

app.set("view engine", "ejs");
app.use(express.static("public"));

app.route("/")
  .get((req,res) => {
    res.render("pages/index");
  })

try{
  mongoose.connect('mongodb://127.0.0.1:27017/iftariSponsorship');
} catch (error) {
  console.log(error);
}
const sponsorSchema = new mongoose.Schema({
  rDate : Number,
  date : Date,
  
});

app.listen(process.env.PORT || 3000, () => console.log("Server is running on port 3000"));