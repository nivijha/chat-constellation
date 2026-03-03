import { useState, useEffect, useRef } from "react";
import { useChat } from "./MyContext.jsx";
import "./Sidebar.css";

function Sidebar() {
  const {
    allThreads, currThreadId,
    fetchThreads, changeThread,
    createNewChat, deleteThread,
    sidebarOpen, setSidebarOpen,
    setIsProfileOpen
  } = useChat();

  // Load threads on mount
  useEffect(() => { fetchThreads(); }, [fetchThreads]);

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`sidebar${sidebarOpen ? " sidebar--open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span className="brand-icon">✦</span>
            <span className="brand-name">Constellation</span>
          </div>
          <button
            className="icon-btn"
            title="New chat"
            onClick={createNewChat}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>

        <div className="sidebar-section-label">Recents</div>

        <ul className="thread-list">
          {allThreads.length === 0 && (
            <li className="thread-empty">No conversations yet</li>
          )}
          {allThreads.map((thread) => (
            <li
              key={thread.threadID}
              className={`thread-item${thread.threadID === currThreadId ? " thread-item--active" : ""}`}
              onClick={() => changeThread(thread.threadID)}
            >
              <span className="thread-title">{thread.title || "Untitled"}</span>
              <button
                className="thread-delete"
                title="Delete"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteThread(thread.threadID);
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                </svg>
              </button>
            </li>
          ))}
        </ul>

        <div className="sidebar-footer">
          <button 
            className="sidebar-profile-btn"
            onClick={() => setIsProfileOpen(true)}
          >
            <div className="sidebar-avatar">N</div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">Nivi Jha</span>
              <span className="sidebar-user-plan">Pro Plan</span>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sidebar-profile-icon">
              <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
            </svg>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
