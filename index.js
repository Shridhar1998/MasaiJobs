const express = require("express");
const connect = require("./config/config");
const app = express();
const userRoute = require("./routes/user.route");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
mongoose.set("strictQuery", false);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/user", userRoute);
app.get("/", (req, res) => res.send("masaijobapp"));

app.listen(process.env.PORT, async () => {
  try {
    await connect();
    console.log("server started on port 8080 and mongodb connected");
  } catch (err) {
    console.log(err);
  }
});
