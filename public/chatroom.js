// Chatroom functionality
document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('message');
    const sendBtn = document.getElementById('sendBtn');
    const chatBox = document.getElementById('chatBox');
    const userSpan = document.getElementById('user');
    const logoutBtn = document.getElementById('logoutBtn');

    // Check if user is logged in
    const token = localStorage.getItem('token');
    const malayalamName = localStorage.getItem('malayalamName');
    const originalUsername = localStorage.getItem('originalUsername');

    if (!token || !malayalamName) {
        window.location.href = '/';
        return;
    }

    // Set the Malayalam name
    userSpan.textContent = malayalamName;

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

    // Logout functionality with random position on hover
    logoutBtn.addEventListener('mouseenter', function() {
        // Move to random position within the container
        const container = document.querySelector('.chat-container');
        const containerRect = container.getBoundingClientRect();
        const buttonRect = logoutBtn.getBoundingClientRect();
        
        const maxX = containerRect.width - buttonRect.width - 40; // 40px padding
        const maxY = containerRect.height - buttonRect.height - 40;
        
        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;
        
        logoutBtn.style.position = 'absolute';
        logoutBtn.style.left = randomX + 'px';
        logoutBtn.style.top = randomY + 'px';
        logoutBtn.style.right = 'auto';
        
        // Add random rotation
        const randomRotation = (Math.random() - 0.5) * 20; // -10 to 10 degrees
        logoutBtn.style.transform = `rotate(${randomRotation}deg) scale(1.1)`;
        
        // Add random color
        const randomHue = Math.random() * 360;
        logoutBtn.style.filter = `hue-rotate(${randomHue}deg)`;
    });
    
    logoutBtn.addEventListener('click', function() {
        // Make the button jump around for a few seconds
        logoutBtn.classList.add('jumping');
        
        // Play a weird sound (if available)
        try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
            audio.volume = 0.3;
            audio.play();
        } catch (e) {
            console.log('Audio not supported');
        }
        
        // Jump for 3 seconds then logout
        setTimeout(() => {
            logoutBtn.classList.remove('jumping');
            
            // Add some final annoying effects
            logoutBtn.style.transform = 'rotate(720deg) scale(2)';
            logoutBtn.style.filter = 'hue-rotate(360deg)';
            
            setTimeout(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('malayalamName');
                localStorage.removeItem('originalUsername');
                window.location.href = '/';
            }, 1000);
        }, 3000);
    });

    async function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;

        // Disable input and show loading
        messageInput.disabled = true;
        sendBtn.disabled = true;
        sendBtn.textContent = '🤖 AI Processing...';

        try {
            // Send message to API
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    message, 
                    username: malayalamName 
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (data.success) {
                // Add message to chat
                addMessageToChat(malayalamName, data.message.processed, data.message.original);

                // Clear input
                messageInput.value = '';
                messageInput.style.height = 'auto';
            } else {
                throw new Error(data.error || 'Failed to send message');
            }
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

    function addMessageToChat(user, processedMessage, originalMessage) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message';

        // Add SUPER ANNOYING random rotation and offset for weird alignment
        const randomRotation = (Math.random() - 0.5) * 8; // -4 to 4 degrees
        const randomOffset = (Math.random() - 0.5) * 40; // -20 to 20 pixels
        const randomScale = 0.9 + Math.random() * 0.2; // 0.9 to 1.1 scale
        const randomHue = Math.random() * 360; // Random hue rotation
        
        messageDiv.style.transform = `rotate(${randomRotation}deg) translateX(${randomOffset}px) scale(${randomScale})`;
        messageDiv.style.filter = `hue-rotate(${randomHue}deg)`;

        messageDiv.innerHTML = `
            <div class="message-emoji">${processedMessage}</div>
            <div class="message-original">${originalMessage}</div>
        `;

        chatBox.appendChild(messageDiv);

        // Scroll to bottom with annoying bounce
        setTimeout(() => {
            chatBox.scrollTop = chatBox.scrollHeight;
            setTimeout(() => {
                chatBox.scrollTop = chatBox.scrollHeight - 10;
                setTimeout(() => {
                    chatBox.scrollTop = chatBox.scrollHeight;
                }, 100);
            }, 50);
        }, 100);

        // Add a SUPER ANNOYING animation
        messageDiv.style.opacity = '0';
        messageDiv.style.transform += ' translateY(50px) rotate(180deg)';

        setTimeout(() => {
            messageDiv.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = `rotate(${randomRotation}deg) translateX(${randomOffset}px) scale(${randomScale}) translateY(0px)`;
        }, 10);

        // Add random wiggle effect to the message
        setInterval(() => {
            if (Math.random() < 0.3) { // 30% chance every interval
                const wiggleRotation = randomRotation + (Math.random() - 0.5) * 2;
                messageDiv.style.transform = `rotate(${wiggleRotation}deg) translateX(${randomOffset}px) scale(${randomScale})`;
            }
        }, 3000 + Math.random() * 2000);
    }

    // Focus on input when page loads
    messageInput.focus();

    // Add some fun welcome messages
    setTimeout(() => {
        const welcomeMessages = [
            "🎉 Ready to reverse your thoughts!",
            "✨ Let's turn your words upside down!",
            "🌟 Your messages are about to get weird!",
            "🎭 Time to transform your chat into chaos!"
        ];

        const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
        addMessageToChat('System', randomMessage, 'Welcome message');
    }, 1000);

    // Add some quirky UI animations
    const chatContainer = document.querySelector('.chat-container');
    let isWiggling = false;

    // Random wiggle effect
    setInterval(() => {
        if (!isWiggling && Math.random() < 0.1) { // 10% chance every interval
            isWiggling = true;
            chatContainer.style.transform = 'rotate(-0.5deg)';
            setTimeout(() => {
                chatContainer.style.transform = 'rotate(0.5deg)';
                setTimeout(() => {
                    chatContainer.style.transform = 'rotate(0deg)';
                    isWiggling = false;
                }, 200);
            }, 200);
        }
    }, 5000);

    // Easter egg: Type "help" to see a funny message
    messageInput.addEventListener('input', function() {
        if (this.value.toLowerCase() === 'help') {
            addMessageToChat('System', '🤖 Help? In this chatroom, we don\'t need help - we need chaos!', 'Help message');
        }
    });

    // Load existing messages (if any)
    loadExistingMessages();

    async function loadExistingMessages() {
        try {
            const response = await fetch('/api/messages', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                data.messages.forEach(msg => {
                    addMessageToChat(msg.username, msg.processed, msg.original);
                });
            }
        } catch (error) {
            console.log('No existing messages to load');
        }
    }
}); 