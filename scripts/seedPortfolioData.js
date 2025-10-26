const mongoose = require("mongoose");
require("dotenv").config();

const portfolioData = {
  about:
    "Tyrel is a passionate full-stack developer with expertise in modern web technologies, AI/ML, and mobile development. He specializes in building scalable applications with React, Node.js, and has extensive experience with AI-powered solutions, e-commerce platforms, and military training systems.",
  experience: [
    {
      company: "National University Manila",
      position: "BSIT - Mobile and Web Application",
      duration: "2021 - 2025",
      description:
        "Led the end-to-end development of a capstone mobile application for Android and iOS platforms. Developed cross-platform solutions using Flutter and Dart, along with native implementations using Java, Kotlin, and Swift. Contributed to backend development by implementing RESTful APIs and integrating cloud services.",
    },
    {
      company: "Mediaset",
      position: "Software Engineer",
      duration: "2024 - Present",
      description:
        "Full-time remote software engineer working on cutting-edge web applications and mobile solutions.",
    },
  ],
  projects: [
    {
      name: "BUZZMAP",
      description:
        "Built an AI-powered public health platform for Quezon City's Epidemiology Division, integrating community-driven reporting and prescriptive analytics to predict and prevent dengue outbreaks.",
      technologies: ["AI", "Node.js", "Express", "MongoDB", "Flutter", "Python", "FastAPI", "Machine Learning"],
      link: "https://buzzmap-client.vercel.app/home",
    },
    {
      name: "MYSHERAVIARY",
      description:
        "Developed a full-stack e-commerce solution with payment integration and inventory management for aviary businesses, enabling real-time stock tracking and automated order processing to streamline operations and improve customer experience.",
      technologies: ["React", "Node.js", "Express", "MongoDB", "Stripe", "PayPal", "Inventory API", "Real-time Updates"],
      link: "#",
    },
    {
      name: "AFPROTrack",
      description:
        "Developed a comprehensive training data management and analytics system that enables real-time skill readiness tracking, certificate validation, and role-based access control across secure web and mobile platforms, resulting in optimized force readiness and strategic training insights in support of the Philippine Army's TRADOC and the Army 2040 vision.",
      technologies: ["React.js", "Node.js", "Express", "MongoDB", "Flutter", "FastAPI", "JWT Authentication", "RESTful APIs", "AES-256 Encryption", "MFA", "Google Cloud", "Data Visualization"],
      link: "#",
    },
    {
      name: "Coast2Cart",
      description:
        "Built a coastal marketplace that connects buyers with local fishermen and artisans, featuring faceted search and filters, rich product pages with seller details and related items, a smooth cart-to-checkout flow, and role-aware access controls—backed by an RTK Query REST client and an admin analytics dashboard for operational insights.",
      technologies: ["React.js", "Vite", "React Router", "Redux Toolkit", "RTK Query", "Tailwind CSS", "DaisyUI", "ApexCharts", "RESTful APIs", "JavaScript (ESNext)"],
      link: "#",
    },
  ],
  skills: [
    "Flutter",
    "Dart",
    "Java",
    "Kotlin",
    "Swift",
    "Android SDK",
    "SwiftUI",
    "Xcode",
    "Firebase",
    "Node.js",
    "Express",
    "MongoDB",
    "RESTful APIs",
    "React",
    "JavaScript",
    "Python",
    "FastAPI",
    "AI/ML",
    "Machine Learning",
    "Stripe",
    "PayPal",
    "JWT Authentication",
    "AES-256 Encryption",
    "MFA",
    "Google Cloud",
    "Data Visualization",
    "Redux Toolkit",
    "RTK Query",
    "Tailwind CSS",
    "Vite",
    "React Router",
    "DaisyUI",
    "ApexCharts",
  ],
  education: [
    {
      institution: "National University Manila",
      degree: "Bachelor of Science in Information Technology - Mobile and Web Application",
      year: "2021-2025",
    },
  ],
};

async function seedData() {
  try {
    console.log("🔍 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Get the database and collection
    const db = mongoose.connection.db;
    const collection = db.collection("portfoliodatas");

    console.log("🗑️  Clearing existing portfolio data...");
    await collection.deleteMany({});

    console.log("📝 Seeding portfolio data...");
    await collection.insertOne(portfolioData);

    console.log("✅ Portfolio data seeded successfully!");
    console.log("📊 Data includes:");
    console.log(`   - About: ${portfolioData.about.substring(0, 50)}...`);
    console.log(`   - Experience: ${portfolioData.experience.length} entries`);
    console.log(`   - Projects: ${portfolioData.projects.length} entries`);
    console.log(`   - Skills: ${portfolioData.skills.length} skills`);
    console.log(`   - Education: ${portfolioData.education.length} entries`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
}

seedData();
