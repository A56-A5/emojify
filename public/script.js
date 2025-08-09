// Login page functionality
async function fetchNameAndQuestion() {
    try {
        // Fetch the Malayalam character name
        const nameRes = await fetch("/api/generate-name");
        const { name } = await nameRes.json();
        document.getElementById("username").textContent = name;

        // Fetch the weird question
        const qRes = await fetch("/api/generate-question");
        const { question } = await qRes.json();
        document.getElementById("absurd-question").textContent = question;
    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById("username").textContent = "Kuttan the Meme Lord";
        document.getElementById("absurd-question").textContent = "If you could be any kitchen utensil, which one would you be and why?";
    }
}

// Initialize the page
fetchNameAndQuestion();

// Jumping button functionality
const loginBtn = document.getElementById("login-btn");
const buttonContainer = document.querySelector(".button-container");
let moveCount = 0;
let isMoving = false;

function moveButton() {
    if (moveCount >= 5) return; // Stop after 5 moves
    
    isMoving = true;
    const containerRect = buttonContainer.getBoundingClientRect();
    const btnRect = loginBtn.getBoundingClientRect();
    
    // Calculate random position within container bounds
    const maxX = containerRect.width - btnRect.width - 20;
    const maxY = containerRect.height - btnRect.height - 20;
    
    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;
    
    loginBtn.style.position = "absolute";
    loginBtn.style.left = `${newX}px`;
    loginBtn.style.top = `${newY}px`;
    
    moveCount++;
    
    // Add some visual feedback
    loginBtn.style.transform = "scale(1.1)";
    setTimeout(() => {
        loginBtn.style.transform = "scale(1)";
        isMoving = false;
    }, 200);
}

// Move button on hover
loginBtn.addEventListener("mouseenter", () => {
    if (!isMoving && moveCount < 5) {
        setTimeout(moveButton, 100);
    }
});

// Move button on click attempt
loginBtn.addEventListener("click", (e) => {
    if (moveCount < 5) {
        e.preventDefault();
        moveButton();
        return;
    }
    
    // After 5 moves, allow login
    const username = document.getElementById("username").textContent;
    localStorage.setItem("username", username);
    window.location.href = "chat.html";
});

// Add some random movements for extra annoyance
setInterval(() => {
    if (moveCount < 3 && !isMoving) {
        const shouldMove = Math.random() < 0.3; // 30% chance
        if (shouldMove) {
            moveButton();
        }
    }
}, 2000);

// Add keyboard support for accessibility
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && document.activeElement.id === "answer") {
        loginBtn.focus();
    }
});
