const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reqStr = {
  type: String,
  required: true,
};

const PortfolioSchema = new Schema({
  title: reqStr,
  attachment: reqStr,
  ios_link: String,
  android_link: String,
  web_link: String,
  logo: reqStr,
  primary_color: reqStr,
  main_color: reqStr,
});

module.exports =
  mongoose.models.Portfolio || mongoose.model("Portfolio", PortfolioSchema);
