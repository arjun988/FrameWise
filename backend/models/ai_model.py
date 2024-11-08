import os
from dotenv import load_dotenv
import google.generativeai as ggi

# Load environment variables from .env file
load_dotenv()

class AIModel:
    def __init__(self):
        # Fetch the API key from the environment variable
        api_key = os.getenv("gemini_gpt_key")
        
        if not api_key:
            raise ValueError("Gemini GPT API key is required. Please set gemini_gpt_key in your .env file.")
        
        # Configure the generative AI with the fetched API key
        ggi.configure(api_key=api_key)
        
        # Initialize the model
        self.model = ggi.GenerativeModel("gemini-pro")
        self.chat = self.model.start_chat()
    
    def answer_question(self, context, question):
        prompt = f"Answer the following question based on this documentation:\n\n{context}\n\nQuestion: {question}\nAnswer:"
        
        try:
            # Send the message and get the response
            response = self.chat.send_message(prompt)
            
            # Extract the content from the response
            candidates = response.candidates
            
            if len(candidates) > 0:
                first_candidate = candidates[0]
                content_parts = first_candidate.content.parts
                
                if len(content_parts) > 0:
                    answer = content_parts[0].text
                else:
                    answer = "No answer found in the response."
            else:
                answer = "No candidates found in the response."
            
            return answer
        except Exception as e:
            print(f"Error occurred during API call: {str(e)}")
            return None


    
