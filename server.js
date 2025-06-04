require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./db/userModel");
const Photo = require("./db/photoModel");
const connectDB = require("./db/connectDB");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use (express.json());
app.use("/images", express.static("./public/images"));

console.log("MONGODB_URI:", process.env.MONGODB_URI);
connectDB();

// API: Danh sách người dùng
app.get("user/list", async (req, res) => {
    try {
        const users =await User.find().select("_id first_name last_name").lean();
        res.json(users);
    }
    catch(error) {
        console.error("Error fetching user list:",error);
        res.status(500).json({error: "Server error"})
    }
});
// API: Chi tiết người dùng
app.get("/user/:id", async (req,res) =>{
    try {

    }
    catch (error) {
      console.error("Error fetching user:",error);
      res.status(400)
    }
});