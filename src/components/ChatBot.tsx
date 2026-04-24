import { useState, useRef, useEffect } from "react";
import type { Phone } from "../types/Phone";

type Message = {
  text: string;
  type: "user" | "bot";
  products?: Phone[];
};

type Props = {
  addToCart: (p: Phone) => void;
  phones: Phone[];
};

export default function ChatBot({ addToCart }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const endRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // 🚀 HÀM ĐỊNH DẠNG GIÁ: Nhân USD với 25.000 và format VNĐ
  const formatVNPrice = (usdPrice: number) => {
    const vndPrice = usdPrice * 25000;
    return new Intl.NumberFormat("vi-VN").format(vndPrice) + "đ";
  };

  // Load tin nhắn cũ từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem("chat_messages");
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([
        { text: "Xin chào! Mình có thể giúp gì cho bạn? 🤖", type: "bot" }
      ]);
    }
  }, []);

  // Tự động cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    localStorage.setItem("chat_messages", JSON.stringify(messages));
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Tự động focus vào ô nhập khi mở chat
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { text: input, type: "user" };
    setMessages(prev => [...prev, userMsg]);

    const currentInput = input;
    setInput("");
    setTyping(true);

    try {
      const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput })
      });

      const data = await res.json();
      setMessages(prev => [
        ...prev,
        {
          text: data.reply || "🤖 Không có phản hồi",
          type: "bot",
          products: data.products || []
        }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { text: "❌ Không kết nối được AI", type: "bot" }
      ]);
    }
    setTyping(false);
  };

  const clearChat = () => {
    const init: Message[] = [
      { text: "Xin chào! Mình có thể giúp gì cho bạn? 🤖", type: "bot" }
    ];
    setMessages(init);
    localStorage.removeItem("chat_messages");
  };

  return (
    <>
      {/* NÚT MỞ CHAT */}
      <div className="chat-toggle" onClick={() => setOpen(!open)}>
        💬
      </div>

      {open && (
        <div className="chatbox">
          {/* HEADER */}
          <div className="chat-header">
            <span>🤖 PhoneShop AI</span>
            <div style={{ display: "flex", gap: "10px" }}>
              <span className="chat-close" onClick={clearChat} style={{ cursor: 'pointer' }}>🗑</span>
              <span className="chat-close" onClick={() => setOpen(false)} style={{ cursor: 'pointer' }}>✖</span>
            </div>
          </div>

          {/* NỘI DUNG CHAT */}
          <div className="chat-body">
            {messages.map((m, i) => (
              <div key={i} className={`msg-row ${m.type}`}>
                {m.type === "bot" && <div className="avatar">🤖</div>}

                <div className={`msg ${m.type}`}>
                  {m.text}

                  {/* HIỂN THỊ DANH SÁCH SẢN PHẨM TỪ BOT */}
                  {m.products && m.products.length > 0 && (
                    <div className="chat-products">
                      {m.products.map(p => (
                        <div key={p.id} className="chat-product">
                          <img
                            src={`http://localhost:3000${p.img}`}
                            alt={p.name}
                          />
                          <div className="name">{p.name}</div>
                          
                          {/* HIỂN THỊ GIÁ VNĐ (Nhân 25k) */}
                          <div className="price" style={{ color: '#facc15', fontWeight: 'bold' }}>
                            {formatVNPrice(p.price)}
                          </div>

                          <button onClick={() => addToCart({ ...p, price: p.price * 25000 })}>
                            🛒 Mua
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {m.type === "user" && <div className="avatar">🧑</div>}
              </div>
            ))}

            {typing && (
              <div className="msg-row bot">
                <div className="avatar">🤖</div>
                <div className="typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={endRef}></div>
          </div>

          {/* Ô NHẬP TIN NHẮN */}
          <div className="chat-input">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}