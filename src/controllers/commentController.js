const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET COMMENTS FOR A POST
const getComments = async (req, res) => {
  const { postId } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { postId: parseInt(postId) },
      orderBy: { createdAt: "asc" },
    });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ADD COMMENT — logged in users only
const addComment = async (req, res) => {
  const { postId } = req.params;
  const { text } = req.body;

  try {
    // Fetch user from database to get their name
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { name: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const comment = await prisma.comment.create({
      data: {
        name: user.name,
        text,
        postId: parseInt(postId),
        userId: req.user.id,
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE COMMENT (admin only)
const deleteComment = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.comment.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getComments, addComment, deleteComment };