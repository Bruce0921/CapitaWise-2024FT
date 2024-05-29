document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

const voiceToggleBtn = document.getElementById('voice-toggle-btn');
let recognition;
let recognizing = false;

function initializeRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.interimResults = false;
    recognition.continuous = true;  // Keep listening continuously
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        const userInput = event.results[event.results.length - 1][0].transcript;
        document.getElementById('user-input').value = userInput;
        sendMessage();
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error detected: ' + event.error);
        if (event.error === 'no-speech' || event.error === 'aborted') {
            recognition.stop();
            recognition.start();
        }
    };

    recognition.onend = () => {
        if (recognizing) {
            recognition.start();  // Restart recognition when it ends
        }
    };
}

function toggleRecognition() {
    if (!recognition) {
        initializeRecognition();
    }

    if (recognizing) {
        recognition.stop();
        voiceToggleBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    } else {
        recognition.start();
        voiceToggleBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
    }

    recognizing = !recognizing;
}

voiceToggleBtn.addEventListener('click', toggleRecognition);

function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() !== '') {
        addMessageToChat(userInput, 'user-message');
        showLoadingSpinner();
        getBotResponse(userInput);
        document.getElementById('user-input').value = '';
    }
}

function showLoadingSpinner() {
    const chatBox = document.getElementById('chat-box');
    const loadingElement = document.createElement('div');
    loadingElement.className = 'message bot-message';
    loadingElement.id = 'loading-spinner';
    loadingElement.innerHTML = `
        <div class="loading-spinner">
            <div></div><div></div><div></div>
        </div>`;
    chatBox.appendChild(loadingElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function hideLoadingSpinner() {
    const loadingElement = document.getElementById('loading-spinner');
    if (loadingElement) {
        loadingElement.remove();
    }
}

function addMessageToChat(message, className) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${className}`;
    messageElement.innerHTML = marked.parse(message);
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
    hideLoadingSpinner();
    addMessageToChat(data, 'bot-message');
   /*  speakResponse(data); */
}

/* function speakResponse(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    synth.speak(utterance);
}
 */