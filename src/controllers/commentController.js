const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET COMMENTS FOR A POST (with replies)
const getComments = async (req, res) => {
  const { postId } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId: parseInt(postId),
        parentId: null,
      },
      orderBy: { createdAt: "asc" },
      include: {
        replies: {
          orderBy: { createdAt: "asc" },
          include: {
            likedBy: { select: { userId: true } },
          },
        },
        likedBy: { select: { userId: true } },
      },
    });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ADD COMMENT — logged in users only
const addComment = async (req, res) => {
  const { postId } = req.params;
  const { text, parentId } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { name: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const comment = await prisma.comment.create({
      data: {
        name: req.user.name || user.name,
        text,
        postId: parseInt(postId),
        userId: req.user.id,
        parentId: parentId ? parseInt(parentId) : null,
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// LIKE A COMMENT
// LIKE / UNLIKE COMMENT — one per user
const likeComment = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // Check if already liked
    const existingLike = await prisma.commentLike.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId: parseInt(id),
        },
      },
    });

    if (existingLike) {
      // Unlike — remove the like record and decrement
      await prisma.commentLike.delete({
        where: {
          userId_commentId: {
            userId,
            commentId: parseInt(id),
          },
        },
      });

      const comment = await prisma.comment.update({
        where: { id: parseInt(id) },
        data: { likes: { decrement: 1 } },
      });

      return res.json({ likes: comment.likes, liked: false });
    }

    // Like — create like record and increment
    await prisma.commentLike.create({
      data: {
        userId,
        commentId: parseInt(id),
      },
    });

    const comment = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: { likes: { increment: 1 } },
    });

    res.json({ likes: comment.likes, liked: true });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE COMMENT — owner or admin
const deleteComment = async (req, res) => {
  const { id } = req.params;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Allow if admin or comment owner
    if (req.user.role !== "admin" && comment.userId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await prisma.comment.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getComments, addComment, likeComment, deleteComment };