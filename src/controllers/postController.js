const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET ALL POSTS
const getPosts = async (req, res) => {
  try {
    const { search, category } = req.query;

    const where = { published: true };

    if (category && category !== "All") {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    const posts = await prisma.post.findMany({
      where,
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
          where: { parentId: null },
          orderBy: { createdAt: "asc" },
          include: {
            likedBy: { select: { userId: true } },
            replies: {
              orderBy: { createdAt: "asc" },
              include: {
                likedBy: { select: { userId: true } },
              },
            },
          },
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
  const { title, excerpt, content, category, image, readTime, published } =
    req.body;

  try {
    const post = await prisma.post.create({
      data: {
        title,
        excerpt,
        content,
        category,
        image,
        readTime,
        published: published !== undefined ? published : true,
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
// LIKE / UNLIKE POST — tracked in localStorage on frontend
const likePost = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // "like" or "unlike"

  try {
    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        likes: action === "unlike"
          ? { decrement: 1 }
          : { increment: 1 },
      },
    });

    res.json({ likes: post.likes });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET ALL POSTS FOR ADMIN (includes unpublished)
const getAdminPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, name: true } },
        comments: { select: { id: true } },
      },
    });

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

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  getAdminPosts,
};