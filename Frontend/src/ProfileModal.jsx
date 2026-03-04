import "./ProfileModal.css";
import { useChat } from "./MyContext.jsx";

export default function ProfileModal() {
  const { isProfileOpen, setIsProfileOpen, user, onLogout, t } = useChat();

  if (!isProfileOpen) return null;

  return (
    <>
      <div className="modal-backdrop" onClick={() => setIsProfileOpen(false)} />
      <div className="modal-content profile-modal">
        <button className="modal-close" onClick={() => setIsProfileOpen(false)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        
        <div className="profile-body">
          <div className="profile-info-section">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.displayName} className="profile-avatar-large" />
            ) : (
              <div className="profile-avatar-large">
                {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "?"}
              </div>
            )}
            <h2 className="profile-name">{user?.displayName || t.sidebar.user}</h2>
            <p className="profile-email">{user?.email}</p>
          </div>
        </div>

        <div className="profile-actions">
          <button 
            className="action-row action-row--danger" 
            onClick={() => {
              onLogout();
              setIsProfileOpen(false);
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            {t.profile.signOut}
          </button>
        </div>
      </div>
    </>
  );
}
