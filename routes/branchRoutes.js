const express = require("express");
// const authenticateToken = require("../middlewares/authenticateToken");

const router = express.Router();

const branchController = require("../controllers/BranchController");

router.get("/", branchController.getAllBranches);
router.post("/createnewbranch", branchController.createNewBranch);
router.get("/getsitedetails", branchController.getSiteDetails);
router.post("/postblogtodb", branchController.postBlogToDb);
router.get("/getpostbytid", branchController.getPostByID);
router.patch("/addbranchurl", branchController.addBranchUrl);
router.get(
  "/withoutemailbranches",
  branchController.getBranchesWithoutAssociatedEmail
);
router.patch(
  "/approveandscheduleblogpost",
  branchController.approveAndScheduleBlogPost
);

module.exports = router;
