const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authroutes");
const app = express();
const port = process.env.PORT || 4000;
require("dotenv").config();
app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Database connected");

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error(err);
  }
};

start();

//andrewmjr2_db_user
//uNHDa0STncdMBf9A
//mongodb+srv://andrewmjr2_db_user:uNHDa0STncdMBf9A@cluster0.sidnpej.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
