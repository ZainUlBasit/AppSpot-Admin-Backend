const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reqStr = {
  type: String,
  required: true,
};

const PortfolioSchema = new Schema({
  title: reqStr,
  overview: reqStr,
  attachment: reqStr,
  ios_link: reqStr,
  android_link: reqStr,
  validating_the_problem: reqStr,
  solution: reqStr,
  overflow: reqStr,
  logo: reqStr,
});

module.exports =
  mongoose.models.Portfolio || mongoose.model("Portfolio", PortfolioSchema);
