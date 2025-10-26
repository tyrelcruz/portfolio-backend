const express = require("express");
const router = express.Router();
const Conversation = require("../models/conversation");
const PortfolioData = require("../models/portfolioData");
const geminiService = require("../services/geminiService");

// Get or create conversation
router.get("/conversation/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    let conversation = await Conversation.findOne({ sessionId });

    if (!conversation) {
      conversation = new Conversation({ sessionId, messages: [] });
      await conversation.save();
    }

    res.json(conversation);
  } catch (error) {
    console.error("Error getting conversation:", error);
    res.status(500).json({ error: error.message });
  }
});

// Send message
router.post("/message", async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
      return res
        .status(400)
        .json({ error: "Session ID and message are required" });
    }

    // Get portfolio data
    const portfolioData = await PortfolioData.findOne();
    if (!portfolioData) {
      return res.status(404).json({ error: "Portfolio data not found" });
    }

    // Get or create conversation
    let conversation = await Conversation.findOne({ sessionId });
    if (!conversation) {
      conversation = new Conversation({ sessionId, messages: [] });
    }

    // Add user message
    conversation.messages.push({
      role: "user",
      content: message,
    });

    // Get conversation history for context
    const conversationHistory = conversation.messages
      .slice(-10) // Last 10 messages for context
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");

    // Use the new handleUserMessage method that includes out-of-scope checking
    const aiResponse = await geminiService.handleUserMessage(
      message,
      portfolioData,
      conversationHistory
    );

    // Add AI response
    conversation.messages.push({
      role: "assistant",
      content: aiResponse,
    });

    conversation.updatedAt = new Date();
    await conversation.save();

    res.json({
      response: aiResponse,
      conversation: conversation,
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to process message" });
  }
});

// Get all conversations (for admin purposes)
router.get("/conversations", async (req, res) => {
  try {
    const conversations = await Conversation.find()
      .sort({ updatedAt: -1 })
      .limit(50);

    res.json(conversations);
  } catch (error) {
    console.error("Error getting conversations:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
