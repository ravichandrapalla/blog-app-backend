const db = require("../models/db");
const slugify = require("slugify");

exports.createBlog = (req, res) => {
  console.log("Text fields: ", req.body);
  console.log("File info: ", req.file);

  const { title, details } = req.body;
  const imagePath = req.file ? req.file.filename : null;

  const slug = slugify(title, { lower: true });
  db.query(
    "INSERT INTO blogs (title, slug, details, img) VALUES (?, ?, ?, ?)",
    [title, slug, details, imagePath],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res
        .status(201)
        .json({ id: result.insertId, title, slug, details, img: imagePath });
    }
  );
};

exports.getBlogs = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;

  db.query("SELECT COUNT(*) AS total FROM blogs", [], (err, countResult) => {
    if (err) return res.status(500).send(err);

    const totalBlogs = countResult[0].total;
    const totalPages = Math.ceil(totalBlogs / limit);

    db.query(
      "SELECT * FROM blogs LIMIT ? OFFSET ?",
      [limit, offset],
      (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ currentPage: page, totalPages, blogs: results });
      }
    );
  });
};

exports.getBlogById = (req, res) => {
  console.log("param --> ", req.param, req.query, req.body);
  db.query(
    "SELECT * FROM blogs WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      if (result.length === 0) {
        return res.status(404).json({ message: "Blog not found." });
      }
      res.json(result[0]);
    }
  );
};

exports.getBlogBySlug = (req, res) => {
  console.log(req.param);
  db.query(
    "SELECT * FROM blogs WHERE slug = ?",
    [req.params.slug],
    (err, result) => {
      if (err) return res.status(500).send(err);
      if (result.length === 0)
        return res.status(404).json({ message: "Not Found" });
      res.json(result[0]);
    }
  );
};

exports.updateBlog = (req, res) => {
  console.log("Text fields: ", req.body);

  const { title, details } = req.body;
  const imagePath = req.file ? req.file.filename : req.body.img || null;

  const slug = slugify(title, { lower: true });

  db.query(
    "UPDATE blogs SET title = ?, slug = ?, details = ?, img = ? WHERE id = ?",
    [title, slug, details, imagePath, req.params.id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.json({
        message: "Blog updated!",
        id: req.params.id,
        title,
        slug,
        details,
        img: imagePath,
      });
    }
  );
};
