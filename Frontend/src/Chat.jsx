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
                ✦
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
