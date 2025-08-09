# 🎭 Quirky WebApp - A Fun and Weird Chat Application

A completely quirky web application with hidden features, weird interactions, and lots of surprises! This app is designed to be fun, annoying, and entertaining.

## ✨ Features

### 🔍 Register Page
- **Hidden Register Button**: Very small and barely visible button that users must find
- **Magnifying Glass Tool**: Click the magnifying glass to activate search mode (cursor changes)
- **Animal Sounds**: When the hidden button is found, plays random animal meme sounds
- **Form Fields**: Full Name, Nickname, Password (50+ chars), Confirm Password (auto-reverses text), Contacts
- **Bizarre CAPTCHA**: Random absurd questions like "How many potatoes can dance?"
- **Absurd Terms**: Nonsensical agreements like "I promise not to train pigeons to code"
- **Easter Egg**: Konami code (↑↑↓↓←→←→BA) reveals the hidden button

### 🔐 Login Page
- **Single API Call**: All login data sent in one request
- **Malayalam Names**: After login, username transforms into random Malayalam meme character names
- **Quirky Animations**: Form fields rotate slightly when focused

### 💬 Chatroom
- **Message Reversal**: All messages are automatically reversed
- **Random Emojis**: Messages get random emojis appended
- **Hover Tooltips**: Hover over messages to see the original intended text
- **Weird Alignment**: Messages are purposely misaligned, rotated, and offset
- **Random Wiggle**: The entire chat container occasionally wiggles

## 🚀 Quick Start

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Set up Environment Variables**:
   - Copy `env.example` to `.env`
   - Add your API keys and configuration:
   ```
   PORT=3002
   GEMINI_API_KEY=your_gemini_api_key_here
   JWT_SECRET=your_super_secret_jwt_key_here
   NODE_ENV=development
   ```

3. **Start the Server**:
   ```bash
   npm start
   ```

4. **Open in Browser**:
   - Register: `http://localhost:3002`
   - Login: `http://localhost:3002/login`
   - Chatroom: `http://localhost:3002/chatroom`

## 🎯 How to Use

### Registration Process
1. Fill out the form (or don't - it doesn't matter!)
2. Find the hidden register button using the magnifying glass tool
3. Click the hidden button to hear animal sounds and register
4. Or use the Konami code to reveal the button

### Login Process
1. Enter your nickname and password
2. After successful login, your name becomes a Malayalam character
3. Get redirected to the quirky chatroom

### Chatroom Experience
1. Type any message
2. Watch it get reversed and emojified
3. Hover over messages to see the original text
4. Enjoy the weird alignments and random wiggles

## 🛠️ Technical Details

- **Backend**: Node.js with Express
- **Frontend**: Vanilla JavaScript with modern CSS
- **Authentication**: JWT tokens
- **Storage**: In-memory (for demo purposes)
- **Styling**: CSS Grid, Flexbox, and lots of transforms

## 🎨 Design Features

- **Gradient Backgrounds**: Beautiful purple-blue gradients
- **Glass Morphism**: Backdrop blur effects
- **Smooth Animations**: CSS transitions and transforms
- **Responsive Design**: Works on mobile and desktop
- **Quirky Typography**: Poppins font family

## 🐛 Known Quirks

- The hidden button moves randomly every 10 seconds
- Form fields rotate slightly when focused
- Messages have random rotations and offsets
- The chat container occasionally wiggles
- Animal sounds may not play due to browser restrictions

## 🎮 Easter Eggs

- **Konami Code**: ↑↑↓↓←→←→BA reveals the hidden button
- **Admin Detection**: Type "admin" in login to see a funny message
- **Help Command**: Type "help" in chatroom for a sarcastic response

## 📱 Browser Support

- Modern browsers with ES6+ support
- Mobile responsive design
- Works best on Chrome, Firefox, Safari, Edge

## 🔧 Customization

- Modify Malayalam names in `server.js`
- Add more CAPTCHA questions and absurd terms
- Change animal sounds by updating audio sources
- Adjust weird alignment parameters in CSS

## 🚨 Important Notes

- This is a demo application - don't use in production without proper security
- Audio files are external links and may not work
- In-memory storage means data is lost on server restart
- The app is intentionally quirky and weird!

---

**Have fun exploring the quirks! 🎉** 