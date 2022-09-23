const mongoose = require("mongoose");
const folderStructureSchema = new mongoose.Schema({
  createdAt: { type: Date },
  folderDocument: { type: String },
  folderName: { type: String },
  parentId: { type: String },
  parentFolderName: { type: String },
});
const FolderStructure = mongoose.model(
  "FolderStructure",
  folderStructureSchema
);
module.exports = FolderStructure;
