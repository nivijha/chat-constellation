import { useState } from "react";
import { useChat } from "./MyContext.jsx";
import Chat from "./Chat.jsx";
import ConstellationGraph from "./ConstellationGraph.jsx";
import GlobalConstellation from "./GlobalConstellation.jsx";
import ProfileModal from "./ProfileModal.jsx";
import SettingsModal from "./SettingsModal.jsx";
import "./ChatWindow.css";

function ChatWindow() {
  const { 
    createNewChat, prevChats, sidebarOpen, setSidebarOpen, loading, getReply,
    setIsProfileOpen, setIsSettingsOpen, viewMode, setViewMode, currThreadId
  } = useChat();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [prompt, setPrompt] = useState("");

  const handleSend = () => {
    if (!prompt.trim()) return;
    getReply(prompt);
    setPrompt("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <main className="chat-window">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <button
            className="icon-btn"
            title="Toggle sidebar"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          
          <div className="view-toggle">
            <button 
              className={`view-toggle-btn ${viewMode === "chat" ? "active" : ""}`}
              onClick={() => setViewMode("chat")}
              title="Chat View"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="14" x2="14" y2="14"/><line x1="10" y1="14" x2="3" y2="14"/><line x1="21" y1="10" x2="14" y2="10"/><line x1="10" y1="10" x2="3" y2="10"/><line x1="21" y1="18" x2="14" y2="18"/><line x1="10" y1="18" x2="3" y2="18"/><line x1="21" y1="6" x2="14" y2="6"/><line x1="10" y1="6" x2="3" y2="6"/></svg>
            </button>
            <button 
              className={`view-toggle-btn ${viewMode === "constellation" ? "active" : ""}`}
              onClick={() => setViewMode("constellation")}
              title="Thread Constellation View"
              disabled={!currThreadId}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            </button>
            <button 
              className={`view-toggle-btn ${viewMode === "galaxy" ? "active" : ""}`}
              onClick={() => setViewMode("galaxy")}
              title="Global Galaxy View"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
            </button>
          </div>
        </div>

        <div className="navbar-right">
          <button
            className="icon-btn"
            title="New chat"
            onClick={createNewChat}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </button>

          <div className="user-menu-wrap">
            <button
              className="avatar-btn"
              onClick={() => setDropdownOpen((v) => !v)}
              title="Account"
            >
              N
            </button>
            {dropdownOpen && (
              <>
                <div className="dropdown-backdrop" onClick={() => setDropdownOpen(false)} />
                <div className="dropdown">
                  <div className="dropdown-item" onClick={() => { setIsProfileOpen(true); setDropdownOpen(false); }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                    Profile
                  </div>
                  <div className="dropdown-item" onClick={() => { setIsSettingsOpen(true); setDropdownOpen(false); }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>
                    Settings
                  </div>
                  <div className="dropdown-divider" />
                  <div className="dropdown-item dropdown-item--danger" onClick={() => setDropdownOpen(false)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Sign out
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      {viewMode === "galaxy" ? (
        <div className="constellation-container">
          <GlobalConstellation />
        </div>
      ) : viewMode === "constellation" ? (
        <div className="constellation-container">
          <ConstellationGraph />
        </div>
      ) : (
        <div className="messages-area">
          {prevChats.length === 0 ? (
            <div className="empty-state">
              <div className="empty-star">✦</div>
              <h1 className="empty-title">What's on your mind?</h1>
              <p className="empty-sub">Ask me anything — I'm here to help.</p>
            </div>
          ) : (
            <Chat />
          )}
        </div>
      )}

      {/* Loading dots */}
      {loading && viewMode === "chat" && (
        <div className="typing-indicator">
          <span /><span /><span />
        </div>
      )}

      {/* Input */}
      <div className="input-area">
        <div className="input-box">
          <textarea
            className="input-field"
            placeholder="Message Constellation…"
            value={prompt}
            rows={1}
            onChange={(e) => {
              setPrompt(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
            }}
            onKeyDown={handleKey}
          />
          <button
            className={`send-btn${prompt.trim() ? " send-btn--active" : ""}`}
            disabled={!prompt.trim() || loading}
            onClick={handleSend}
            title="Send"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
            </svg>
          </button>
        </div>
        <p className="input-disclaimer">Constellation can make mistakes — always double-check important info.</p>
      </div>

      {/* Overlays */}
      <ProfileModal />
      <SettingsModal />
    </main>
  );
}

export default ChatWindow;
