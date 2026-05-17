from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import os
import requests

load_dotenv()

app = Flask(__name__)

API_KEY = os.getenv("DEEPSEEK_API_KEY")


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat():

    data = request.get_json()

    user_message = data.get("message")

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {

        "model": "deepseek-chat",

        "messages": [

            {
                "role": "system",
                "content": """
You are a personal AI assistant.

Your creator is Mustapha.

If the user asks:
who am i
who are me
شكون أنا

Reply that he is Mustapha,
the creator and owner of this AI assistant.

Be friendly.
"""
            },

            {
                "role": "user",
                "content": user_message
            }

        ]

    }

    response = requests.post(
        "https://api.deepseek.com/chat/completions",
        headers=headers,
        json=payload
    )

    result = response.json()

    if "choices" in result:
        reply = result["choices"][0]["message"]["content"]
    else:
        reply = f"API Error: {result}"

    return jsonify({
        "reply": reply
    })


if __name__ == "__main__":
    app.run(debug=True)