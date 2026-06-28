const express = require("express");
const router = express.Router();
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
} = require("../controllers/postController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", protect, adminOnly, createPost);
router.put("/:id", protect, adminOnly, updatePost);
router.delete("/:id", protect, adminOnly, deletePost);
router.post("/:id/like", likePost);

module.exports = router;