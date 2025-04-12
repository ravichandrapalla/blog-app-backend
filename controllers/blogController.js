const db = require("../models/db");
const slugify = require("slugify");

exports.createBlog = (req, res) => {
  console.log("Text fields: ", req.body);
  console.log("File info: ", req.file);

  const { title, details } = req.body;
  const imagePath = req.file ? req.file.filename : null;

  // Now you can insert into DB with imagePath
  //   res.status(201).json({ title, details, imagePath });

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

exports.getBlogBySlug = (req, res) => {
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
  const { title, details, img } = req.body;
  const slug = slugify(title, { lower: true });

  db.query(
    "UPDATE blogs SET title = ?, slug = ?, details = ?, img = ? WHERE id = ?",
    [title, slug, details, img, req.params.id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Blog updated!" });
    }
  );
};
