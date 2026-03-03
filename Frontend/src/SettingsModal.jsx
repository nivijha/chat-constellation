import { useState } from "react";
import { useChat } from "./MyContext.jsx";
import "./SettingsModal.css";

export default function SettingsModal() {
  const { isSettingsOpen, setIsSettingsOpen } = useChat();
  const [activeTab, setActiveTab] = useState("general");

  if (!isSettingsOpen) return null;

  return (
    <>
      <div className="modal-backdrop" onClick={() => setIsSettingsOpen(false)} />
      <div className="modal-content settings-modal">
        <button className="modal-close" onClick={() => setIsSettingsOpen(false)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <h2 className="settings-title">Settings</h2>

        <div className="settings-layout">
          {/* Tabs Sidebar */}
          <div className="settings-sidebar">
            <button
              className={`settings-tab ${activeTab === "general" ? "settings-tab--active" : ""}`}
              onClick={() => setActiveTab("general")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              General
            </button>
            <button
              className={`settings-tab ${activeTab === "data" ? "settings-tab--active" : ""}`}
              onClick={() => setActiveTab("data")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
              Data controls
            </button>
          </div>

          {/* Content Area */}
          <div className="settings-body">
            {activeTab === "general" && (
              <div className="settings-pane">
                <div className="setting-row">
                  <div className="setting-info">
                    <div className="setting-name">Theme</div>
                    <div className="setting-desc">Adjust the appearance of Constellation.</div>
                  </div>
                  <select className="setting-select" defaultValue="dark">
                    <option value="system">System</option>
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                  </select>
                </div>
                <div className="setting-row">
                  <div className="setting-info">
                    <div className="setting-name">Locale</div>
                    <div className="setting-desc">Change the display language.</div>
                  </div>
                  <select className="setting-select" defaultValue="en">
                    <option value="en">English (US)</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === "data" && (
              <div className="settings-pane">
                <div className="setting-row">
                  <div className="setting-info">
                    <div className="setting-name">Export Data</div>
                    <div className="setting-desc">Download a copy of your chat history.</div>
                  </div>
                  <button className="setting-action-btn">Export</button>
                </div>
                <div className="setting-row">
                  <div className="setting-info">
                    <div className="setting-name text-danger">Delete Account</div>
                    <div className="setting-desc">Permanently remove all your data.</div>
                  </div>
                  <button className="setting-action-btn btn-danger">Delete</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
