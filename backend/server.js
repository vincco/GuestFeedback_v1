const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ── MongoDB Connection ──────────────────────────────────────────────
mongoose
  .connect("mongodb://localhost:27017/guestfeedback")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ── Schema & Model ──────────────────────────────────────────────────
const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    category: {
      type: String,
      enum: ["Service", "Food", "Cleanliness", "Ambience", "Overall"],
      default: "Overall",
    },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

// ── Routes ──────────────────────────────────────────────────────────

// GET all reviews
app.get("/api/reviews", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// GET single review
app.get("/api/reviews/:id", async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found" });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch review" });
  }
});

// POST new review
app.post("/api/reviews", async (req, res) => {
  try {
    const { name, email, rating, category, comment } = req.body;
    if (!name || !email || !rating || !comment) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const review = new Review({ name, email, rating, category, comment });
    const saved = await review.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Failed to save review" });
  }
});

// DELETE review
app.delete("/api/reviews/:id", async (req, res) => {
  try {
    const deleted = await Review.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Review not found" });
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete review" });
  }
});

// GET stats summary
app.get("/api/stats", async (req, res) => {
  try {
    const total = await Review.countDocuments();
    const avgResult = await Review.aggregate([
      { $group: { _id: null, avg: { $avg: "$rating" } } },
    ]);
    const avgRating = avgResult.length ? avgResult[0].avg.toFixed(1) : 0;

    const byCategory = await Review.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    res.json({ total, avgRating, byCategory });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// ── Start Server ────────────────────────────────────────────────────
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
