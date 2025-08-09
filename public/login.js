// Login page functionality
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        if (!username || !password) {
            showMessage('Please fill in all fields!', 'error');
            return;
        }
        
        // Disable form during submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Logging in...';
        
        try {
            // Single API call for login
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Store token and Malayalam name
                localStorage.setItem('token', result.token);
                localStorage.setItem('malayalamName', result.malayalamName);
                localStorage.setItem('originalUsername', username);
                
                showMessage(`🎉 Welcome, ${result.malayalamName}! Redirecting to chatroom...`, 'success');
                
                // Redirect to chatroom after a delay
                setTimeout(() => {
                    window.location.href = '/chatroom';
                }, 2000);
            } else {
                showMessage(result.error || 'Login failed!', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        } catch (error) {
            showMessage('Network error! Please try again.', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });

    // Show message function
    function showMessage(text, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());

        // Create new message
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;
        
        // Insert at the top of the form
        form.insertBefore(message, form.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 5000);
    }

    // Add some quirky animations
    const inputs = form.querySelectorAll('input');
    inputs.forEach((input, index) => {
        input.addEventListener('focus', function() {
            this.style.transform = `rotate(${(index - 1) * 0.5}deg) scale(1.02)`;
        });
        
        input.addEventListener('blur', function() {
            this.style.transform = 'rotate(0deg) scale(1)';
        });
    });

    // Easter egg: Type "admin" to see a funny message
    usernameInput.addEventListener('input', function() {
        if (this.value.toLowerCase() === 'admin') {
            showMessage('👑 Admin detected! But you still need the right password!', 'success');
        }
    });
}); 