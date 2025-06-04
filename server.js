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
    try {
        const users = User.find().select("_id first_name last_name").lean();
        return {
            _id: users._id,
            first_name: users.first_name, 
            last_name: users.last_name,
        };
    }
    catch (err) {
        console.error("Error fetching user list:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// API: Chi tiết người dùng
app.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("_id first_name last_name location description occupation")
      .lean();
    if (!user) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(400).json({ error: "Invalid user ID" });
  }
});

// API: Danh sách ảnh của người dùng
app.get("/photosOfUser/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).lean();
        if (!user) {
        return res.status(400).json({ error: "Invalid user ID" });
        }

        const photos = await Photo.find({ user_id: req.params.id })
        .select("_id user_id file_name date_time comments")
        .populate({
            path: "comments.user_id", // Populate trường user_id trong comments
            select: "_id first_name last_name", // Chỉ lấy các trường cần thiết
        })
        .lean();

        res.json(photos);
    } catch (err) {
        console.error("Error fetching photos:", err);
        res.status(400).json({ error: "Invalid user ID" });
    }
    });
    
// app.get("/photosOfUser/:id",async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id).lean();
//         if(!user) {
//           return res.status(400).json({ error: "Invalid user ID" });
//         }
//         const photos = await Photo.find({user_id: req.params.id}) // hoặc {user_id: user._id}
//         .select("_id user_id file_name date_time comments").lean();
//         const photoData = await Promise.all(
//           photos.map(async (photo) => {
//             const comments = await Promise.all(
//               photo.comments.map(async(comment) =>{
//                 const commentUser = await User.findById(comment.user_id)
//                 .select("_id first_name last_name").lean();
//                 return {
//                   _id: comment._id,
//                   comment: comment.comment,
//                   date_time: comment.date_time,
//                   user: commentUser || { _id: comment.user_id, first_name: "Unknown", last_name: "" },
//                 };
//               })
//             )

//             return {
//             _id: photo._id,
//             user_id: photo.user_id,
//             file_name: photo.file_name,
//             date_time: photo.date_time,
//             comments,
//             };
//           })
//         );       
//     }
//     catch (err) {
//         console.error("Error fetching photos of user:", err);
//         res.status(400).json({ error: "Server error" });
//     }
// });


// Khởi động server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});