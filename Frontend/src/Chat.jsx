import { useEffect, useRef } from "react";
import { useChat } from "./MyContext.jsx";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./Chat.css";

function Chat() {
  const { prevChats, activeMessageIndex } = useChat();
  const bottomRef = useRef(null);

  useEffect(() => {
    if (activeMessageIndex !== null && activeMessageIndex !== undefined) {
      const el = document.getElementById(`chat-msg-${activeMessageIndex}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("message-highlight");
        setTimeout(() => el.classList.remove("message-highlight"), 2000);
      }
    } else {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [prevChats, activeMessageIndex]);

  return (
    <div className="chats">
      {prevChats.map((chat, idx) => {
        const isUser = chat.role === "user";
        return (
          <div
            key={idx}
            id={`chat-msg-${idx}`}
            className={`message-row ${isUser ? "message-row--user" : "message-row--ai"}`}
          >
            {!isUser && (
              <div className="ai-avatar" title="Constellation">
                <svg width="16" height="16" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="25" cy="30" r="5" fill="currentColor"/>
                  <circle cx="35" cy="18" r="5" fill="currentColor"/>
                  <circle cx="55" cy="15" r="5" fill="currentColor"/>
                  <circle cx="70" cy="22" r="5" fill="currentColor"/>
                  <circle cx="75" cy="40" r="5" fill="currentColor"/>
                  <circle cx="65" cy="55" r="5" fill="currentColor"/>
                  <circle cx="45" cy="50" r="5" fill="currentColor"/>
                  <line x1="25" y1="30" x2="35" y2="18" stroke="currentColor" strokeWidth="2.5"/>
                  <line x1="35" y1="18" x2="55" y2="15" stroke="currentColor" strokeWidth="2.5"/>
                  <line x1="55" y1="15" x2="70" y2="22" stroke="currentColor" strokeWidth="2.5"/>
                  <line x1="70" y1="22" x2="75" y2="40" stroke="currentColor" strokeWidth="2.5"/>
                  <line x1="75" y1="40" x2="65" y2="55" stroke="currentColor" strokeWidth="2.5"/>
                  <line x1="65" y1="55" x2="45" y2="50" stroke="currentColor" strokeWidth="2.5"/>
                  <line x1="45" y1="50" x2="25" y2="30" stroke="currentColor" strokeWidth="2.5"/>
                </svg>
              </div>
            )}
            <div className={`bubble ${isUser ? "bubble--user" : "bubble--ai"}`}>
              {isUser ? (
                chat.content
              ) : (
                <div className="markdown-body">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {chat.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}

export default Chat;
