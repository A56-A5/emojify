// Chat page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Set username from localStorage
    const username = localStorage.getItem("username") || "Anonymous";
    document.getElementById("user").textContent = username;
    
    const messageInput = document.getElementById("message");
    const sendBtn = document.getElementById("sendBtn");
    const chatBox = document.getElementById("chatBox");
    
    // Auto-resize textarea
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 100) + 'px';
    });
    
    // Send message on Enter (but allow Shift+Enter for new line)
    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Send message on button click
    sendBtn.addEventListener('click', sendMessage);
    
    async function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;
        
        // Disable input and show loading
        messageInput.disabled = true;
        sendBtn.disabled = true;
        sendBtn.textContent = '⏳ Processing...';
        
        try {
            // Send message to API
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message })
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            
            // Add message to chat
            addMessageToChat(username, data.emojis, data.original);
            
            // Clear input
            messageInput.value = '';
            messageInput.style.height = 'auto';
            
        } catch (error) {
            console.error('Error sending message:', error);
            addMessageToChat('System', '❌ Error processing message', 'Failed to process your message');
        } finally {
            // Re-enable input
            messageInput.disabled = false;
            sendBtn.disabled = false;
            sendBtn.textContent = '🚀 Send';
            messageInput.focus();
        }
    }
    
    function addMessageToChat(user, emojiMessage, originalMessage) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message';
        
        messageDiv.innerHTML = `
            <div class="message-emoji">${emojiMessage}</div>
            <div class="message-original">${originalMessage}</div>
        `;
        
        chatBox.appendChild(messageDiv);
        
        // Scroll to bottom
        chatBox.scrollTop = chatBox.scrollHeight;
        
        // Add a subtle animation
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            messageDiv.style.transition = 'all 0.3s ease';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 10);
    }
    
    // Focus on input when page loads
    messageInput.focus();
    
    // Add some fun welcome messages based on username
    setTimeout(() => {
        const welcomeMessages = [
            "🎉 Ready to emojify your thoughts!",
            "✨ Let's turn your words into emoji magic!",
            "🌟 Your messages are about to get emoji-fied!",
            "🎭 Time to transform your chat into emoji art!"
        ];
        
        const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
        addMessageToChat('System', randomMessage, 'Welcome message');
    }, 1000);
});
