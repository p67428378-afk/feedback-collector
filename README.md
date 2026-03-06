# Anonymous Feedback Collection System

This project implements an anonymous feedback collection system as described in Jira issue SCRUM-27.

## Features

- **Admin Interface**: Create, customize, and manage multiple feedback forms.
- **Anonymous User Access**: Users can submit feedback without login or personal identification.
- **Raw Feedback Viewing**: Admins can view individual, raw feedback submissions.
- **Anonymity Assurance**: Strict measures to prevent collection of PII (IP addresses, device info, etc.).

## Technology Stack

- **Backend**: Python, Flask, SQLAlchemy
- **Database**: SQLite (for development/local), PostgreSQL (for production)
- **Frontend**: React

## Setup and Installation

### Prerequisites

- Python 3.x
- Node.js and npm/yarn

### Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/p67428378-afk/feedback-collector.git
    cd feedback-collector
    ```
2.  **Create a virtual environment and activate it:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: `venv\Scripts\activate`
    ```
3.  **Install backend dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Configure environment variables:**
    Create a `.env` file in the `backend` directory based on `.env.example`.

5.  **Initialize the database:**
    ```bash
    flask db upgrade
    ```
6.  **Run the Flask backend:**
    ```bash
    flask run
    ```
    The backend will run on `http://127.0.0.1:5000` by default.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Install frontend dependencies:**
    ```bash
    npm install # or yarn install
    ```
3.  **Run the React frontend:**
    ```bash
    npm start # or yarn start
    ```
    The frontend will run on `http://localhost:3000` by default.

## Project Structure

```
feedback-collector/
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── models.py
│   ├── routes.py
│   ├── migrations/
│   ├── .env.example
│   ├── requirements.txt
│   └── ...
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── ...
│   ├── package.json
│   └── ...
├── .gitignore
├── Dockerfile
└── README.md
```

## API Documentation

(To be added as API endpoints are finalized)

## Contributing

(To be added)

## License

(To be added)
