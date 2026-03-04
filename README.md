# Chat Constellation ✨

**Chat Constellation** is a revolutionary AI chat application that visualizes your conversations as stellar systems. Unlike linear chat apps, it organizes your threads into a "Galaxy View" and your messages into interactive "Constellation Graphs," making context and relationships between ideas clear and beautiful.

## 🚀 Key Features

-   **Galaxy View**: A 2D interactive space where every chat thread is a star. Zoom, pan, and explore your history visually.
-   **Constellation Graphs**: View individual threads as nodes in a graph. See the flow of your conversation with AI and jump to any point instantly.
-   **Full Localization**: Switch between **English** and **Hindi** seamlessly. The AI even responds in the selected language regardless of your input.
-   **Intelligent UI**: Responsive dark theme with smooth glassmorphism effects and professional markdown rendering.
-   **Security First**: Robust account deletion, JWT-based authentication, and Google OAuth 2.0 integration.

## 🛠️ Tech Stack

-   **Frontend**: React, Vite, React Flow (for graphs), React-Zoom-Pan-Pinch, CSS Modules.
-   **Backend**: Node.js, Express, MongoDB (Mongoose), OpenAI API.
-   **Auth**: JWT, bcryptjs, Google Auth Library.

## 📦 Setup & Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (Running locally or via Atlas)
- OpenAI API Key
- Google Cloud Console Project (for Google Login)

### 1. Clone the repository
```bash
git clone https://github.com/nivijha/chat-constellation.git
cd chat-constellation
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
PORT=8080
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
GOOGLE_CLIENT_ID=your_google_client_id
```
Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend` folder:
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_API_URL=http://localhost:8080/api
```
Start the app (it will run on `http://localhost:5174`):
```bash
npm run dev
```

## 🔐 Security
The project includes several security measures:
-   **NoSQL Injection Prevention**: Automated sanitization of database queries.
-   **Secure Authentication**: Passwords hashed with bcrypt and sessions managed via JWT.
-   **Data Privacy**: Complete account deletion functionality removing all associated threads and messages.

## 📄 License
This project is licensed under the MIT License.
