import { useState, useEffect, useRef } from 'react';
import { FiSend } from 'react-icons/fi';
import { subscribeChatMessages, sendChatMessage } from '../services/firebase';
import { useAuth } from '../context/AuthContext';

export default function ChatPanel({ eventId }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState('');
  const [sending, setSending]   = useState(false);
  const bottomRef               = useRef(null);

  useEffect(() => {
    const unsub = subscribeChatMessages(eventId, setMessages);
    return unsub;
  }, [eventId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      await sendChatMessage(eventId, input.trim(), user);
      setInput('');
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-panel">
      {/* Header */}
      <div className="chat-header">
        <span style={{ fontSize: '1rem' }}>💬</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Event Chat</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{messages.length} messages</div>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 40 }}>
            No messages yet. Be the first to say hi! 👋
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.userId === user?.id;
            return (
              <div key={msg.id} className={`chat-message ${isOwn ? 'own' : ''}`}>
                {!isOwn && (
                  <div className="avatar avatar-sm">{msg.userName?.[0]?.toUpperCase()}</div>
                )}
                <div>
                  {!isOwn && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4, fontWeight: 500 }}>
                      {msg.userName}
                    </div>
                  )}
                  <div className="chat-bubble">{msg.text}</div>
                  <div className={`chat-meta ${isOwn ? '' : ''}`} style={{ textAlign: isOwn ? 'right' : 'left' }}>
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form className="chat-input-bar" onSubmit={handleSend}>
        <input
          className="chat-input"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={sending}
        />
        <button type="submit" className="btn btn-primary btn-icon" disabled={!input.trim() || sending}>
          <FiSend size={16} />
        </button>
      </form>
    </div>
  );
}
