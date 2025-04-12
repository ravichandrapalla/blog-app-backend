const express = require("express");

const cors = require("cors");
const bodyParser = require("body-parser");

const blogRoutes = require("./routes/blogRoutes");

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/blogs", blogRoutes);

app.listen(5000, () => console.log("Server started on port 5000"));
