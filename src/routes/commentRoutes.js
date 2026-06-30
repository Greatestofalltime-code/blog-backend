const express = require("express");
const router = express.Router();
const {
  getComments,
  addComment,
  likeComment,
  deleteComment,
} = require("../controllers/commentController");
const { protect } = require("../middleware/authMiddleware");

router.get("/:postId", getComments);
router.post("/:postId", protect, addComment);
router.post("/like/:id", protect, likeComment);
router.delete("/:id", protect, deleteComment);

module.exports = router;