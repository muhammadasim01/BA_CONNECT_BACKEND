const axios = require("axios");
const Branch = require("../models/Branch");
const Subsites = require("../models/SubSites");

const addNewLo = async (req, res) => {
  const { websiteUrl, branchUrl, subSiteName, subSiteEmail } = req.body;
  try {
    const branch = await Branch.findOne({ websiteUrl: branchUrl });

    if (branch) {
      try {
        const newSubsite = await new Subsites({
          branchId: branch._id,
          websiteUrl: `https://${websiteUrl}`,
          subSiteEmail,
          subSiteName,
        }).save();
        if (newSubsite) {
          try {
            const response = await axios.post(
              `https://${branchUrl}/?rest_route=/connectexpress/v1/createnewlosite`,
              {
                site_url: "/",
                site_title: subSiteName,
                domain: websiteUrl,
              }
            );
            if (response)
              return res.send({
                success: true,
                message: "new lo/subsite has been added successfully",
                data: response.data,
              });
          } catch (error) {
            res.send({
              success: false,
              message: error ? error.message : "failed to add new lo/subsite",
            });
          }
        }
      } catch (error) {
        res.send({
          success: false,
          message: error ? error.message : "failed to add new lo/subsite",
        });
      }
    } else {
      res.send({ success: false, message: "branch url is not exists" });
    }
  } catch (error) {
    res.send({
      succes: false,
      message: error ? error.message : "something  wrong has happened",
    });
  }
};

module.exports = { addNewLo };
