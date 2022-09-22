const mongoose = require("mongoose");
const subSitesSchema = new mongoose.Schema({
  branchId: { type: String },
  corporateId: { type: String },
  subSiteEmail: { type: String, required: true },
  subSiteName: { type: String, required: true },
  location: { type: String },
  websiteUrl: { type: String, required: true },
});
const SubSite = mongoose.model("SubSite", subSitesSchema);
module.exports = SubSite;
