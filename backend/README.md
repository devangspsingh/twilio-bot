# WhatsApp Review Collector - Backend

A FastAPI-based backend service that collects product reviews via WhatsApp using Twilio's messaging API.

## 📋 Project Overview

This backend system allows users to submit product reviews through a conversational WhatsApp bot. The bot guides users through a multi-step conversation to collect:
- Product name
- User's name
- Product review

All reviews are stored in a database (SQLite for local development, PostgreSQL for production).

## 🏗️ Architecture

The project is organized into multiple modules for clean code structure:

- **`models.py`** - Database models and configuration
- **`api.py`** - API routes and business logic
- **`main.py`** - Application entrypoint and configuration
- **`.env`** - Production environment variables (PostgreSQL)
- **`.env.local`** - Local development environment variables (SQLite)

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- PostgreSQL (for production) or SQLite (for local dev)
- Twilio account with WhatsApp sandbox access
- ngrok (for local testing with Twilio webhooks)

### Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**
   - Windows:
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - Mac/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Configure environment variables**

   Create `.env.local` for local development:
   ```env
   DATABASE_URL=sqlite:///./test.db
   ```

   Create `.env` for production:
   ```env
   DATABASE_URL=postgresql://postgres:password@localhost:5432/reviews_db
   ```

6. **Run the application**
   ```bash
   uvicorn main:app --reload
   ```

   The server will start at `http://localhost:8000`

## 📡 API Endpoints

### 1. Get All Reviews
```http
GET /api/reviews
```
Returns all reviews from the database, ordered by creation date (newest first).

**Response:**
```json
[
  {
    "id": 1,
    "contact_number": "+1234567890",
    "user_name": "John Doe",
    "product_name": "iPhone 15",
    "product_review": "Great phone!",
    "status": "delivered",
    "created_at": "2025-11-18T10:30:00"
  }
]
```

### 2. WhatsApp Webhook
```http
POST /webhook
```
Receives incoming WhatsApp messages from Twilio and manages the conversation flow.

**Form Data:**
- `From` - Sender's phone number
- `Body` - Message content

### 3. Twilio Status Callback
```http
POST /twilio-status-callback
```
Receives message delivery status updates from Twilio.

**Form Data:**
- `MessageSid` - Unique message identifier
- `MessageStatus` - Status (delivered, failed, sent, etc.)

## 📚 API Documentation

FastAPI provides automatic interactive API documentation:

- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

## 🔧 Twilio Setup

### Step 1: Create a Twilio Account
1. Go to [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. Sign up for a free account
3. Complete phone verification

### Step 2: Access WhatsApp Sandbox
1. Log in to the [Twilio Console](https://console.twilio.com/)
2. Navigate to **Messaging** → **Try it Out** → **Send a WhatsApp message**
3. You'll see a sandbox number (e.g., `+1 415 523 8886`) and a join code (e.g., `join <code>`)
4. From your phone, send the join code to the sandbox number on WhatsApp

### Step 3: Configure Webhook
1. In the Twilio Console, go to **Messaging** → **Settings** → **WhatsApp sandbox settings**
2. Under **"WHEN A MESSAGE COMES IN"**, set the webhook URL:
   - For production: `https://your-domain.com/webhook`
   - For local testing: Use ngrok (see below)

### Step 4: Set Up Status Callback URL
1. In the same settings page, find **"STATUS CALLBACK URL"**
2. Set it to:
   - Production: `https://your-domain.com/twilio-status-callback`
   - Local: `https://<ngrok-id>.ngrok.io/twilio-status-callback`

### Step 5: Local Testing with ngrok
1. Install ngrok: [https://ngrok.com/download](https://ngrok.com/download)
2. Start your FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```
3. In another terminal, start ngrok:
   ```bash
   ngrok http 8000
   ```
4. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
5. Update Twilio webhook URLs:
   - Webhook: `https://abc123.ngrok.io/webhook`
   - Status Callback: `https://abc123.ngrok.io/twilio-status-callback`

### Step 6: Test the Bot
1. Send a message to your Twilio sandbox number on WhatsApp
2. The bot will guide you through the review process:
   - **Bot:** "Hi! Which product is this review for?"
   - **You:** "iPhone 15"
   - **Bot:** "Okay, got it. What's your name?"
   - **You:** "John"
   - **Bot:** "Please send your review for iPhone 15."
   - **You:** "Excellent phone with great camera!"
   - **Bot:** "Thanks John -- your review for iPhone 15 has been recorded."

## 🗃️ Database Schema

### Reviews Table
| Column | Type | Description |
|--------|------|-------------|
| `id` | Integer | Primary key |
| `contact_number` | String | User's phone number |
| `user_name` | String | User's name |
| `product_name` | String | Product being reviewed |
| `product_review` | Text | The review content |
| `status` | String | Message delivery status (default: "pending") |
| `created_at` | DateTime | Timestamp of review creation |

## 🔄 Conversation Flow

The bot uses a state machine to manage conversations:

```
START → ASK_NAME → ASK_REVIEW → FINISH
```

States are stored in-memory (consider using Redis for production).

## 🛠️ Development

### Project Structure
```
backend/
├── main.py              # FastAPI app initialization
├── api.py               # API routes and endpoints
├── models.py            # Database models
├── requirements.txt     # Python dependencies
├── .env                 # Production config (PostgreSQL)
├── .env.local          # Local config (SQLite)
├── .env.example        # Example configuration
└── test.db             # SQLite database (auto-created)
```

### Running in Development Mode
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Database Migrations
Currently using SQLAlchemy's `create_all()` for table creation. For production, consider using Alembic:
```bash
pip install alembic
alembic init alembic
```

## 🚀 Production Deployment

1. **Set up PostgreSQL database**
2. **Update `.env` with production DATABASE_URL**
3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
4. **Run with production server:**
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
   ```
5. **Update Twilio webhooks with production URLs**

## 🔒 Security Considerations

- Use environment variables for sensitive data
- Restrict CORS origins in production (update `allow_origins` in `main.py`)
- Implement request validation for Twilio webhooks
- Use HTTPS for all webhook URLs
- Store conversation state in Redis instead of in-memory for production

## 📝 License

MIT License

## 👨‍💻 Author

Built to demonstrate clean code architecture and integration with external APIs.
