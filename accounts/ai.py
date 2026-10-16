from dotenv import load_dotenv
load_dotenv()

import os
from google import genai


api_key = os.getenv("GEMINI_API_KEY")

print("Key loaded:", bool(api_key))
print("Key length:", len(api_key) if api_key else 0)


client = genai.Client(api_key=api_key)

while True:
    question = input("You: ")

    if question.lower() == "exit":
        break

    response = client.interactions.create(
        model="gemini-3.8-flash",
        input=question
    )

    print("Answer:", response.output_text)