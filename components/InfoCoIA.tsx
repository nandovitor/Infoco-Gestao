import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '../lib/icons';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const InfoCoIA = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: 'Olá! Eu sou a INFOCO<IA>, sua assistente virtual. Como posso te ajudar hoje?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom of the chat body whenever messages change
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = { sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage.text }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const botMessage: Message = { sender: 'bot', text: data.reply };
        setMessages(prev => [...prev, botMessage]);

    } catch (error) {
        console.error("Error fetching AI response:", error);
        const errorMessage: Message = { sender: 'bot', text: 'Desculpe, ocorreu um erro ao me comunicar com a IA. Por favor, tente novamente mais tarde.' };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      <button className="ai-fab" onClick={toggleChat} aria-label="Abrir assistente IA">
        <Icons.ai className="w-8 h-8" />
      </button>

      {isOpen && (
        <div className="ai-chat-window">
          <header className="ai-chat-header">
            <span>INFOCO&lt;IA&gt;</span>
            <button onClick={toggleChat} style={{background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer'}}>&times;</button>
          </header>
          <div className="ai-chat-body" ref={chatBodyRef}>
            {messages.map((msg, index) => (
              <div key={index} className={`ai-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && <div className="ai-message bot">Digitando...</div>}
          </div>
          <form className="ai-chat-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Digite sua mensagem..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
                <Icons.send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default InfoCoIA;
