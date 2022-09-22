require("dotenv").config();
const express = require("express");
const path = require("path");
const process = require("process");
const dbConnection = require("./database/dbConnection");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const branchRoutes = require("./routes/branchRoutes");
const userRoutes = require("./routes/userRoutes");

const PORT = process.env.PORT ? process.env.PORT : 9000;
dbConnection();

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "50MB" }));
app.use(express.urlencoded({ limit: "50MB" }));
app.use(bodyParser.json());

app.use("/branch", branchRoutes);
app.use("/user", userRoutes);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Hello its working");
});
app.listen(PORT, () => {
  console.log(`listing on port ${PORT}`);
});
