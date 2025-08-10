import bcrypt from 'bcryptjs';

// In-memory storage (in production, use a database)
// Note: This will reset on each serverless function call
// For production, use a proper database like MongoDB, PostgreSQL, or Vercel KV
let users = [];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
}
