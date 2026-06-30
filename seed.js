const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@kanu.dev" },
    update: {},
    create: {
      name: "Ifeanyichukwu Kanu",
      email: "admin@kanu.dev",
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log("Admin user created:", admin.email);

  // Create blog posts
  const posts = [
    {
      title: "From Project Manager to Software Engineer",
      category: "Career",
      excerpt:
        "After a decade managing telecoms infrastructure projects and earning my PMP certification, I made the decision to add software engineering to my skillset. Here is why.",
      content: `After 10 years of managing complex telecoms infrastructure projects across Nigeria, I realised something important — the best project managers in tech are the ones who understand what they are managing. Not just timelines and budgets, but the actual systems being built.

That realisation pushed me to start a structured software engineering apprenticeship in July 2026. Six months. Vanilla JavaScript, React, Node.js, PostgreSQL, and Flutter. No shortcuts.

The first thing I noticed was how much my PM background helps. Breaking down a complex feature into tasks, identifying dependencies, managing scope — these are skills I already had. The syntax is new. The thinking is familiar.

Three months in, I have built and deployed a Movie Favourites app, a Weather app, and now this blog. Every project teaches me something the previous one did not.

If you are a project manager thinking about learning to code — start. The crossover skills are more valuable than you think.`,
      readTime: "4 min read",
      image:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800",
      authorId: admin.id,
    },
    {
      title: "What I Learned Building My First React App",
      category: "React",
      excerpt:
        "Building a weather app taught me more about React in one day than a week of reading documentation. Here are the key lessons.",
      content: `I built my first real React app on Day 4 of my software engineering apprenticeship — a weather application that fetches live data from the OpenWeatherMap API.

Here is what I learned that you cannot learn from reading about React:

State management is intuitive once you stop thinking about the DOM. In vanilla JavaScript I was manually updating the DOM every time data changed. React flipped that mental model — you update the data, React handles the DOM. Simple but powerful.

Component thinking changes how you see UI. Every page is just a tree of components. Once you see it that way, building complex interfaces becomes a question of breaking them down into the right pieces.

Environment variables are not optional. I learned this the hard way when GitHub flagged my exposed API key within minutes of my first push. Lesson learned permanently.

The official React documentation is genuinely excellent. The new docs at react.dev are interactive and clear. Use them.`,
      readTime: "5 min read",
      image:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
      authorId: admin.id,
    },
    {
      title: "Why Every Project Manager Should Learn to Code",
      category: "Career",
      excerpt:
        "You do not need to become a senior engineer. But understanding how software is built makes you a significantly better project manager.",
      content: `Let me be clear upfront — I am not saying every project manager needs to become a software engineer. That is not the point.

The point is that understanding how software is built — even at a basic level — fundamentally changes how you manage software projects.

You stop making promises the team cannot keep. When you understand that adding a feature to an existing system sometimes requires rebuilding foundational parts, you stop agreeing to arbitrary deadlines on behalf of your team.

You ask better questions. Instead of why is this taking so long, you ask is this a new build or are we refactoring existing code? The answers lead to better planning.

You earn credibility with engineers. Technical teams respect managers who make the effort to understand their world. You do not need to write production code. You need to speak the language well enough to be a genuine partner.

Six months of structured learning is enough to get there. Start now.`,
      readTime: "6 min read",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
      authorId: admin.id,
    },
    {
      title: "JavaScript Array Methods You Will Use Every Day",
      category: "JavaScript",
      excerpt:
        "map, filter, reduce — these three methods will appear in every JavaScript project you ever build. Here is how to think about them.",
      content: `Before I started learning React, my mentor made me spend serious time with three JavaScript array methods — map, filter, and reduce. I thought it was overkill at the time. Two months later I use them in every single component I write.

map transforms every item in an array into something new. Think of it as a conveyor belt — every item goes in one end, comes out transformed on the other. In React, you use map to turn an array of data into an array of components.

filter selects only the items that pass a test you define. In an e-commerce app, filter is how you show only products in a selected category, or only items under a certain price.

reduce boils an entire array down to a single value. The total price of items in a shopping cart. The average rating of a product. The number of unread notifications. All reduce.

Learn these three methods until you can use them without thinking. Everything else in JavaScript builds on top of them.`,
      readTime: "5 min read",
      image:
        "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800",
      authorId: admin.id,
    },
    {
      title: "Building a Full Stack Blog — From React to Node.js",
      category: "Full Stack",
      excerpt:
        "Adding a real backend to a React frontend taught me more about how the web works than anything else I have done so far.",
      content: `Phase 5 of my software engineering apprenticeship was the most challenging and the most rewarding — building a real backend for my blog using Node.js, Express, and PostgreSQL.

Up until this point, my blog loaded data from a local JavaScript file. It worked fine for learning React, but it was not a real application. A real application has a database, an API, and authentication.

Building the backend taught me three things immediately:

First, REST APIs are just functions with URLs. A GET request to /posts runs a function that queries the database and returns the results. That is all it is. The concept is simple — the implementation details take time.

Second, database design decisions are hard to undo. Spend time on your schema before you write a single line of code. The relationships between your tables define what your application can and cannot do.

Third, environment variables and security are not afterthoughts. Database passwords, JWT secrets, API keys — none of these ever touch your code. They live in environment variables, always.

The moment my React frontend fetched real data from my own API running on my own server — that was the moment I felt like a real software engineer.`,
      readTime: "7 min read",
      image:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
      authorId: admin.id,
    },
  ];

  for (const post of posts) {
    await prisma.post.create({ data: post });
    console.log(`Created post: ${post.title}`);
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });