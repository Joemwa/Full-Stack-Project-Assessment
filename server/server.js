const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// PostgreSQL connection pool
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    `postgresql://${process.env.DBUSER}:${process.env.DBPASSWORD}@${process.env.DBHOST}:${process.env.DBPORT}/${process.env.DBDATABASE}`,
  ssl: { rejectUnauthorized: false }, // required on Render
});

// Verify connection at startup
pool
  .connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ Database connection error:", err.message));

// ---- ROUTES ----

// GET all videos
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM videos ORDER BY title");
    res.json(result.rows);
  } catch (error) {
    console.error("DB query error:", error.message);
    res.status(500).json({ error: "Failed to retrieve videos" });
  }
});

// POST a new video
app.post("/", async (req, res) => {
  try {
    const { title, url } = req.body;
    if (!title || !url) {
      return res.status(400).json({
        result: "failure",
        message: "Title and URL are required",
      });
    }

    await pool.query(
      "INSERT INTO videos (title, url, rating) VALUES ($1, $2, 0)",
      [title, url]
    );
    res.status(201).json({ result: "success" });
  } catch (error) {
    console.error("Insert error:", error.message);
    res.status(500).json({ error: "Failed to add video" });
  }
});

// UPDATE a video rating
app.put("/:videoTitle", async (req, res) => {
  try {
    const videoTitle = req.params.videoTitle;
    const { rating } = req.body;

    if (rating === null || rating === undefined) {
      return res.status(400).json({ message: "Rating cannot be null" });
    }

    const result = await pool.query(
      "UPDATE videos SET rating = $1 WHERE title = $2",
      [rating, videoTitle]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.status(200).json({ message: "Rating updated successfully" });
  } catch (error) {
    console.error("Update error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE a video
app.delete("/:videoTitle", async (req, res) => {
  try {
    const videoTitle = req.params.videoTitle;

    const result = await pool.query("DELETE FROM videos WHERE title = $1", [
      videoTitle,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.status(204).end();
  } catch (error) {
    console.error("Delete error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ---- START SERVER ----
app.listen(port, () => console.log(`🚀 Server listening on port ${port}`));
