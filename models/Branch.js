const mongoose = require("mongoose");
const branchSchema = new mongoose.Schema({
  branchEmail: { type: String },
  branchName: { type: String },
  corporateId: { type: String },
  location: { type: String },
  websiteUrl: { type: String },
});
const Branch = mongoose.model("Branch", branchSchema);
module.exports = Branch;
