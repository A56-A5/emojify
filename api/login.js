import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// In-memory storage (in production, use a database)
// Note: This will reset on each serverless function call
// For production, use a proper database like MongoDB, PostgreSQL, or Vercel KV
let users = [];

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
}
