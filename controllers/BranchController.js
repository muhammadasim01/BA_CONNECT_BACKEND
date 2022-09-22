// const { sendEmail, sendEmailToSelectedAuthor } = require("./EmailController");
const axios = require("axios");
// const { BlogPost } = require("../models/BlogPost");
// const { Corporate } = require("../models/Corporate");
// const { SubSites } = require("../models/SubSites");
// const { PostMeta } = require("../models/PostMeta");
const Branch = require("../models/Branch");
const SubSite = require("../models/SubSites");
const BlogPost = require("../models/BlogPost");

const createNewBranch = async (req, res) => {
  const { branchEmail, location, websiteUrl } = req.body;
  try {
    const data = await new Branch({ branchEmail, location, websiteUrl }).save();

    const allAffiliates = await axios.get(
      `https://${data.websiteUrl}/?rest_route=/connectexpress/v1/getsites/`
    );
    if (allAffiliates.data.length === 0) {
      return res.json({
        success: true,
        message: "no affiliates related to the site created.",
      });
    }
    for await (let subSites of allAffiliates.data) {
      try {
        await new SubSite({
          branchId: data._id,
          subSiteEmail: subSites.admin_email,
          subSiteName: subSites.site_name,
          location: "islamabad",
          websiteUrl: subSites.website_url,
        }).save();
      } catch (error) {
        console.log(error);
        return res.json({
          success: false,
          message: error,
        });
      }
    }
    return res.json({
      success: true,
      message: "Added all the Los for the created branch",
    });
  } catch (error) {
    console.log(err);
    return res.json({
      success: false,
      message: err,
    });
  }
};

const postBlogToDb = async (req, res) => {
  const {
    siteId,
    siteType,
    postContent,
    websiteUrl,
    postTitle,
    guid,
    authorMail,
    postStatusSyndication,
    schedulePostDate,
    authorEmail,
    authorName,
  } = req.body;
};

module.exports = {
  createNewBranch,
  postBlogToDb,
  // getPostByID,
  // getSiteDetails,
  // addBranchUrl,
  // getBranchesWithoutAssociatedEmail,
  // getAllBranches,
  // approveAndScheduleBlogPost,
};
