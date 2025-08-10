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

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const randomQuestion = captchaQuestions[Math.floor(Math.random() * captchaQuestions.length)];
  res.json({ question: randomQuestion });
}
