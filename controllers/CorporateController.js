const { response } = require("express");
const Branch = require("../models/Branch");
const Corporate = require("../models/Corporate");
const SubSites = require("../models/SubSites");

const createNewCorporate = async (req, res) => {
  const { coporateEmail, coporateName, coporateType, location, websiteUrl } =
    req.body;
  try {
    const newCorporate = await new Corporate({
      coporateName,
      coporateEmail,
      coporateType,
      location,
      websiteUrl,
    }).save();
    if (newCorporate) {
      res.send({
        success: true,
        message: "corporate data has been saved successfully",
        data: newCorporate,
      });
    }
  } catch (error) {
    res.send({
      success: false,
      message: "something bad has happened",
      error: error.message,
    });
  }
};

const showAllCorporates = async (req, res) => {
  try {
    var branches = [];
    var subsites = [];
    const allCorporates = await Corporate.find({});
    // allCorporates && res.send(allCorporates);
    for await (let element of allCorporates) {
      const branch = await Branch.find({ corporateId: element._id });
      branch && branches.push(branch);
      for await (let branchElement of branch) {
        const subsite = await SubSites.find({ branchId: branchElement._id });
        subsite && subsites.push(subsite);
      }
    }
    res.send({ allCorporates, branches, subsites });
  } catch (error) {
    res.send({
      success: false,
      message: "something bad has happened",
      error: error.message,
    });
  }
};

const getCorporatedId = async (req, res) => {
  const { websiteUrl } = req.body;
  try {
    const corporate = await Corporate.findOne({ websiteUrl });
    // res.send(corporate);
    if (corporate) res.send({ success: true, corporateId: corporate._id });
    else res.send({ success: false, error: "provided website url not exists" });
  } catch (error) {
    res.send({
      success: false,
      message: "something bad has happened",
      error: error.message,
    });
  }
};

module.exports = { createNewCorporate, showAllCorporates, getCorporatedId };
