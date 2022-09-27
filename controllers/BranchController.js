// const { sendEmail, sendEmailToSelectedAuthor } = require("./EmailController");
const axios = require("axios");
// const { BlogPost } = require("../models/BlogPost");
// const { Corporate } = require("../models/Corporate");
// const { SubSites } = require("../models/SubSites");
const PostMeta = require("../models/PostMeta");
const Branch = require("../models/Branch");
const SubSite = require("../models/SubSites");
const BlogPost = require("../models/BlogPost");

const createNewBranch = async (req, res) => {
  const { branchEmail, location, websiteUrl, corporateId } = req.body;
  try {
    const data = await new Branch({
      branchEmail,
      location,
      websiteUrl,
      corporateId,
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
    const blog = await BlogPost.find({ _id: post_id });
    if (!blog) {
      res.send({
        success: false,
        message: "post with the provided id isn't exists",
      });
    }
    const publishedBlog = await BlogPost.findByIdAndUpdate(blog._id, {
      postStatus: "published",
    });
    console.log(pu);
    if (publishedBlog) {
      const postmeta = await PostMeta.find({
        postId: publishedBlog.postId,
      }).select({
        yoastFbTitle: 0,
        yoastFbDesc: 0,
        yoastFbImage: 0,
        yoastFbImageId: 0,
        _id: 0,
      });
      const openGraphData = await PostMeta.find({
        postId: publishedBlog.postId,
      }).select({
        yoastFbTitle: 1,
        yoastFbDesc: 1,
        yoastFbImage: 1,
        yoastFbImageId: 1,
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

module.exports = {
  createNewBranch,
  postBlogToDb,
  getPostByID,
  // getSiteDetails,
  // addBranchUrl,
  // getBranchesWithoutAssociatedEmail,
  // getAllBranches,
  // approveAndScheduleBlogPost,
};
