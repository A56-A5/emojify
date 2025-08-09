import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Allow inline scripts in CSP so our frontend works without Live Server
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "script-src 'self' 'unsafe-inline'; object-src 'self'"
  );
  next();
});

// Load API keys
const apiKeys = JSON.parse(fs.readFileSync("apiKeys.json", "utf8"));
let currentKeyIndex = 0;
console.log(`API keys loaded: ${apiKeys.length}`);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

function getNextGeminiClient() {
  const key = apiKeys[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
  return new GoogleGenerativeAI(key);
}

app.post("/api/login", (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Username required" });
  res.json({ success: true });
});

app.post("/api/emoji", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text required" });

  try {
    const genAI = getNextGeminiClient();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Convert the following text message into emojis only, no words at all. Keep the meaning clear: "${text}"`;

    const result = await model.generateContent(prompt);
    res.json({ emoji: result.response.text(), original: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gemini API failed" });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
