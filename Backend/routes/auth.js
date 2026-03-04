import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Thread from "../models/Thread.js";
import auth from "../middleware/auth.js";
import { OAuth2Client } from "google-auth-library";

const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
    const { email, password, displayName } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Please enter all fields" });
    }

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "User already exists" });
        }

        user = new User({ email, password, displayName });
        await user.save();

        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                displayName: user.displayName
            }
        });
    } catch (err) {
        console.error("Auth error:", err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
});

// Login User
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Please enter all fields" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                displayName: user.displayName
            }
        });
    } catch (err) {
        console.error("Auth error:", err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
});

// Google Login
router.post("/google", async (req, res) => {
    const { tokenId } = req.body;
    console.log("Backend: Received Google login request. Client ID exists:", !!process.env.GOOGLE_CLIENT_ID);

    try {
        console.log("Backend: Verifying Google ID token...");
        const oauthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const ticket = await oauthClient.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const gPayload = ticket.getPayload();
        console.log("Backend: Google token verified for:", gPayload.email);
        const { sub: googleId, email, name, picture } = gPayload;

        if (!email) {
            console.error("Backend Error: Google login failed - No email found in token payload");
            return res.status(400).json({ error: "Google token missing email information" });
        }

        const normalizedEmail = email.toLowerCase();
        let user = await User.findOne({ 
            $or: [
                { googleId: googleId },
                { email: normalizedEmail }
            ]
        });

        if (!user) {
            user = new User({
                googleId,
                email: email.toLowerCase(),
                displayName: name,
                avatar: picture
            });
            await user.save();
        } else if (!user.googleId) {
            // Link existing email account to Google
            user.googleId = googleId;
            user.avatar = picture;
            await user.save();
        }

        if (!process.env.JWT_SECRET) {
            console.error("Backend Error: JWT_SECRET is missing in environment variables!");
            return res.status(500).json({ error: "Server configuration error: JWT_SECRET is missing" });
        }
        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                displayName: user.displayName,
                avatar: user.avatar
            }
        });
    } catch (err) {
        console.error("CRITICAL Google Login Failure:", err);
        res.status(500).json({ 
            error: "Google Authentication Error", 
            message: err.message,
            details: process.env.NODE_ENV === 'development' ? err.stack : undefined 
        });
    }
});

// Delete Account
router.delete("/account", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        
        // 1. Delete all threads associated with this user
        // will cascade and delete messages as they are embedded in threads
        await Thread.deleteMany({ userID: userId });

        // 2. Delete the user
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "Account and all associated data deleted successfully" });
    } catch (err) {
        console.error("Delete account error:", err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
});

export default router;
