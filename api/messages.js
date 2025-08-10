// In-memory storage (in production, use a database)
// Note: This will reset on each serverless function call
// For production, use a proper database like MongoDB, PostgreSQL, or Vercel KV
let messages = [];

export default async function handler(req, res) {
  // Handle GET request - retrieve messages
  if (req.method === 'GET') {
    return res.json({ messages });
  }

  // Handle POST request - create new message
  if (req.method === 'POST') {
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
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
}
