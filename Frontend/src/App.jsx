import { useState, useCallback, useEffect } from "react";
import "./index.css";
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext.jsx";
import { v4 as uuidv4 } from "uuid";

const API = "http://localhost:8080/api";

function App() {
  const [allThreads, setAllThreads] = useState([]);
  const [currThreadId, setCurrThreadId] = useState(() => localStorage.getItem("chatConstellationThreadId") || null);
  const [prevChats, setPrevChats] = useState([]);
  const [latestReply, setLatestReply] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // New states for Modals & View Toggle
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [viewMode, setViewMode] = useState("chat"); // 'chat' | 'constellation'

  // Sync current thread to local storage
  useEffect(() => {
    if (currThreadId) {
      localStorage.setItem("chatConstellationThreadId", currThreadId);
    } else {
      localStorage.removeItem("chatConstellationThreadId");
    }
  }, [currThreadId]);

  // Load a thread's messages
  const changeThread = useCallback(async (threadId, targetView = "chat") => {
    setCurrThreadId(threadId);
    try {
      const res = await fetch(`${API}/thread/${threadId}`);
      const msgs = await res.json();
      setPrevChats(msgs);
      setLatestReply(null);
      // Switch back to target view when changing threads
      setViewMode(targetView);
    } catch (e) {
      console.error("changeThread:", e);
    }
  }, []);

  // Fetch all threads
  const fetchThreads = useCallback(async () => {
    try {
      const res = await fetch(`${API}/thread`);
      const data = await res.json();
      setAllThreads(data);
      
      // If we have a saved thread id that exists in the fetched threads, load it
      const savedId = localStorage.getItem("chatConstellationThreadId");
      if (savedId && data.some(t => t.threadID === savedId)) {
        changeThread(savedId);
      }
    } catch (e) {
      console.error("fetchThreads:", e);
    }
  }, [changeThread]);

  // Create a new chat session
  const createNewChat = useCallback(() => {
    const id = uuidv4();
    setCurrThreadId(id);
    setPrevChats([]);
    setLatestReply(null);
    setViewMode("chat");
  }, []);

  // Delete a thread
  const deleteThread = useCallback(async (threadId) => {
    try {
      await fetch(`${API}/thread/${threadId}`, { method: "DELETE" });
      if (threadId === currThreadId) {
        setCurrThreadId(null);
        setPrevChats([]);
        setLatestReply(null);
      }
      setAllThreads((prev) => prev.filter((t) => t.threadID !== threadId));
    } catch (e) {
      console.error("deleteThread:", e);
    }
  }, [currThreadId]);

  // Send a message
  const getReply = useCallback(async (prompt) => {
    if (!prompt.trim() || loading) return;

    const userMsg = { role: "user", content: prompt };
    setPrevChats((prev) => [...prev, userMsg]);
    setLatestReply("…");
    setLoading(true);

    const threadID = currThreadId || uuidv4();
    if (!currThreadId) setCurrThreadId(threadID);

    try {
      const res = await fetch(`${API}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadID, message: prompt }),
      });
      const data = await res.json();
      const reply = data.reply || "No response.";

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
  }, [currThreadId, loading, fetchThreads]);

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
    fetchThreads, changeThread,
    createNewChat, deleteThread,
    getReply,
  };

  return (
    <MyContext.Provider value={providerValues}>
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <Sidebar />
        <ChatWindow />
      </div>
    </MyContext.Provider>
  );
}

export default App;
