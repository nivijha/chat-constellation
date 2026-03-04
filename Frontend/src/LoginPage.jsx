import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useChat } from "./MyContext.jsx";
import "./LoginPage.css";

const LoginPage = ({ onLogin, onRegister, onGoogleLogin }) => {
    const { t } = useChat();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (isLogin) {
                await onLogin(email, password);
            } else {
                await onRegister(email, password, displayName);
            }
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-glass-card">
                <div className="login-header">
                    <div className="login-logo">
                      <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="25" cy="30" r="4" fill="currentColor"/>
                        <circle cx="35" cy="18" r="4" fill="currentColor"/>
                        <circle cx="55" cy="15" r="4" fill="currentColor"/>
                        <circle cx="70" cy="22" r="4" fill="currentColor"/>
                        <circle cx="75" cy="40" r="4" fill="currentColor"/>
                        <circle cx="65" cy="55" r="4" fill="currentColor"/>
                        <circle cx="45" cy="50" r="4" fill="currentColor"/>
                        <line x1="25" y1="30" x2="35" y2="18" stroke="currentColor" strokeWidth="1.5"/>
                        <line x1="35" y1="18" x2="55" y2="15" stroke="currentColor" strokeWidth="1.5"/>
                        <line x1="55" y1="15" x2="70" y2="22" stroke="currentColor" strokeWidth="1.5"/>
                        <line x1="70" y1="22" x2="75" y2="40" stroke="currentColor" strokeWidth="1.5"/>
                        <line x1="75" y1="40" x2="65" y2="55" stroke="currentColor" strokeWidth="1.5"/>
                        <line x1="65" y1="55" x2="45" y2="50" stroke="currentColor" strokeWidth="1.5"/>
                        <line x1="45" y1="50" x2="25" y2="30" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    </div>
                    <h1>{t.login.title}</h1>
                    <p className="subtitle">{isLogin ? t.login.welcome : t.login.signupSub}</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="form-group">
                            <label>{t.login.displayName}</label>
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder={t.login.displayNamePlaceholder}
                                required
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label>{t.login.email}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t.login.emailPlaceholder}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>{t.login.password}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={t.login.passwordPlaceholder}
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? t.login.processing : isLogin ? t.login.loginBtn : t.login.signupBtn}
                    </button>

                    <div className="login-divider">
                        <span>{t.login.or}</span>
                    </div>

                    <div className="google-login-row">
                        {googleLoading ? (
                            <div className="google-loading">{t.login.verifyingGoogle}</div>
                        ) : (
                            <GoogleLogin
                                onSuccess={async credentialResponse => {
                                    setError("");
                                    setGoogleLoading(true);
                                    try {
                                        await onGoogleLogin(credentialResponse.credential);
                                    } catch (err) {
                                        console.error("Google login callback error:", err);
                                        setError(err.message || "Google Login failed to sync with server.");
                                    } finally {
                                        setGoogleLoading(false);
                                    }
                                }}
                                onError={() => {
                                    setError("Google Login Failed at prompt");
                                }}
                                useOneTap
                                theme="filled_black"
                                shape="pill"
                                disabled={loading || googleLoading}
                            />
                        )}
                    </div>
                </form>

                <div className="login-footer">
                    <span>{isLogin ? t.login.noAccount : t.login.hasAccount}</span>
                    <button className="toggle-btn" onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? t.login.createAccount : t.login.loginInstead}
                    </button>
                </div>
            </div>

            {/* Background elements */}
            <div className="bg-glow bg-glow-1"></div>
            <div className="bg-glow bg-glow-2"></div>
        </div>
    );
};

export default LoginPage;
