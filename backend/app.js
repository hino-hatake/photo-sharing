require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db/dbConnection");

const userRoutes = require("./routes/user");
const photoRoutes = require("./routes/photo");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use("/images", express.static("public/images"));

connectDB();

app.use("/user", userRoutes);
app.use("/photosOfUser", photoRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});