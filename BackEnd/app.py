from flask import Flask, jsonify, request
from gpt import answer_question
from flask_cors import CORS


app = Flask(__name__)
CORS(app, supports_credentials=True)

@app.route('/')
def home():
    return "Welcome to the Flask API!"

@app.route('/api/ask', methods=['POST'])
def ask_question():
    question = request.json['question']
    answer = answer_question(question=question)
    return jsonify(answer)

if __name__ == '__main__':
    app.run(debug=True)