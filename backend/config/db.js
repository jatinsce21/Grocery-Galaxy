const mongoose = require("mongoose");

exports.connectDB = async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    .then(console.log("connection to db is successfull"));
  } catch (error) {
    console.log("error in making db connection");
    console.log(error)
  }
};
