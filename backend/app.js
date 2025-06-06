require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db/dbConnection");

const userRoutes = require("./routes/user");
const photoRoutes = require("./routes/photo");
const commentRoutes = require("./routes/comment");
const adminRoutes = require("./routes/admin");
const registerRoutes = require("./routes/register");
const auth = require("./middleware/auth");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use("/images", express.static("public/images"));

connectDB();

app.use("/admin", adminRoutes);
app.use("/user", registerRoutes); // Đặt trước auth: chỉ POST /user là public

// Bảo vệ các route sau bằng JWT, trừ /admin/login và /admin/logout
app.use(auth);

app.use("/user", userRoutes);
app.use("/photosOfUser", photoRoutes);
app.use("/commentsOfPhoto", commentRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
