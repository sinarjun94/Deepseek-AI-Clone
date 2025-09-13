import OpenAI from "openai";
import { Prompt } from "../model/prompt.model.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.together.xyz/v1",
});

export const sendPrompt = async (req, res) => {
  const { content } = req.body;
  const userId = req.userId;

  if (!content || content.trim() === "") {
    return res.status(400).json({ errors: "Prompt content is required." });
  }

  try {
    await Prompt.create({
      userId,
      role: "user",
      content: content.trim(),
    });

    const completion = await openai.chat.completions.create({
      model: "moonshotai/Kimi-K2-Instruct", // or "meta-llama-3-70b-instruct"
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: content.trim() },
      ],
    });

    const aiContent = completion.choices[0].message.content;

    await Prompt.create({
      userId,
      role: "assistant",
      content: aiContent,
    });

    return res.status(200).json({ reply: aiContent });
  } catch (error) {
    console.error(
      "Error in sendPrompt:",
      error.response?.data || error.message || error
    );
    return res.status(500).json({
      error: "Something went wrong with the AI response",
      detail: error.message,
    });
  }
};
