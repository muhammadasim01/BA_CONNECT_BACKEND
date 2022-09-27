const mongoose = require("mongoose");
const CorporateSchema = new mongoose.Schema({
  coporateEmail: { type: String },
  coporateName: { type: String },
  coporateType: { type: String },
  location: { type: String },
  websiteUrl: { type: String },
});
const Corporate = mongoose.model("Corporate", CorporateSchema);
module.exports = Corporate;
