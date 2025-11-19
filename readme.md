# WhatsApp Review Collector

A full-stack application that automates the collection of product reviews via WhatsApp using Twilio and displays them on a real-time dashboard.

## 🚀 Features

- **WhatsApp Bot**: Interactive conversational agent that guides users to submit reviews (Product Name -> User Name -> Review).
- **Real-time Dashboard**: Web interface to view collected reviews.
- **Status Tracking**: Tracks message delivery status via Twilio callbacks.
- **REST API**: Backend endpoints for managing reviews and webhooks.

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLite (via SQLAlchemy)
- **API**: Twilio (for WhatsApp messaging)
- **Server**: Uvicorn

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## 📂 Project Structure

```
twilio-bot/
├── backend/          # FastAPI server and database logic
│   ├── api.py        # API endpoints and webhook logic
│   ├── main.py       # Application entry point
│   ├── models.py     # Database models (SQLAlchemy)
│   └── requirements.txt
└── frontend/         # React frontend application
    ├── src/
    ├── package.json
    └── vite.config.js
```

## ⚡ Getting Started

### Prerequisites
- Python 3.8+
- Node.js & npm
- A Twilio Account (for WhatsApp Sandbox or Business API)

### 1. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Create a virtual environment and activate it:
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Run the server:
```bash
python main.py
# The server will start at http://localhost:8000
```

### 2. Frontend Setup

Navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
# The frontend will start at http://localhost:5173 (usually)
```

## 🔌 Twilio Configuration

To make the bot accessible from WhatsApp, you need to expose your local backend to the internet (e.g., using ngrok) and configure the webhook in Twilio.

1.  **Expose Localhost**:
    ```bash
    ngrok http 8000
    ```
    Copy the forwarding URL (e.g., `https://your-url.ngrok.io`).

2.  **Configure Twilio**:
    - Go to your Twilio Console > Messaging > Try it out > Send a WhatsApp message.
    - Open "Sandbox Settings".
    - In the **"When a message comes in"** field, enter your ngrok URL with the webhook endpoint:
      ```
      https://your-url.ngrok.io/webhook
      ```
    - Save the settings.

3.  **Status Callback (Optional)**:
    - You can also configure the status callback URL to:
      ```
      https://your-url.ngrok.io/twilio-status-callback
      ```

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/webhook` | Handles incoming WhatsApp messages. |
| `GET` | `/api/reviews` | Retrieves all collected reviews. |
| `POST` | `/twilio-status-callback` | Updates message delivery status. |

## 📝 Usage

1.  Start both Backend and Frontend servers.
2.  Send a message to your Twilio WhatsApp Sandbox number.
3.  Follow the bot's prompts to submit a review.
4.  Refresh the Frontend dashboard to see your review appear!
