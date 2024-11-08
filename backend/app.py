from flask import Flask, request, jsonify
from scrapper.scrape_docs import scrape
from models.ai_model import AIModel
from dotenv import load_dotenv
import os
from flask_cors import CORS
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)
CORS(app)

load_dotenv()

api_key = os.getenv("gemini_gpt_key")
ai_model = AIModel()

@app.route('/scrape', methods=['POST'])
def scrape_endpoint():
    data = request.get_json()
    url = data.get('url')
    
    if not url:
        return jsonify({"error": "URL is required"}), 400
    
    try:
        # Scrape the website
        scraped_data = scrape(url)
        
        # Prepare the context for the AI model
        context = "\n".join([f"URL: {item['url']}\nContent: {item['text']}" for item in scraped_data])
        
        return jsonify({
            "message": "Website scraped successfully!",
            "context": context,
            "scraped_pages": len(scraped_data),
            "metadata": {
                "title": scraped_data[0]['metadata']['title'],
                "description": scraped_data[0]['metadata']['description']
            },
            "extracted_data": {
                "emails": scraped_data[0]['emails'],
                "phones": scraped_data[0]['phones']
            }
        })
    except Exception as e:
        logging.error(f"Error during scraping: {str(e)}")
        return jsonify({"error": "An error occurred during scraping"}), 500

@app.route('/ask', methods=['POST'])
def ask_endpoint():
    data = request.get_json()
    question = data.get('question')
    context = data.get('context')
    
    if not question or not context:
        return jsonify({"error": "Question and context are required"}), 400
    
    try:
        # Use the AI model to answer the question
        answer = ai_model.answer_question(context, question)
        
        return jsonify({"answer": answer})
    except Exception as e:
        logging.error(f"Error during question answering: {str(e)}")
        return jsonify({"error": "An error occurred while processing your question"}), 500

if __name__ == '__main__':
    app.run(debug=True)
