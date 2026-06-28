const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET ALL POSTS
const getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, name: true },
        },
        comments: {
          select: { id: true },
        },
      },
    });

    // Add comment count to each post
    const postsWithCount = posts.map((post) => ({
      ...post,
      commentCount: post.comments.length,
      comments: undefined,
    }));

    res.json(postsWithCount);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET SINGLE POST
const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: {
          select: { id: true, name: true },
        },
        comments: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// CREATE POST (admin only)
const createPost = async (req, res) => {
  const { title, excerpt, content, category, image, readTime } = req.body;

  try {
    const post = await prisma.post.create({
      data: {
        title,
        excerpt,
        content,
        category,
        image,
        readTime,
        authorId: req.user.id,
      },
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// UPDATE POST (admin only)
const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, excerpt, content, category, image, readTime, published } =
    req.body;

  try {
    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        title,
        excerpt,
        content,
        category,
        image,
        readTime,
        published,
      },
    });

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE POST (admin only)
const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.post.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// LIKE POST
const likePost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: { likes: { increment: 1 } },
    });

    res.json({ likes: post.likes });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getPosts, getPost, createPost, updatePost, deletePost, likePost };