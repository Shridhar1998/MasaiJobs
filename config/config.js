const mongoose = require("mongoose");
const connect = () => {
  return mongoose.connect("mongodb+srv://shreedhar:shreedhar@cluster0.urmb4ef.mongodb.net/masaijobapp");
};

module.exports = connect;
