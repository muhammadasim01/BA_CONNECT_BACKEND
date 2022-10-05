const mongoose = require("mongoose");
const subSitesSchema = new mongoose.Schema({
  branchId: { type: String },
  corporateId: { type: String },
  subSiteEmail: { type: String },
  subSiteName: { type: String },
  location: { type: String },
  websiteUrl: { type: String },
});
const SubSite = mongoose.model("SubSite", subSitesSchema);
module.exports = SubSite;
