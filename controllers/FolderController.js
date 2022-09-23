const FolderStructure = require("../models/FolderStructure");
const createRootFolder = async (req, res) => {
  try {
    const { folderName } = req.body;
    const rootFolder = await new FolderStructure({
      folderName,
      createdAt: Date.now(),
    }).save();
    if (rootFolder)
      return res.send({
        success: true,
        message: `root folder has been created successfully with the name ${folderName}`,
      });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
      message: "root folder is not created properly something bad has happened",
    });
  }
};

const createNewFolder = async (req, res) => {
  const { folderName, parentId } = req.body;
  if (parentId) {
    try {
      const parentFolder = await FolderStructure.findOne({ _id: parentId });
      if (parentFolder) {
        const newFolder = await new FolderStructure({
          parentId,
          folderName,
          parentFolderName: parentFolder.folderName,
          createdAt: Date.now(),
        }).save();
        newFolder
          ? res.send({
              success: true,
              message: `new folder has been created with the name ${folderName}`,
            })
          : null;
      } else {
        res.send({
          success: false,
          message: "parent folder with provided id doesn't exists",
        });
      }
    } catch (error) {
      res.send({
        success: false,
        message:
          "new folder is not created properly something wrong has happened",
        error: error.message,
      });
      5;
    }
  }
};

const getAllFolders = async (req, res) => {
  try {
    const allFoldersData = await FolderStructure.find({});
    if (allFoldersData) {
      return res.send({ success: true, data: allFoldersData });
    }
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};

const getChildFolders = async (req, res) => {
  const { parentId } = req.params;
  if (!parentId) {
    return res.json({
      success: false,
      message: "No parent_id provided",
    });
  }
  try {
    const allChileFolders = await FolderStructure.find({ parentId });
    if (allChileFolders) {
      return res.send({ success: true, data: allChileFolders });
    }
  } catch (error) {
    res.send({ success: false, messagea: error.message });
  }
};

const getSubFolders = async (req, res) => {
  const { folderId } = req.body;
  try {
    const subFolder = await FolderStructure.findOne({ _id: folderId });
    if (subFolder) {
      res.send({ success: true, data: subFolder });
    }
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createRootFolder,
  getAllFolders,
  createNewFolder,
  getChildFolders,
  // setCurrentFolder,
  getSubFolders,
  // getDesignsByFolder,
};
