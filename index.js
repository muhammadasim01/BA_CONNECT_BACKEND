//these are all imports required in the server side and some configuration call
require("dotenv").config();
const express = require("express");
const path = require("path");
const process = require("process");
const dbConnection = require("./database/dbConnection");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

//all routes imports are here
const branchRoutes = require("./routes/branchRoutes");
const userRoutes = require("./routes/userRoutes");
const subsitesRoutes = require("./routes/subSitesRoutes");
const folderRoutes = require("./routes/folderRoutes");
const corporateRoutes = require("./routes/corporateRoutes");

const PORT = process.env.PORT ? process.env.PORT : 9000;

//this method call is connecting our database to the server
dbConnection();

//these are some middleware which will help us to send data i.e. from frontend to backend and vice versa also accept the data json in the backend
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "50MB" }));
app.use(express.urlencoded({ limit: "50MB" }));
app.use(bodyParser.json());

//these all are the middlewares for out routes
app.use("/branch", branchRoutes);
app.use("/user", userRoutes);
app.use("/lo", subsitesRoutes);
app.use("/folders", folderRoutes);
app.use("/corporate", corporateRoutes);

//here we are creating static folder to server our pages in the production
app.use(express.static(path.join(__dirname, "public")));

//this is for devlopment environment only this should remove while pushing the code to the production
app.get("/", (req, res) => {
  res.send("your server is up and running on this port successfully");
});
//here we are listening to the server at port 9000
app.listen(PORT, () => {
  console.log(`listing on port ${PORT}`);
});
