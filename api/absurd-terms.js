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

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const randomTerms = absurdTerms[Math.floor(Math.random() * absurdTerms.length)];
  res.json({ terms: randomTerms });
}
