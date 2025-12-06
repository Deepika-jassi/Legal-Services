import React, { useEffect, useRef, useState } from "react";
import "../styles/LawyerSimplePage.css";

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(null);
  const [input, setInput] = useState("");
  const API_ROOT = "http://localhost:5000";
  const headers = { "Content-Type": "application/json", "x-user-role":"lawyer","x-user-id":"lawyer1" };
  const sample = [
    { id: "c1", client: "Alice", messages: [{ from: "Alice", text: "Hello, I need help", at: Date.now()-3600000 }] },
    { id: "c2", client: "Bob", messages: [{ from: "Bob", text: "Please review my docs", at: Date.now()-7200000 }] }
  ];
  const refScroll = useRef();

  useEffect(()=> {
    // load conversations (fallback to sample)
    (async ()=>{
      try {
        const res = await fetch(`${API_ROOT}/api/lawyer/messages`, { headers });
        if (!res.ok) throw new Error("no convos");
        const data = await res.json();
        setConversations(data);
      } catch (e) {
        setConversations(sample);
      }
    })();
  },[]);

  useEffect(()=> { if (refScroll.current) refScroll.current.scrollTop = refScroll.current.scrollHeight; }, [active]);

  const send = async () => {
    if (!input || !active) return;
    const msg = { from: "lawyer", text: input, at: Date.now() };
    setConversations(prev => prev.map(c => c.id === active.id ? { ...c, messages: [...c.messages, msg] } : c));
    setInput("");
    try {
      await fetch(`${API_ROOT}/api/lawyer/messages/${active.id}`, { method: "POST", headers, body: JSON.stringify(msg) });
    } catch (e) { console.warn(e); }
  };

  return (
    <div className="simple-page chat-page">
      <h2>Messages</h2>
      <p className="muted">Chat with clients in real-time (mock). Click a conversation to open chat.</p>

      <div className="chat-wrap">
        <div className="chat-list">
          {conversations.map(c=>(
            <div key={c.id} className={`chat-item ${active && active.id===c.id ? "active" : ""}`} onClick={()=>setActive(c)}>
              <div className="chat-name">{c.client}</div>
              <div className="chat-last muted">{c.messages[c.messages.length-1].text.slice(0,40)}</div>
            </div>
          ))}
        </div>

        <div className="chat-panel">
          {active ? (
            <>
              <div className="chat-head"><strong>{active.client}</strong></div>
              <div className="chat-messages" ref={refScroll}>
                {active.messages.map((m,i)=>(
                  <div key={i} className={`chat-msg ${m.from === "lawyer" ? "sent" : "recv"}`}>
                    <div className="chat-text">{m.text}</div>
                    <div className="chat-time muted">{new Date(m.at).toLocaleTimeString()}</div>
                  </div>
                ))}
              </div>

              <div className="chat-input">
                <input placeholder="Write a message..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={(e)=>{if(e.key==="Enter") send();}} />
                <button className="btn" onClick={send}>Send</button>
              </div>
            </>
          ) : (
            <div className="empty">Select a conversation to start messaging</div>
          )}
        </div>
      </div>
    </div>
  );
}
