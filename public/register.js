// Register page functionality
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    const hiddenBtn = document.getElementById('hiddenRegisterBtn');
    const password = document.getElementById('password');
    const passwordStrength = document.getElementById('passwordStrength');
    const captchaLabel = document.getElementById('captchaLabel');
    const termsText = document.getElementById('termsText');

    let foundHiddenButton = false;

    // Load CAPTCHA question
    loadCaptchaQuestion();
    
    // Load absurd terms
    loadAbsurdTerms();
    
    // Add random positioning to form fields
    randomizeFormPositions();

    // Hidden register button functionality
    hiddenBtn.addEventListener('click', function() {
        if (!foundHiddenButton) {
            foundHiddenButton = true;
            playRandomAnimalSound();
            
            // Show success message
            showMessage('🎉 You found the hidden button! Going to chatroom...', 'success');
            
            // Disable form validation
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.removeAttribute('required');
                input.disabled = true;
            });
            
            // Generate random user data and go directly to chatroom
            setTimeout(() => {
                goToChatroom();
            }, 2000);
        }
    });



    // Password strength indicator
    password.addEventListener('input', function() {
        const value = this.value;
        const length = value.length;
        
        if (length < 50) {
            passwordStrength.textContent = `Need ${50 - length} more characters`;
            passwordStrength.style.color = '#dc3545';
        } else {
            passwordStrength.textContent = '✅ Password meets requirements!';
            passwordStrength.style.color = '#28a745';
        }
    });



    // Load CAPTCHA question from API
    async function loadCaptchaQuestion() {
        try {
            const response = await fetch('/api/captcha-question');
            const data = await response.json();
            captchaLabel.textContent = data.question;
        } catch (error) {
            captchaLabel.textContent = 'How many potatoes can dance?';
        }
    }

    // Load absurd terms from API
    async function loadAbsurdTerms() {
        try {
            const response = await fetch('/api/absurd-terms');
            const data = await response.json();
            termsText.textContent = data.terms;
        } catch (error) {
            termsText.textContent = 'I promise not to train pigeons to code';
        }
    }

    // Go directly to chatroom with random user data
    async function goToChatroom() {
        try {
            // Generate random user data
            const randomNames = ['QuirkyUser', 'HiddenButtonFinder', 'ChatExplorer', 'EmojiLover', 'FunSeeker'];
            const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
            const randomPassword = 'super_secret_password_that_is_long_enough_for_requirements_' + Date.now();
            
            // Create user data
            const userData = {
                fullName: form.querySelector('#fullName').value || 'Anonymous User',
                nickname: form.querySelector('#nickname').value || randomName,
                password: form.querySelector('#password').value || randomPassword,
                contacts: form.querySelector('#contacts').value || 'No contacts provided',
                captchaAnswer: form.querySelector('#captchaAnswer').value || 'Random answer',
                agreedToTerms: true
            };

            // Register the user
            const registerResponse = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const registerResult = await registerResponse.json();

            if (registerResult.success) {
                // Auto-login after registration
                const loginResponse = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        username: userData.nickname, 
                        password: userData.password 
                    })
                });

                const loginResult = await loginResponse.json();

                if (loginResult.success) {
                    // Store user data
                    localStorage.setItem('token', loginResult.token);
                    localStorage.setItem('malayalamName', loginResult.malayalamName);
                    localStorage.setItem('originalUsername', userData.nickname);
                    
                    showMessage(`🎉 Welcome, ${loginResult.malayalamName}! Going to chatroom...`, 'success');
                    setTimeout(() => {
                        window.location.href = 'chatroom.html';
                    }, 1000);
                } else {
                    // If login fails, still go to chatroom with fallback data
                    localStorage.setItem('token', 'fallback_token_' + Date.now());
                    localStorage.setItem('malayalamName', 'കുട്ടൻ ദി മെമ് ലോർഡ്');
                    localStorage.setItem('originalUsername', userData.nickname);
                    
                    showMessage('🎉 Going to chatroom with fallback data...', 'success');
                    setTimeout(() => {
                        window.location.href = '/chatroom';
                    }, 1000);
                }
            } else {
                // If registration fails, still go to chatroom with fallback data
                localStorage.setItem('token', 'fallback_token_' + Date.now());
                localStorage.setItem('malayalamName', 'അമ്മു ദി ട്രോൾ ക്വീൻ');
                localStorage.setItem('originalUsername', 'Anonymous');
                
                showMessage('🎉 Going to chatroom with fallback data...', 'success');
                setTimeout(() => {
                    window.location.href = '/chatroom';
                }, 1000);
            }
        } catch (error) {
            // If everything fails, still go to chatroom with fallback data
            localStorage.setItem('token', 'fallback_token_' + Date.now());
            localStorage.setItem('malayalamName', 'ബാബു ദി ചാറ്റ് മാസ്റ്റർ');
            localStorage.setItem('originalUsername', 'Anonymous');
            
            showMessage('🎉 Going to chatroom with fallback data...', 'success');
            setTimeout(() => {
                window.location.href = '/chatroom';
            }, 1000);
        }
    }

    // Play random animal sound
    function playRandomAnimalSound() {
        const sounds = ['goatSound', 'walrusSound', 'catSound'];
        const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
        const audio = document.getElementById(randomSound);
        
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.log('Audio play failed:', e));
        }
    }

    // Show message
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

    // Add some random movements to the hidden button
    setInterval(() => {
        if (!foundHiddenButton) {
            const randomX = Math.random() * (window.innerWidth - 20);
            const randomY = Math.random() * (window.innerHeight - 20);
            hiddenBtn.style.left = randomX + 'px';
            hiddenBtn.style.top = randomY + 'px';
        }
    }, 8000); // Move every 8 seconds

    // Additional random movements for extra annoyance
    setInterval(() => {
        if (!foundHiddenButton && Math.random() < 0.3) { // 30% chance
            const randomX = Math.random() * (window.innerWidth - 20);
            const randomY = Math.random() * (window.innerHeight - 20);
            hiddenBtn.style.left = randomX + 'px';
            hiddenBtn.style.top = randomY + 'px';
        }
    }, 3000); // Check every 3 seconds

    // Easter egg: Konami code
    let konamiCode = [];
    const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
    
    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.keyCode);
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            // Konami code activated!
            showMessage('🎮 Konami code activated! Hidden button revealed!', 'success');
            hiddenBtn.style.transform = 'translate(-50%, -50%) scale(8)';
            hiddenBtn.style.background = 'rgba(102, 126, 234, 0.9)';
            hiddenBtn.style.borderColor = 'rgba(102, 126, 234, 0.9)';
            hiddenBtn.style.color = 'white';
            hiddenBtn.style.fontSize = '20px';
            setTimeout(() => {
                hiddenBtn.style.transform = 'translate(-50%, -50%) scale(1)';
                hiddenBtn.style.background = 'rgba(102, 126, 234, 0.1)';
                hiddenBtn.style.borderColor = 'rgba(102, 126, 234, 0.2)';
                hiddenBtn.style.color = 'rgba(102, 126, 234, 0.3)';
                hiddenBtn.style.fontSize = '4px';
            }, 5000);
        }
    });
    
    // Randomize form field positions
    function randomizeFormPositions() {
        const formGroups = form.querySelectorAll('.form-group');
        const container = document.querySelector('.register-card');
        
        formGroups.forEach((group, index) => {
            // Add random positioning every few seconds
            setInterval(() => {
                if (!foundHiddenButton) { // Only randomize if hidden button not found
                    const containerRect = container.getBoundingClientRect();
                    const maxX = containerRect.width - group.offsetWidth - 40;
                    const maxY = containerRect.height - group.offsetHeight - 40;
                    
                    const randomX = Math.random() * maxX;
                    const randomY = Math.random() * maxY;
                    const randomRotation = (Math.random() - 0.5) * 10; // -5 to 5 degrees
                    
                    group.style.position = 'absolute';
                    group.style.left = randomX + 'px';
                    group.style.top = randomY + 'px';
                    group.style.transform = `rotate(${randomRotation}deg)`;
                    group.style.transition = 'all 0.8s ease';
                    
                    // Add random color tint
                    const randomHue = Math.random() * 360;
                    group.style.filter = `hue-rotate(${randomHue}deg)`;
                }
            }, 3000 + (index * 500)); // Stagger the timing
        });
    }
}); 