const mongoose = require("mongoose");
const dbConnection = () => {
  mongoose
    .connect(process.env.db_connection)
    .then(() => {
      console.log("CONNECTED TO THE DATABASE SUCCESSFULLY");
    })
    .catch((e) => {
      console.error(e.message ? e.message : "mongodb connection failed");
    });
};
module.exports = dbConnection;
