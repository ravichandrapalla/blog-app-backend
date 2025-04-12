const express = require("express");
const multer = require("multer");

const cors = require("cors");
const bodyParser = require("body-parser");

const blogRoutes = require("./routes/blogRoutes");

const app = express();
app.use(cors());
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // save to your "uploads" folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/blogs", blogRoutes);

app.listen(5000, () => console.log("Server started on port 5000"));
