const express = require("express");
const router = express.Router();
const {
  getComments,
  addComment,
  deleteComment,
} = require("../controllers/commentController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/:postId", getComments);
router.post("/:postId", protect, addComment);          // login required
router.delete("/:id", protect, adminOnly, deleteComment); // admin only

module.exports = router;