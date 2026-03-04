# Render Deployment Guide 🚀

Follow these steps to deploy your **Chat Constellation Backend** to Render.

## 1. Prepare your Repository
Ensure your latest changes (including the `package.json` and `server.js` updates I just made) are pushed to your GitHub repository.

## 2. Create a Web Service on Render
1.  Log in to [Render.com](https://render.com).
2.  Click **New +** and select **Web Service**.
3.  Connect your GitHub repository and select the `chat-constellation` repo.
4.  **Root Directory**: Set this to `Backend` (or `backend` depending on your exact folder name case).
5.  **Runtime**: Select `Node`.
6.  **Build Command**: `npm install`
7.  **Start Command**: `npm start`

## 3. Configure Environment Variables
In the Render dashboard for your new service, go to the **Environment** tab and add the following keys from your `.env` file:

-   `MONGODB_URI`: Your MongoDB connection string.
-   `JWT_SECRET`: A secure random string for signing tokens.
-   `OPENAI_API_KEY`: Your OpenAI API key.
-   `GOOGLE_CLIENT_ID`: Your Google OAuth client ID.
-   `FRONTEND_URL`: The URL where your frontend will be hosted (e.g., `https://chat-constellation.vercel.app`). *You can update this later once the frontend is deployed.*

## 4. Deploy!
Render will automatically start the build and deployment process. Once the status turns "Live," your backend is ready.

### 💡 Pro Tip
Render's free tier "spins down" after 15 minutes of inactivity. The first request after a break might take 30-60 seconds to wake up the server.
