import "./ProfileModal.css";
import { useChat } from "./MyContext.jsx";

export default function ProfileModal() {
  const { isProfileOpen, setIsProfileOpen } = useChat();

  if (!isProfileOpen) return null;

  return (
    <>
      <div className="modal-backdrop" onClick={() => setIsProfileOpen(false)} />
      <div className="modal-content profile-modal">
        <button className="modal-close" onClick={() => setIsProfileOpen(false)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        
        <div className="profile-header">
          <div className="profile-avatar-large">N</div>
          <h2 className="profile-name">Nivi Jha</h2>
          <p className="profile-email">nivi@example.com</p>
        </div>

        <div className="profile-plan-card">
          <div className="plan-info">
            <span className="plan-badge">Pro</span>
            <span className="plan-desc">Constellation Plus</span>
          </div>
          <button className="plan-btn">Manage</button>
        </div>

        <div className="profile-actions">
          <button className="action-row">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            Billing History
          </button>
          <button className="action-row action-row--danger">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign out
          </button>
        </div>
      </div>
    </>
  );
}
