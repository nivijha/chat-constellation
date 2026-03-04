import { useState, useCallback, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import LoginPage from "./LoginPage.jsx";
import { MyContext } from "./MyContext.jsx";
import { v4 as uuidv4 } from "uuid";
import { translations } from "./translations";

const rawAPI = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
export const API = rawAPI.endsWith('/') ? rawAPI.slice(0, -1) : rawAPI;

function App() {
  const [allThreads, setAllThreads] = useState([]);
  const [currThreadId, setCurrThreadId] = useState(() => localStorage.getItem("chatConstellationThreadId") || null);
  const [prevChats, setPrevChats] = useState([]);
  const [latestReply, setLatestReply] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Auth States
  const [token, setToken] = useState(() => localStorage.getItem("chatConstellationToken"));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("chatConstellationUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // New states for Modals & View Toggle
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [viewMode, setViewMode] = useState("chat"); // 'chat' | 'constellation'
  const [activeMessageIndex, setActiveMessageIndex] = useState(null);
  const [language, setLanguage] = useState(() => localStorage.getItem("chatConstellationLanguage") || "en");

  const t = translations[language];

  // Sync auth and thread to local storage
  useEffect(() => {
    if (token) localStorage.setItem("chatConstellationToken", token);
    else localStorage.removeItem("chatConstellationToken");

    if (user) localStorage.setItem("chatConstellationUser", JSON.stringify(user));
    else localStorage.removeItem("chatConstellationUser");

    if (currThreadId) localStorage.setItem("chatConstellationThreadId", currThreadId);
    else localStorage.removeItem("chatConstellationThreadId");

    localStorage.setItem("chatConstellationLanguage", language);
    // Ensure light-mode class is never present if user forced dark
    document.documentElement.classList.remove("light-mode");
  }, [token, user, currThreadId, language]);

  // Auth Functions
  const onLogin = useCallback(async (email, password) => {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    setToken(data.token);
    setUser(data.user);
  }, []);

  const onRegister = useCallback(async (email, password, displayName) => {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, displayName }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    setToken(data.token);
    setUser(data.user);
  }, []);

  const onGoogleLogin = useCallback(async (tokenId) => {
    try {
      const res = await fetch(`${API}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenId }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        const errorMsg = data.error || data.details || "Google Auth failed on server";
        console.error("App.jsx onGoogleLogin: Server Error:", errorMsg);
        throw new Error(errorMsg);
      }

      setToken(data.token);
      setUser(data.user);
    } catch (err) {
      console.error("App.jsx onGoogleLogin: Catch block reached:", err);
      throw err; // Re-throw to be caught by LoginPage
    }
  }, []);

  const onLogout = useCallback(() => {
    setToken(null);
    setUser(null);
    setCurrThreadId(null);
    setAllThreads([]);
    setPrevChats([]);
  }, []);

  // Change to an existing chat session
  const changeThread = useCallback(async (threadId) => {
    if (!token) return;
    setCurrThreadId(threadId);
    setLatestReply(null);
    setActiveMessageIndex(null);
    setLoading(true);

    try {
      const res = await fetch(`${API}/thread/${threadId}`, {
        headers: { "x-auth-token": token }
      });
      const data = await res.json();
      setPrevChats(data);
    } catch (e) {
      console.error("changeThread:", e);
      setPrevChats([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch all threads
  const fetchThreads = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API}/thread`, {
        headers: { "x-auth-token": token }
      });
      const data = await res.json();
      setAllThreads(data);
      
      const savedId = localStorage.getItem("chatConstellationThreadId");
      if (savedId && data.some(t => t.threadID === savedId)) {
        changeThread(savedId);
      } else if (data.length > 0) {
        changeThread(data[0].threadID);
      }
    } catch (e) {
      console.error("fetchThreads:", e);
    }
  }, [token, changeThread]);

  // Load threads on initial mount
  useEffect(() => {
    if (token) fetchThreads();
  }, [token, fetchThreads]);

  // Create a new chat session
  const createNewChat = useCallback(() => {
    const id = uuidv4();
    setCurrThreadId(id);
    setPrevChats([]);
    setLatestReply(null);
    setActiveMessageIndex(null);
    setViewMode("chat");
  }, []);

  // Delete a thread
  const deleteThread = useCallback(async (threadId) => {
    if (!token) return;
    try {
      await fetch(`${API}/thread/${threadId}`, { 
        method: "DELETE",
        headers: { "x-auth-token": token }
      });
      if (threadId === currThreadId) {
        setCurrThreadId(null);
        setPrevChats([]);
        setLatestReply(null);
        setActiveMessageIndex(null);
      }
      setAllThreads((prev) => prev.filter((t) => t.threadID !== threadId));
    } catch (e) {
      console.error("deleteThread:", e);
    }
  }, [token, currThreadId]);

  // Send a message
  const getReply = useCallback(async (prompt) => {
    if (!prompt.trim() || loading || !token) return;

    setActiveMessageIndex(null); 

    const userMsg = { role: "user", content: prompt };
    setPrevChats((prev) => [...prev, userMsg]);
    setLatestReply("…");
    setLoading(true);

    const threadID = currThreadId || uuidv4();
    if (!currThreadId) setCurrThreadId(threadID);

    try {
      const res = await fetch(`${API}/chat`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-auth-token": token
        },
        body: JSON.stringify({ 
          threadID, 
          message: prompt,
          language 
        }),
      });
      const data = await res.json();
      let reply = data.reply || "No response.";
      
      // Sanitize <br> and <br/> tags to newlines for Markdown
      reply = reply.replace(/<br\s*\/?>/gi, "\n");

      setPrevChats((prev) => [...prev, { role: "assistant", content: reply }]);
      setLatestReply(null);
      await fetchThreads();
    } catch (e) {
      console.error("getReply:", e);
      setPrevChats((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Try again." },
      ]);
      setLatestReply(null);
    } finally {
      setLoading(false);
    }
  }, [token, currThreadId, loading, fetchThreads]);

  const providerValues = {
    allThreads, setAllThreads,
    currThreadId, setCurrThreadId,
    prevChats, setPrevChats,
    latestReply, setLatestReply,
    loading, setLoading,
    sidebarOpen, setSidebarOpen,
    isProfileOpen, setIsProfileOpen,
    isSettingsOpen, setIsSettingsOpen,
    viewMode, setViewMode,
    activeMessageIndex, setActiveMessageIndex,
    fetchThreads, changeThread,
    createNewChat, deleteThread,
    getReply,
    user, token,
    onLogin, onRegister, onLogout, onGoogleLogin,
    language, setLanguage, t
  };

  return (
    <Router>
      <MyContext.Provider value={providerValues}>
        <Routes>
          <Route 
            path="/login" 
            element={!token ? <LoginPage onLogin={onLogin} onRegister={onRegister} onGoogleLogin={onGoogleLogin} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/" 
            element={token ? (
              <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
                <Sidebar />
                <ChatWindow />
              </div>
            ) : <Navigate to="/login" />} 
          />
        </Routes>
      </MyContext.Provider>
    </Router>
  );
}

export default App;
