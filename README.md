# CapitaWise - AI-Driven Customer Service Chatbot for Chase Bank

## Overview

CapitaWise is an advanced AI-driven chatbot designed to revolutionize customer service for financial institutions, with an initial focus on Chase Bank. Powered by state-of-the-art Large Language Models (LLMs), CapitaWise offers seamless, intuitive, and efficient customer interactions. It addresses common issues faced by traditional customer service approaches and existing chatbot solutions, providing accurate and actionable assistance to users.

## Features

- **Natural Language Understanding**: Understands and processes complex queries.
- **Voice and Text Interaction**: Supports both text and voice inputs and outputs.
- **Contextual Awareness**: Maintains context in multi-turn conversations.
- **Personalized Recommendations**: Offers tailored advice based on user data.
- **Proactive Assistance**: Provides timely alerts and notifications.
- **Enhanced Security**: Ensures safe and secure transactions and data exchanges.

## Pricing Plans

1. **Enterprise Plan** ($15,000/month)
   - Unlimited queries
   - Custom integration
   - Advanced analytics and reporting
   - Dedicated account manager and 24/7 support

2. **Premium Plan** ($7,000/month)
   - Up to 500,000 queries per month
   - Basic API integration
   - Standard analytics and reporting
   - Regular business hour support

3. **Standard Plan** ($2,000/month)
   - Up to 100,000 queries per month
   - Core API integration
   - Email support within 48 hours

## Architecture

### Frontend

- **Technologies**: HTML, CSS, JavaScript, SwiftUI
- **Files**:
  - `index.html`: Main chat interface
  - `styles.css`: Styling for the user interface
  - `scripts.js`: Manages interactions, voice recognition, and API calls

### Backend

- **Technologies**: Flask, OpenAI GPT-4o
- **Files**:
  - `app.py`: Flask application, routes setup, API request handling
  - `gpt.py`: Interaction with OpenAI GPT-4o model

### Speech Processing

- **Speech-to-Text**: Web Speech API for converting spoken input to text
- **Text-to-Speech**: OpenAI’s Text-to-Speech (TTS) API for converting text responses to speech

### Database

- **Functionality**: Stores user interactions, preferences, and session data for personalized experiences

## Installation

### Prerequisites

- Python 3.x
- Flask
- OpenAI API key

### Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/CapitaWise.git
   cd CapitaWise
