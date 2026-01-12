import { db } from "../config/dbConfig.js";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const createChatLog = async (req, res) => {
  const { question } = req.body;

  if (!question)
    return res.status(400).json({ reply: "No question provided." });

  try {
    const systemPrompt = `
    You are a STRICT K-12 educational chatbot. Follow these rules EXACTLY:

    1. Only answer questions suitable for K-12 students (Grades 1-12).
    2. Topics allowed: Math, English, Science (basic biology, chemistry, physics), Filipino, Araling Panlipunan.
    3. DO NOT answer questions that are college-level, professional, or adult-level topics.
    4. DO NOT give partial answers.
    5. IF the question is NOT clearly within K-12 topics, respond with EXACTLY:
      "Sorry, this question is beyond K-12 education and I cannot answer it."
    6. Do NOT add anything else in refusal responses. No explanations, no suggestions, no extra text.
    7. Do NOT attempt to answer outside of the allowed topics under any circumstance.
    `;

    // Using GPT-4o instead of GPT-3.5
    // I tried using GPT-3.5 turbo but the restriction is out of control
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0, // deterministic responses
      max_tokens: 300,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
    });

    const answer = completion.choices[0].message.content;

    // Chat logging
    db.query(
      "INSERT INTO chat_log (question, answer) VALUES (?, ?)",
      [question, answer],
      (err) => {
        if (err) console.error("Chat log Insert Error:", err);
      }
    );

    res.json({ reply: answer });
  } catch (error) {
    console.error(
      "OpenAI Error:",
      error.response ? error.response.data : error
    );
    res.status(500).json({ reply: "Something went wrong in the backend." });
  }
};

const getChatLog = async (req, res) => {
  db.query("SELECT answer, question from chat_log", (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
};

export { createChatLog, getChatLog };
