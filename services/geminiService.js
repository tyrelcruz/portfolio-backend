const { GoogleGenAI } = require("@google/genai");

class GeminiService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set");
    }
    this.ai = new GoogleGenAI({ apiKey });

    // Pre-written responses for common questions (instant responses)
    this.commonResponses = {
      "what are your main technical skills":
        "I'm a full-stack developer with expertise in React, Node.js, JavaScript, Python, and modern web technologies. I specialize in building scalable applications with React/Redux frontends, Node.js/Express backends, and MongoDB databases. I also have experience with AI/ML, Flutter mobile development, and cloud technologies like Google Cloud.",

      "what is your experience with ai and machine learning":
        "I have hands-on experience with AI and machine learning through projects like BuzzMap, where I built an AI-powered public health platform for predicting dengue outbreaks. I work with Python, FastAPI, and machine learning algorithms to create intelligent solutions that solve real-world problems.",
      "tell me about your full-stack development experience":
        "I'm a full-stack developer with extensive experience building end-to-end applications. My frontend expertise includes React, Redux Toolkit, RTK Query, and modern JavaScript. For backends, I work with Node.js, Express, FastAPI, and Python. I'm proficient with databases like MongoDB and have experience with payment integrations (Stripe, PayPal), real-time updates, and cloud deployment.",
      "tell me about your project buzzmap":
        "BuzzMap is an AI-powered public health platform I built for Quezon City's Epidemiology Division. It integrates community-driven reporting and prescriptive analytics to predict and prevent dengue outbreaks. The platform uses AI, Node.js, Express, MongoDB, Flutter, Python, FastAPI, and Machine Learning to provide real-time health insights and outbreak predictions.",
      "tell me about your project mysheraviary":
        "MySherAviary is a full-stack e-commerce solution I developed for aviary businesses. It features payment integration (Stripe, PayPal), inventory management, real-time stock tracking, and automated order processing. Built with React, Node.js, Express, MongoDB, and real-time updates to streamline operations and improve customer experience.",
      "tell me about your project afprotrack":
        "AFPROTrack is a comprehensive training data management and analytics system I developed for the Philippine Army's TRADOC. It enables real-time skill readiness tracking, certificate validation, and role-based access control across secure web and mobile platforms. Features include JWT authentication, AES-256 encryption, MFA, Google Cloud integration, and data visualization for optimized force readiness.",
      "tell me about your project coast2cart":
        "Coast2Cart is a coastal marketplace I built that connects buyers with local fishermen and artisans. It features faceted search, rich product pages, smooth cart-to-checkout flow, and role-aware access controls. The platform uses React.js, Vite, Redux Toolkit, RTK Query, Tailwind CSS, and includes an admin analytics dashboard for operational insights.",
      "how can i get in touch with you":
        "You can reach out to me through the contact page on my portfolio website. I'm always interested in discussing new opportunities, collaborations, or interesting projects. Feel free to connect with me to discuss how I can help with your development needs!",
      "what projects have you worked on":
        "I've worked on several impactful projects including BuzzMap (AI-powered public health platform), MySherAviary (e-commerce solution), AFPROTrack (military training management system), and Coast2Cart (coastal marketplace). Each project showcases different aspects of my full-stack development skills, from AI/ML integration to payment systems and real-time applications.",
      "what technologies do you use":
        "I work with a modern tech stack including React, Node.js, JavaScript, Python, MongoDB, Express, FastAPI, Flutter, and various cloud technologies. I'm experienced with AI/ML frameworks, payment integrations (Stripe, PayPal), real-time updates, and have expertise in both frontend and backend development.",
      "what is your background":
        "I'm a full-stack developer with a strong background in modern web technologies and AI/ML. I've built applications ranging from public health platforms to e-commerce solutions and military training systems. My experience spans React frontends, Node.js backends, mobile development with Flutter, and AI-powered applications.",
      "what makes you different":
        "What sets me apart is my combination of full-stack development skills with AI/ML expertise. I've built real-world applications that solve complex problems, from predicting disease outbreaks to managing military training data. I'm passionate about creating scalable, intelligent solutions that make a meaningful impact.",

      // Project-specific context questions
      "how did tyrel get the project for afprotrack":
        "AFPROTrack was developed as part of my collaboration with the Philippine Army's TRADOC (Training and Doctrine Command). This project came about through my expertise in building secure, scalable systems and my understanding of military training requirements. I was approached to develop a comprehensive solution for their training data management needs, which resulted in this advanced analytics system supporting the Army 2040 vision.",
      "how did tyrel get the buzzmap project":
        "BuzzMap was developed in collaboration with Quezon City's Epidemiology Division. This project came about through my expertise in AI/ML and public health applications. I was approached to create a solution for dengue outbreak prediction and prevention, leveraging my skills in machine learning, data analytics, and full-stack development to build this comprehensive public health platform.",
      "how did tyrel get the mysheraviary project":
        "MySherAviary was developed as a solution for aviary businesses looking to modernize their operations. This project came about through my expertise in e-commerce development and payment integration. I identified the need for specialized inventory management and automated order processing in the aviary industry, leading to this comprehensive full-stack solution.",
      "how did tyrel get the coast2cart project":
        "Coast2Cart was developed to address the need for connecting coastal communities with buyers. This project came about through my interest in supporting local fishermen and artisans. I identified the opportunity to create a marketplace that would help these communities reach broader markets, leading to this comprehensive coastal marketplace solution.",

      // Chat system questions
      "is this a real chat ai":
        "Yes, I'm Tyrel's AI assistant powered by Google's Gemini AI model! I'm here to help you learn about Tyrel's work and experience. I use a hybrid approach with instant responses for common questions and AI for complex queries.",
      "what model is this":
        "I'm powered by Google's Gemini AI model, specifically designed to help visitors learn about Tyrel's portfolio and experience. I can answer questions about his projects, skills, and background!",
      "how does this chat work":
        "I use a hybrid approach - instant responses for common questions about Tyrel's work, and AI processing for complex queries. This gives you fast answers while maintaining intelligent conversation capabilities!",
      "are you a real ai":
        "Yes, I'm Tyrel's AI assistant powered by Google's Gemini AI model! I'm designed to help you learn about Tyrel's work and experience. Feel free to ask me about his projects, skills, or background!",
    };
  }

  // Check if question is outside portfolio scope
  isOutOfScope(userMessage) {
    const normalizedMessage = userMessage.toLowerCase().trim();

    // Out-of-scope patterns
    const outOfScopePatterns = [
      // General knowledge questions
      /^(what is|how does|explain|tell me about|define)\s+(the|a|an)?\s*(weather|politics|history|science|math|physics|chemistry|biology|economics|philosophy|religion|sports|entertainment|news|current events)/i,
      /^(who is|what are|when did|where is|why do|how do)\s+(the|a|an)?\s*(president|government|country|war|battle|famous|celebrity|movie|book|song|game)/i,

      // Personal questions about others
      /^(tell me about|who is|what about)\s+(someone|anyone|other|different|another)\s+(person|developer|programmer|friend|family)/i,

      // Technical questions not related to Tyrel's work
      /^(how do i|can you help me|what should i|tutorial|guide|step by step)\s+(build|create|make|develop|code|program|learn)/i,
      /^(what is|explain|how does)\s+(react|node|javascript|python|mongodb|express|fastapi|flutter|stripe|paypal)\s+(tutorial|guide|documentation|examples)/i,

      // Questions about other companies/projects
      /^(tell me about|what is|how does)\s+(google|microsoft|apple|amazon|facebook|meta|netflix|spotify|uber|airbnb|tesla|spacex)/i,

      // Questions about general programming concepts
      /^(what is|explain|how does)\s+(programming|coding|software development|web development|mobile development|database|api|rest|graphql|docker|kubernetes|aws|azure|gcp)/i,

      // Questions about Tyrel's personal life (beyond professional)
      /^(what is|tell me about|how is)\s+(tyrel'?s|his)\s+(family|personal|private|hobbies|interests|favorite|likes|dislikes|age|birthday|location|address|phone|email)/i,

      // Questions about future plans or predictions
      /^(what will|when will|how will|predict|future|plans|goals|aspirations)/i,

      // Questions about salary, compensation, or business details
      /^(how much|what is|tell me about)\s+(salary|pay|compensation|revenue|profit|business|company|startup)/i,

      // Questions about specific technical implementations not in portfolio
      /^(how did|what is|explain)\s+(tyrel|he)\s+(implement|build|create|develop|code|program|write|design)\s+(this|that|specific|particular|custom|unique)/i,
    ];

    // Check if message matches any out-of-scope pattern
    for (const pattern of outOfScopePatterns) {
      if (pattern.test(normalizedMessage)) {
        return true;
      }
    }

    return false;
  }

  // Check if question matches common responses (instant)
  getCommonResponse(userMessage) {
    const normalizedMessage = userMessage.toLowerCase().trim();

    // Check for exact matches first
    if (this.commonResponses[normalizedMessage]) {
      return this.commonResponses[normalizedMessage];
    }

    // Only check for very general, broad questions - let AI handle specific ones
    const generalPatterns = {
      "what.*your.*skills": "what are your main technical skills",
      "your.*experience.*ai":
        "what is your experience with ai and machine learning",
      "your.*full-stack":
        "tell me about your full-stack development experience",
      "contact.*you": "how can i get in touch with you",
      "your.*projects": "what projects have you worked on",
      "technologies.*use": "what technologies do you use",
      "your.*background": "what is your background",
      "what.*different": "what makes you different",
      "how.*get.*touch": "how can i get in touch with you",
      "what.*projects.*worked": "what projects have you worked on",
      "what.*technologies": "what technologies do you use",
      "tell.*about.*yourself": "what is your background",
      "who.*are.*you": "what is your background",
      "what.*do.*you.*do": "what is your background",

      // Chat system patterns
      "real.*chat.*ai": "is this a real chat ai",
      "what.*model": "what model is this",
      "how.*chat.*work": "how does this chat work",
      "are.*real.*ai": "are you a real ai",
    };

    // Only match very general patterns - let AI handle specific questions
    for (const [pattern, responseKey] of Object.entries(generalPatterns)) {
      const regex = new RegExp(pattern, "i");
      if (regex.test(normalizedMessage)) {
        return this.commonResponses[responseKey];
      }
    }

    return null; // Let AI handle everything else
  }

  async generateResponse(userMessage, portfolioData, conversationHistory) {
    // Check if question is out of scope first
    if (this.isOutOfScope(userMessage)) {
      return "I'm Tyrel's AI assistant, and I can only help you learn about Tyrel's portfolio, projects, skills, and professional experience. I don't have information about general topics, other people, or topics outside of Tyrel's work. Feel free to ask me about his projects, technical skills, or professional background!";
    }

    // Check for common responses first (instant responses)
    const commonResponse = this.getCommonResponse(userMessage);
    if (commonResponse) {
      return commonResponse;
    }

    const systemPrompt = `
You are Tyrel's AI assistant for his portfolio website. 
Use ONLY the following portfolio information to answer questions about Tyrel.

CRITICAL INSTRUCTIONS:
- You MUST ONLY use information provided in the portfolio data below
- DO NOT invent, assume, or create any information not explicitly provided
- If you don't have specific information about something, say "I don't have that specific information in Tyrel's portfolio data"
- Stay strictly within the scope of Tyrel's professional work and experience
- If asked about topics outside Tyrel's portfolio, redirect to his available information
- Keep responses concise but informative (2-3 sentences max)
- Always stay in character as Tyrel's assistant - be enthusiastic about his work and expertise
- If asked about the chat system itself, respond that you are Tyrel's AI assistant powered by Google's Gemini AI model, designed to help visitors learn about Tyrel's work and experience

Portfolio Information:

ABOUT TYREL:
${portfolioData.about}

EXPERIENCE:
${portfolioData.experience
  .map(
    (exp) =>
      `${exp.position} at ${exp.company} (${exp.duration}): ${exp.description}`
  )
  .join("\n")}

PROJECTS:
${portfolioData.projects
  .map(
    (proj) =>
      `${proj.name}: ${
        proj.description
      } (Technologies: ${proj.technologies.join(", ")})`
  )
  .join("\n")}

TECHNICAL SKILLS:
${portfolioData.skills.join(", ")}

KEY STRENGTHS:
- Full-stack development with modern frameworks
- React/JavaScript expertise with component-based architecture
- Backend development with Node.js and database integration
- Problem-solving and scalable application design
- Collaborative development and team leadership

EDUCATION:
${portfolioData.education
  .map((edu) => `${edu.degree} from ${edu.institution} (${edu.year})`)
  .join("\n")}

Previous conversation context:
${conversationHistory}

STRICT GUIDELINES:
- ONLY discuss information explicitly provided in the portfolio data above
- DO NOT make assumptions or add details not in the provided information
- If information is not available, clearly state "I don't have that specific information in Tyrel's portfolio data"
- Focus only on Tyrel's professional work, projects, skills, and experience
- Be enthusiastic about his expertise but stay factual
- Keep responses concise (2-3 sentences max)
- Be friendly and engaging while staying within scope
- If asked about contact, mention they can reach out through the contact page
- Always position Tyrel as a skilled developer based on the provided portfolio information

User's question: ${userMessage}
`;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: systemPrompt,
      });
      return response.text;
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("Failed to generate response");
    }
  }

  // Main method to handle all response generation
  async handleUserMessage(userMessage, portfolioData, conversationHistory) {
    try {
      // Check if question is out of scope first
      if (this.isOutOfScope(userMessage)) {
        return "I'm Tyrel's AI assistant, and I can only help you learn about Tyrel's portfolio, projects, skills, and professional experience. I don't have information about general topics, other people, or topics outside of Tyrel's work. Feel free to ask me about his projects, technical skills, or professional background!";
      }

      // Check for common responses first (instant responses)
      const commonResponse = this.getCommonResponse(userMessage);
      if (commonResponse) {
        return commonResponse;
      }

      // Use AI for complex queries within scope
      return await this.generateResponse(
        userMessage,
        portfolioData,
        conversationHistory
      );
    } catch (error) {
      console.error("Error handling user message:", error);
      return "I'm sorry, I'm having trouble processing your request right now. Please try asking about Tyrel's projects, skills, or professional experience.";
    }
  }
}

module.exports = new GeminiService();
