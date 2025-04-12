const express = require("express");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // uploads folder should be there in directry
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
router.get("/:id", blogController.getBlogById);
router.get("/slug/:slug", blogController.getBlogBySlug);
// router.get("/:slug", blogController.getBlogBySlug);
router.put("/:id", upload.single("image"), blogController.updateBlog);

module.exports = router;
