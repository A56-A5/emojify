let username = "";

document.getElementById("login-btn").addEventListener("click", async () => {
  username = document.getElementById("username").value.trim();
  if (!username) return alert("Enter username");

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username })
  });

  const data = await res.json();
  if (data.success) {
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("chat-screen").style.display = "block";
  }
});

document.getElementById("send-btn").addEventListener("click", async () => {
  const text = document.getElementById("message").value.trim();
  if (!text) return;

  const res = await fetch("/api/emoji", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  const data = await res.json();
  if (data.emoji) {
    addMessage(username, data.emoji, data.original);
    document.getElementById("message").value = "";
  }
});

function addMessage(user, emojiMsg, originalText) {
  const box = document.getElementById("chat-box");
  const div = document.createElement("div");
  div.className = "message";
  div.innerHTML = `<strong>${user}:</strong> <span title="${originalText}">${emojiMsg}</span>`;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}
