// const { sendEmail, sendEmailToSelectedAuthor } = require("./EmailController");
const axios = require("axios");
// const { BlogPost } = require("../models/BlogPost");
// const { Corporate } = require("../models/Corporate");
// const { SubSites } = require("../models/SubSites");
const PostMeta = require("../models/PostMeta");
const Branch = require("../models/Branch");
const SubSite = require("../models/SubSites");
const BlogPost = require("../models/BlogPost");
const Corporate = require("../models/Corporate");

const createNewBranch = async (req, res) => {
  try {
    const { branchEmail, location, websiteUrl, corporateId, branchName } =
      req.body;
    const data = await new Branch({
      branchEmail,
      location,
      websiteUrl,
      corporateId,
      branchName,
    }).save();
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
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

const postBlogToDb = async (req, res) => {
  const {
    site_id,
    site_type,
    post_content,
    post_name,
    post_type,
    post_author,
    post_excerpt,
    post_mime_type,
    post_parent,
    post_password,
    post_status,
    comment_count,
    comment_status,
    menu_order,
    ping_status,
    pinged,
    to_ping,
    website_url,
    post_title,
    guid,
    author_mail,
    post_status_syndication,
    schedule_post_date,
    author_Email,
    author_name,
    _elementor_edit_mode,
    _elementor_template_type,
    _elementor_pro_version,
    _elementor_version,
    _elementor_data,
    _wp_page_template,
    _yoast_fb_title,
    _yoast_fb_desc,
    _yoast_fb_image,
    _yoast_fb_image_id,
  } = req.body;
  if (!site_id || !post_content) {
    res.send({
      success: false,
      error: "site_id or post_content both are required field",
    });
  }
  try {
    const newBlog = await new BlogPost({
      siteId: site_id,
      siteType: site_type,
      postContent: post_content,
      websiteUrl: website_url,
      postTitle: post_title,
      guid: guid,
      authorMail: author_mail,
      postStatusSyndication: post_status_syndication,
      schedulePostDate: schedule_post_date,
      authorEmail: author_Email,
      authorName: author_name,
      postName: post_name,
      postType: post_type,
      postAuthor: post_author,
      postExcerpt: post_excerpt,
      postMimeType: post_mime_type,
      postParent: post_parent,
      postPassword: post_password,
      postStatus: post_status,
      commentCount: comment_count,
      commentStatus: comment_status,
      menuOrder: menu_order,
      pingStatus: ping_status,
      pinged: pinged,
      toPing: to_ping,
    }).save();
    if (newBlog) {
      try {
        const newPostMeta = await new PostMeta({
          postId: newBlog._id,
          elementorEditMode: _elementor_edit_mode,
          elementorTemplateType: _elementor_template_type,
          elementorVersion: _elementor_version,
          elementorProVersion: _elementor_pro_version,
          elementorData: _elementor_data,
          wpPageTemplate: _wp_page_template,
          yoastFbTitle: _yoast_fb_title,
          yoastFbDesc: _yoast_fb_desc,
          yoastFbImage: _yoast_fb_image,
          yoastFbImageId: _yoast_fb_image_id,
        }).save();
        if (newPostMeta) {
          res.send({
            success: true,
            postedBlogData: newBlog,
            postMeta: newPostMeta,
          });
        } else {
          res.send({ success: false, error: "post meta is not created" });
        }
      } catch (error) {
        return res.json({
          success: false,
          message: error.message,
        });
      }
    } else {
      res.send({ success: false, error: "blogpost isn't created" });
    }
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

const getPostByID = async (req, res) => {
  const { post_id } = req.body;
  try {
    if (!post_id) {
      return res.json({
        success: false,
        message: "No ID provided",
      });
    }
    const blog = await BlogPost.findOne({ _id: post_id });
    if (!blog) {
      res.send({
        success: false,
        message: "post with the provided id isn't exists",
      });
    }
    const publishedBlog = await BlogPost.findByIdAndUpdate(blog._id, {
      postStatus: "published",
    });
    if (publishedBlog) {
      const postmeta = await PostMeta.findOne({
        postId: publishedBlog._id,
      }).select({
        yoastFbTitle: 0,
        yoastFbDesc: 0,
        yoastFbImage: 0,
        yoastFbImageId: 0,
        _id: 0,
      });
      const openGraphData = await PostMeta.findOne({
        postId: publishedBlog._id,
      }).select({
        yoastFbTitle: 1,
        yoastFbDesc: 1,
        yoastFbImage: 1,
        yoastFbImageId: 1,
        postId: 1,
        _id: 0,
      });
      if (postmeta && openGraphData)
        return res.send({
          success: true,
          blog: publishedBlog,
          post_meta: postmeta,
          openGraphData: openGraphData,
        });
      else
        return res.send({
          success: false,
          error: "postmeta data isn't exists",
        });
    } else {
      res.send({ success: false, error: "blog isn't published" });
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
      message: "something bad has happened",
    });
  }
};

const getSiteDetails = async (req, res) => {
  const { websiteUrl } = req.body;
  try {
    const corporate = await Corporate.findOne({ websiteUrl });
    if (corporate) {
      return res.send({
        success: true,
        site_details: corporate,
        site_id: corporate._id,
        site_type: "Corporate",
      });
    } else {
      const branch = await Branch.findOne({ websiteUrl });
      if (branch) {
        return res.send({
          success: true,
          site_details: branch,
          site_id: branch._id,
          site_type: "Branch",
        });
      } else {
        const subsite = await SubSite.findOne({ websiteUrl });
        if (subsite) {
          return res.send({
            success: true,
            site_details: subsite,
            site_id: subsite._id,
            site_type: "Subsite/Corporate",
          });
        } else {
          return res.send({
            success: false,
            error:
              "The provided websiteUrl has no matched field in the records",
          });
        }
      }
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
      message: "something bad has happened",
    });
  }
};

const addBranchUrl = async (req, res) => {
  const { branchName, siteUrl } = req.body;
  try {
    const branchUpdated = await Branch.updateOne(
      { branchName },
      { websiteUrl: siteUrl }
    );
    if (branchUpdated) {
      return res.send({
        success: true,
        message: "branch is updated with the websiteUrl",
      });
    } else {
      return res.send({ success: false, error: "branch not found" });
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
      message: "something bad has happened",
    });
  }
};

const getBranchesWithoutAssociatedEmail = async (req, res) => {
  try {
    const branch = await Branch.find({
      $or: [{ branchEmail: "" }, { branchEmail: null }],
    });
    if (branch.length !== 0) {
      return res.send({ success: true, branches_without_email: branch });
    } else {
      return res.send({
        message: "branches without email associated not found",
      });
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
      message: "something bad has happened",
    });
  }
};

const getAllBranches = async (req, res) => {
  try {
    const allBranches = await Branch.find({});
    if (allBranches.length !== 0) {
      return res.send({
        success: true,
        branhes: allBranches,
      });
    } else {
      return res.send({ success: false, error: "branches not found" });
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
      message: "something bad has happened",
    });
  }
};

const approveAndScheduleBlogPost = async (req, res) => {
  try {
    const { postId } = req.body;
    const approved = await BlogPost.findByIdAndUpdate(
      { _id: postId },
      { postStatusSyndication: "3" }
    );
    if (approved) {
      return res.send({
        success: true,
        message: "post status updated successfully",
      });
    } else {
      return res.send({
        success: false,
        error: "post with the given id not found",
      });
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
      message: "something bad has happened",
    });
  }
};

module.exports = {
  createNewBranch,
  postBlogToDb,
  getPostByID,
  getSiteDetails,
  addBranchUrl,
  getBranchesWithoutAssociatedEmail,
  getAllBranches,
  approveAndScheduleBlogPost,
};
