
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory storage (in production, use a database)
const users = [];
const messages = [];

// Malayalam meme character names
const malayalamNames = [
  "കുട്ടൻ ദി മെമ് ലോർഡ്",
  "അമ്മു ദി ട്രോൾ ക്വീൻ",
  "ബാബു ദി ചാറ്റ് മാസ്റ്റർ",
  "മോളി ദി ഇമോജി വിസാർഡ്",
  "അച്ഛൻ ദി ഹിഡൻ ബട്ടൺ ഹണ്ടർ",
  "ചെന്നായ് ദി കാപ്ച ക്രാക്കർ",
  "പാപ്പൻ ദി റിവേഴ്സ് ടെക്സ്റ്റ് ജിനിയസ്",
  "മാമൻ ദി ക്വിർക്കി ക്വിസ് മാസ്റ്റർ",
  "അപ്പൻ ദി ഗോട്ട് സ്ക്രീം ലവർ",
  "അമ്മ ദി വാൽറസ് വിസ്പർ"
];

// Bizarre CAPTCHA questions
const captchaQuestions = [
  "How many potatoes can dance?",
  "What color is the sound of silence?",
  "How many unicorns fit in a teacup?",
  "What does a cloud taste like?",
  "How many dreams can you fit in a shoebox?",
  "What's the square root of a rainbow?",
  "How many thoughts can dance on the head of a pin?",
  "What's the weight of a shadow?",
  "How many memories can you fit in a thimble?",
  "What's the speed of a sleeping turtle?"
];

// Absurd terms
const absurdTerms = [
  "I promise not to train pigeons to code",
  "I will never teach my cat to drive",
  "I agree to never use a spoon as a phone",
  "I promise not to dance with vegetables",
  "I will never try to catch clouds with a net",
  "I agree to never use socks as mittens",
  "I promise not to have conversations with my shoes",
  "I will never try to cook with a hairdryer",
  "I agree to never use a banana as a phone",
  "I promise not to teach my plants to sing"
];

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/login', (req, res) => {
  // Redirect to register page since we're going directly to chatroom
  res.redirect('/');
});

app.get('/chatroom', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chatroom.html'));
});

// API Routes
app.get('/api/captcha-question', (req, res) => {
  const randomQuestion = captchaQuestions[Math.floor(Math.random() * captchaQuestions.length)];
  res.json({ question: randomQuestion });
});

app.get('/api/absurd-terms', (req, res) => {
  const randomTerms = absurdTerms[Math.floor(Math.random() * absurdTerms.length)];
  res.json({ terms: randomTerms });
});

app.post('/api/register', async (req, res) => {
  try {
    const { fullName, nickname, password, confirmPassword, contacts, captchaAnswer, agreedToTerms } = req.body;
    
    // Check if user already exists
    const existingUser = users.find(user => user.nickname === nickname);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const newUser = {
      id: Date.now().toString(),
      fullName,
      nickname,
      password: hashedPassword,
      contacts,
      createdAt: new Date()
    };
    
    users.push(newUser);
    
    res.json({ success: true, message: 'Registration successful!' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const user = users.find(u => u.nickname === username);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid password' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, nickname: user.nickname },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );
    
    // Get random Malayalam name
    const malayalamName = malayalamNames[Math.floor(Math.random() * malayalamNames.length)];
    
    res.json({ 
      success: true, 
      token, 
      malayalamName,
      message: 'Login successful!' 
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const { message, username } = req.body;
    
    // Call Gemini API to reverse the message and add emojis
    const geminiPrompt = `Take this message: "${message}" and reverse its meaning to the opposite. For example:
    - "I love you so much" → "I hate you so much"
    - "You are amazing" → "You are terrible"
    - "This is great" → "This is awful"
    - "I'm happy" → "I'm sad"
    
    Then add 3-5 relevant emojis at the end. Return only the reversed message with emojis, no explanation.`;
    
    let processedMessage;
    
    try {
      // Call Gemini API
      const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: geminiPrompt }] }]
        })
      });

      const geminiData = await geminiResponse.json();
      processedMessage = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
      
      // If Gemini fails, fallback to simple reversal
      if (!processedMessage) {
        throw new Error('Gemini API returned empty response');
      }
    } catch (geminiError) {
      console.error('Gemini API Error:', geminiError);
      // Fallback: simple reversal with random emojis
      const reversedMessage = message.split('').reverse().join('');
      const emojis = ['😀', '😂', '🤣', '😊', '😇', '🙂', '😉', '😍', '🥰', '😘', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '💩', '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'];
      const randomEmojis = emojis[Math.floor(Math.random() * emojis.length)] + 
                          emojis[Math.floor(Math.random() * emojis.length)] + 
                          emojis[Math.floor(Math.random() * emojis.length)];
      processedMessage = reversedMessage + ' ' + randomEmojis;
    }
    
    const newMessage = {
      id: Date.now().toString(),
      original: message,
      processed: processedMessage,
      username,
      timestamp: new Date()
    };
    
    messages.push(newMessage);
    
    res.json({ 
      success: true, 
      message: newMessage 
    });
  } catch (error) {
    console.error('Message processing error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

app.get('/api/messages', (req, res) => {
  res.json({ messages });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Quirky WebApp running on port ${PORT}`);
  console.log(`📝 Register: http://localhost:${PORT}`);
  console.log(`🔐 Login: http://localhost:${PORT}/login`);
  console.log(`💬 Chatroom: http://localhost:${PORT}/chatroom`);
}); 