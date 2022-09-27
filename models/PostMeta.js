const mongoose = require("mongoose");
const postMetaSchema = new mongoose.Schema({
  elementorData: { type: String },
  elementorEditMode: { type: String },
  elementorProVersion: { type: String },
  elementorTemplateType: { type: String },
  elementorVersion: { type: String },
  wpPageTemplate: { type: String },
  yoastFbDesc: { type: String },
  yoastFbImage: { type: String },
  yoastFbImageId: { type: String },
  yoastFbTitle: { type: String },
  authorEmail: { type: String },
  postId: { type: String },
  schedulePostData: { type: String },
});
const PostMeta = mongoose.model("PostMeta", postMetaSchema);
module.exports = PostMeta;
