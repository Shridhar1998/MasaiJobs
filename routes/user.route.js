const { Router } = require("express");
const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const jobModel= require("../models/job.model")
const app = Router();

app.get("/", async (req, res) => {
  res.send("user");
});

app.post("/signup", async (req, res) => {
  const hashedpass = await hashIt(req.body.password);
  const user = await UserModel.create({ ...req.body, password: hashedpass });
  res.send({ message: "signup successful", data: user });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (user) {
    const validated = await compareIt(password, user.password);
    if (validated) {
      const token = jwt.sign({ id: user._id, email: user.email }, "SHREE123", {
        expiresIn: "1 day",
      });

      res.send({ message: "login successful", token: token });
    } else {
      res.send("wrong password");
    }
  } else {
    res.send({ message: "wrong credentials" });
  }
});


app.post("/jobs", async (req, res) => {
 try{
  const addjobs = await jobModel.create(req.body)
  res.send({message:"added to jobs"});
 }
 catch(err){
  res.send("something went wrong")
 }
});

app.get("/jobs", async (req, res) => {
  const { page, limit, sort, filter } = req.query;
  // console.log(page, limit, sort, filter);
  if (filter != undefined) {
    const Jobs = await jobModel.find({ role: filter })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ postedat: sort });
    res.send(Jobs);
  } else {
    const Jobs = await jobModel.find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ postedat: sort });
    res.send(Jobs);
  }
  
});


// gives hashed password --secure
async function hashIt(pass) {
  const salt = await bcrypt.genSalt(6);
  const hashed = await bcrypt.hash(pass, salt);
  return hashed;
}

// campares the hashed password
async function compareIt(pass, hashedpass) {
  const validate = await bcrypt.compare(pass, hashedpass);
  return validate;
}

module.exports = app;
