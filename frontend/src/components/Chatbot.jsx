import { useState, useRef, useEffect } from 'react';
import GeminiService from '../services/GeminiService';

const INITIAL_MESSAGE = {
  id: 1,
  text: '¡Hola! Soy el asistente virtual de MatriFast. ¿En qué puedo ayudarte hoy?',
  sender: 'bot',
  timestamp: new Date()
};

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);
  const geminiService = useRef(new GeminiService());

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        sender: m.sender === 'user' ? 'Usuario' : 'Asistente',
        text: m.text
      }));

      const response = await geminiService.current.sendMessage(userMessage.text, history);
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: response,
        sender: 'bot',
        timestamp: new Date()
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: geminiService.current.getErrorResponse(error),
        sender: 'bot',
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (ts) => new Date(ts).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="chatbot-container">
      <button
        className={`chatbot-toggle ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h4>Asistente MatriFast</h4>
            <button onClick={() => setMessages([INITIAL_MESSAGE])} title="Limpiar">🗑️</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender} ${msg.isError ? 'error' : ''}`}>
                <div className="message-content">{msg.text}</div>
                <div className="message-time">{formatTime(msg.timestamp)}</div>
              </div>
            ))}
            {isLoading && (
              <div className="message bot">
                <div className="typing-indicator"><span/><span/><span/></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              rows="1"
              disabled={isLoading}
            />
            <button onClick={handleSendMessage} disabled={!inputText.trim() || isLoading}>
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
