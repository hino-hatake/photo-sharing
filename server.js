require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./db/userModel");
const Photo = require("./db/photoModel");
const connectDB = require("./db/dbConnection");

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/images", express.static("public/images"));

console.log("MONGODB_URI:", process.env.MONGODB_URI);
connectDB();

// API: Danh sách người dùng

app.get("/user/list", (req, res) => {
    
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});