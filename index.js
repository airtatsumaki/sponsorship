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

// create date rage
Date.prototype.addDays = function(days) {
  var dat = new Date(this.valueOf())
  dat.setDate(dat.getDate() + days);
  return dat;
}

function getDates(startDate, stopDate) {
 var dateArray = new Array();
 var currentDate = startDate;
 while (currentDate <= stopDate) {
   dateArray.push(currentDate)
   currentDate = currentDate.addDays(1);
 }
 return dateArray;
}

const dateArray = getDates(new Date(2023, 2, 23), (new Date(2023, 2, 23)).addDays(29));

const options = {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric"
};
console.log(dateArray.length);
let dateDisplay = [];
for (i = 0; i < dateArray.length; i ++ ) {
  dateDisplay.push(dateArray[i].toLocaleString("en-GB", options));
  // console.log(dateArray[i].toLocaleString("en-GB", options));
}
try{
  mongoose.connect('mongodb://127.0.0.1:27017/iftariSponsorship');
} catch (error) {
  console.log(error);
}
const sponsorSchema = new mongoose.Schema({
  rDate: Number,
  date: String,
  name: String,
  cateringBySponsor: Boolean,
  paid: Boolean,
  caterer: String,
  cookingCost: mongoose.Decimal128,
  ingCost: mongoose.Decimal128,
  confirmed: Boolean
});

const Sponsor = mongoose.model("Sponsor", sponsorSchema);

app.route("/")
  .get(async (req,res) => {
    try{
      const data = await Sponsor.find({});
      //console.log(data);
      res.render("pages/index", {content: data, dates: dateDisplay});
    } catch (error) {
      console.log(error);
    }
  });

app.route("/day/:rDate")
  .post(async (req,res) => {
    try{
      const rDate = req.params.rDate;
      const dayDetails = await Sponsor.findOne({rDate: rDate});
      console.log(dayDetails);
      let cateringBySponsorVal = 99;
      if(dayDetails){
        cateringBySponsorVal = dayDetails.cateringBySponsor;
      } 
      console.log(dateDisplay[parseInt(rDate) - 1]);
      res.render("pages/sponsorForm", {content: dayDetails, CBS: cateringBySponsorVal, rDate: rDate, date: dateDisplay[parseInt(rDate) - 1]});
    } catch (error) {
      console.log(error);
    }
  });

app.route("/sponsor")
  .post(async (req,res) => {
    try{
      console.log(req.body);
      const dayDetails = await Sponsor.findOne({rDate: req.body.inputRDate});
      if(dayDetails){
        //update the dayDetails with new info
        dayDetails.name = req.body.inputName;
        dayDetails.cateringBySponsor = req.body.inputCateringBySponsor;
        if(parseInt(req.body.inputCateringBySponsor) == 1){
          dayDetails.caterer = req.body.inputCatererName;
          dayDetails.cookingCost = req.body.inputCookingCost === "" ? 0 : req.body.inputCookingCost;
          dayDetails.ingCost = req.body.inputIngredientsCost === "" ? 0 : req.body.inputIngredientsCost;
          dayDetails.paid = req.body.checkPaid ? 1 : 0;
          dayDetails.confirmed = req.body.checkConfirmed ? 1 : 0;
        } else {
          dayDetails.caterer = "";
          dayDetails.cookingCost = null;
          dayDetails.ingCost = null;
          dayDetails.paid = 0;
          dayDetails.confirmed = 0;
        }
        await dayDetails.save();
      } else {
        //create a new sponsor document
        const newSponsor = new Sponsor({
          rDate: req.body.inputRDate,
          date: req.body.inputDate,
          name: req.body.inputName,
          cateringBySponsor: req.body.inputCateringBySponsor,
          paid: req.body.checkPaid ? 1 : 0,
          caterer: req.body.inputCatererName,
          cookingCost: req.body.inputCookingCost === "" ? 0 : req.body.inputCookingCost,
          ingCost: req.body.inputIngredientsCost === "" ? 0 : req.body.inputIngredientsCost,
          confirmed: req.body.checkConfirmed ? 1 : 0
        });
        console.log(newSponsor);
        await newSponsor.save();
      }
      res.redirect("/")
      console.log(dayDetails);
    } catch (error) {
      console.log(error);
    }
  });

app.listen(process.env.PORT || 3000, () => console.log("Server is running on port 3000"));