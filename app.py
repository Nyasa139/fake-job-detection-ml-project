import os
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

import numpy as np
import pickle
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import load_model

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
print("Loading tokenizer...")
try:
    with open("tokenizer.pkl", "rb") as f:
        tokenizer = pickle.load(f)
    print("Tokenizer loaded!")
except FileNotFoundError:
    print("ERROR: tokenizer.pkl not found. Please make sure it is in the same folder.")

print("Loading Keras model...")
try:
    model = load_model("Fake_job_detection.h5") 
    print("Keras model loaded!")
except OSError:
    print("ERROR: 'Fake_job_detection.h5' not found. Check the filename.")

MAX_SEQUENCE_LENGTH = 200

import re
def clean_text(text):
    text = re.sub(r'http\S+|www\S+', ' ', text)
    text = re.sub(r'[^a-zA-Z\s]', ' ', text)
    text = text.lower().strip()
    return text

def preprocess_text(text):
    cleaned = clean_text(text)
    sequence = tokenizer.texts_to_sequences([cleaned])
    return pad_sequences(sequence, maxlen=MAX_SEQUENCE_LENGTH, dtype="float32")

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "API is running"})

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    if not data or "combined_text" not in data:
        return jsonify({"error": "Please enter the job description."}), 400
    
    combined_text = data["combined_text"]
    if not combined_text:
        return jsonify({"error": "Please enter the job description."}), 400

    padded = preprocess_text(combined_text)

    pred_tensor = model(padded, training=False)
    pred = float(pred_tensor[0][0])
    
    result = "Fraudulent" if pred > 0.5 else "Legitimate"
    score = pred

    return jsonify({"result": result, "score": score})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False, use_reloader=False)