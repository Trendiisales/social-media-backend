const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Sample posts (later, we'll fetch from Google Sheets)
const posts = [
  { title: "Post 1", summary: "This is a sample summary for Post 1" },
  { title: "Post 2", summary: "This is another example for Post 2" },
];

// API Route to Get Posts
app.get("/posts", (req, res) => {
  res.json(posts);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
