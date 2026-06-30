const express = require("express");
const router = express.Router();
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  getAdminPosts,
} = require("../controllers/postController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", getPosts);
router.get("/admin/all", protect, adminOnly, getAdminPosts);
router.get("/:id", getPost);
router.post("/", protect, adminOnly, createPost);
router.put("/:id", protect, adminOnly, updatePost);
router.delete("/:id", protect, adminOnly, deletePost);
router.post("/:id/like", likePost);

module.exports = router;