# How to Run the Humanness MERN Prototype

This project is divided into two parts: `frontend` and `backend`.

## Prerequisites
- **Node.js**: v20 or higher
- **MongoDB**: Ensure MongoDB is running locally at `mongodb://localhost:27017/humanness`

## Setup Instructions

### 1. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd humanness-prototype/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run dev
   ```
   *The backend will run on `http://localhost:5000`.*

### 2. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd humanness-prototype/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`.*

---

## Features Implemented
- **Task 1 (Vision)**: End-to-end image submission and admin verification.
- **Task 2 (Transcription)**: Data models for identifying low-quality transcribers.
- **Task 3 (Voice AI)**: Evaluation framework for AI-human conversations.
