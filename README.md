# 🛡️ Fake Job Detection System

An AI-powered web application that analyzes job descriptions to detect whether a posting is legitimate or fraudulent.

## 🏗️ Architecture

This project is built using a modern decoupled architecture:
1. **Python/Flask Backend API**: Serves the deep learning model.
2. **React Frontend (Vite)**: Provides a high-fidelity, interactive, and beautiful user interface.

### Backend (`/app.py`)
The backend is a Flask REST API that loads a pre-trained Keras Deep Learning model (`Fake_job_detection.h5`) and a text tokenizer (`tokenizer.pkl`). When the frontend sends a job description, the backend:
1. Tokenizes and pads the text data.
2. Passes the processed text into the neural network to get a confidence score.
3. Returns a JSON response containing whether the job is `Fraudulent` or `Legitimate`, alongside the exact score.

### Frontend (`/frontend`)
The frontend is a React Single Page Application (SPA) bundled with Vite. It features:
- **Premium Glassmorphism UI**: High-end visuals using Vanilla CSS, background blur layers, and dynamic grids.
- **Framer Motion**: Smooth, physics-based micro-animations for elements entering the screen and interactive states.
- **Lucide Icons**: Crisp vector icons to communicate status and features.
- **Axios API Client**: Seamlessly sends POST requests to the local Flask server without reloading the page.

---

## 🧠 Machine Learning Pipeline

The intelligence of this application is powered by a **Deep Learning Recurrent Neural Network (RNN)**, specifically utilizing **LSTM (Long Short-Term Memory)**.

### 1. Exploratory Data Analysis (`EDA_job_data.ipynb`)
- **Data Inspection:** The dataset contains 17,880 job postings.
- **Imputation:** Missing text values (like salary range, department, benefits) were imputed with placeholders like `"unknown"` or `"Not specified"`.
- **Class Imbalance:** A massive imbalance was identified (17,014 legitimate vs. 866 fraudulent jobs), highlighting the need for advanced balancing techniques to avoid biased predictions.

### 2. Model Training (`model_training.ipynb`)
- **Preprocessing:** All text-based columns (title, description, requirements, etc.) were merged into a single `combined_text` column, cleaned of URLs and special characters, and lowercased.
- **Tokenization:** Text was mapped to integer sequences using Keras `Tokenizer` (`MAX_VOCAB_SIZE=10000`) and padded to exactly 200 words.
- **SMOTE Balancing:** The Synthetic Minority Over-sampling Technique (SMOTE) was applied to artificially generate fraudulent examples, balancing both classes to 34,028 total samples.
- **LSTM Architecture:**
  - **Embedding Layer** (Size 100)
  - **LSTM Layer** (64 units, 20% dropout)
  - **Dense Layer** (32 units, ReLU)
  - **Dropout Layer** (40%)
  - **Output Layer** (1 unit, Sigmoid)
- **Performance:** After training for 5 epochs with binary crossentropy, the model achieved an outstanding **F1-score of 0.98**.

---

## 🚀 How to Run the Application

Because the frontend and backend are separate, you need to start them both in two different terminal windows.

### 1. Start the Machine Learning API (Backend)
Open a terminal in the root folder (where `app.py` is located) and ensure you have the required Python packages (Flask, TensorFlow, Flask-Cors).

```bash
# Start the Flask API
python app.py
```
*The server will start running on `http://127.0.0.1:5000/`. Keep this terminal open.*

### 2. Start the React Interface (Frontend)
Open a **new terminal window**, navigate to the `frontend` folder, and start the Vite development server.

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies (only needed the very first time)
npm install

# Start the frontend server
npm run dev
```
*The terminal will display a local URL (e.g., `http://localhost:5173/`). Click that link to open the application in your browser.*

---

## 📁 File Structure
- `app.py`: The main Flask API script.
- `Fake_job_detection.h5`: The trained Keras Deep Learning Model.
- `tokenizer.pkl`: The saved word tokenizer mapping text to sequences.
- `EDA_job_data.ipynb` / `model_training.ipynb`: Jupyter notebooks documenting the Data Analysis and Model Training pipeline.
- `frontend/`: Directory containing all React source code, CSS, and Vite configurations.
