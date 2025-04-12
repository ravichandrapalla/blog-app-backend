const express = require("express");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // save to your "uploads" folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const router = express.Router();
const blogController = require("../controllers/blogController");
const upload = multer({ storage: storage });
router.post("/", upload.single("image"), blogController.createBlog);
router.get("/", blogController.getBlogs);
router.get("/:slug", blogController.getBlogBySlug);
router.put("/:id", blogController.updateBlog);

module.exports = router;
