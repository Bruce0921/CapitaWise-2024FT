
document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() !== '') {
        addMessageToChat(userInput, 'user-message');
        getBotResponse(userInput);
        document.getElementById('user-input').value = '';
    }
}

function addMessageToChat(message, className) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${className}`;
    messageElement.innerHTML = marked.parse(message);;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function getBotResponse(userInput) {
    const response = await fetch('http://127.0.0.1:5000/api/ask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ question: userInput })
    });
    const data = await response.json();
    // get answer from data
    addMessageToChat(data, 'bot-message');
}
