const express = require("express");

const router = express.Router();

const folderController = require("../controllers/FolderController");

router.post("/createrootfolder", folderController.createRootFolder);
router.get("/", folderController.getAllFolders);
router.post("/newfolder", folderController.createNewFolder);
router.get("/getchildfolders/:parentId", folderController.getChildFolders);
// // route for selecting the current selected folder for uploading the design to the selected folder
// router.post("/setcurrentfolder", folderController.setCurrentFolder);
// // Function for getting folders and designs for the sub folder page instead of getting for hierarchy
router.get("/getsubfolders", folderController.getSubFolders);
// router.post("/getdesignsbyfolder", folderController.getDesignsByFolder);
module.exports = router;
