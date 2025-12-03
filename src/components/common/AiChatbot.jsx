import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, Sparkles, MessageSquare, Mic, PlayCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { AI_CONFIG } from '@/config/ai-config.js';

const AiChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [messages, setMessages] = useState([
    { id: 1, from: 'isa', text: `Olá! Sou a ${AI_CONFIG.name}, a Inteligência do Portal Paraíso Online. Em que posso ser útil hoje?` }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isIsaTyping, setIsIsaTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isIsaTyping]);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSend = (e) => {
    e.preventDefault();
    if(inputValue.trim() === '') return;
    
    const userMessage = { id: Date.now(), from: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsIsaTyping(true);

    setTimeout(() => {
        const isaResponse = { 
            id: Date.now() + 1,
            from: 'isa', 
            text: 'Entendi! Para continuar seu atendimento sobre este assunto, por favor, clique no botão abaixo para falar com um de nossos consultores humanos no WhatsApp. Eles já receberam seu histórico e estão prontos para ajudar!',
            hasAudio: true
        };
        setMessages(prev => [...prev, isaResponse]);
        setIsIsaTyping(false);
    }, 1500);
  };
  
  const handleWhatsAppRedirect = () => {
    const message = messages.length > 1 ? messages.find(m => m.from === 'user')?.text : "Gostaria de falar com um consultor.";
    window.open(`https://wa.me/5538998085771?text=Ol%C3%A1%2C%20iniciei%20uma%20conversa%20com%20a%20${AI_CONFIG.name}%20sobre:%20%22${encodeURIComponent(message)}%22`, '_blank');
  }

  const handlePlayAudio = (textToSpeak) => {
    if ('speechSynthesis' in window && AI_CONFIG.fallbackText === false) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      const voices = window.speechSynthesis.getVoices();
      let chosenVoice = voices.find(voice => voice.lang === 'pt-BR' && voice.name.includes('Female'));
      if (!chosenVoice) {
         chosenVoice = voices.find(voice => voice.lang === 'pt-BR');
      }

      if (chosenVoice) {
          utterance.voice = chosenVoice;
      }
      utterance.lang = AI_CONFIG.language;
      utterance.rate = 1.1;
      utterance.pitch = 1.2;
      window.speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "🚫 Recurso de Voz Indisponível",
        description: "Seu navegador não suporta a síntese de voz ou a funcionalidade está desativada. A resposta será apenas em texto.",
      });
    }
  };
  
  const handleMicClick = () => {
     toast({
      title: "🎙️ Microfone Ativado!",
      description: "Funcionalidade de reconhecimento de voz em desenvolvimento.",
    });
  }

  return (
    <>
      <div className="fixed bottom-5 right-5 z-[2000]">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.5 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full max-w-sm h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200"
              style={{maxHeight: 'calc(100vh - 80px)'}}
            >
              <header className="gradient-royal text-white p-4 rounded-t-2xl flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Bot size={24} className="text-white"/>
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white"></span>
                  </div>
                  <div>
                    <h3 className="font-bold">{AI_CONFIG.name} - Inteligência do Portal</h3>
                    <p className="text-xs text-blue-200">Online</p>
                  </div>
                </div>
                <button onClick={handleToggle} className="hover:text-yellow-300 p-1 rounded-full hover:bg-white/10">
                  <X size={20} />
                </button>
              </header>
              <main className="flex-1 p-4 overflow-y-auto bg-gray-50">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-end space-x-2 ${msg.from === 'user' ? 'justify-end' : ''}`}>
                      {msg.from === 'isa' && (
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                          <Bot size={18} />
                        </div>
                      )}
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-3 rounded-lg max-w-xs ${msg.from === 'isa' ? 'bg-blue-100 text-gray-800 rounded-bl-none' : 'bg-blue-600 text-white rounded-br-none'}`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        {msg.hasAudio && (
                           <Button onClick={() => handlePlayAudio(msg.text)} variant="ghost" size="sm" className="mt-2 text-blue-700 hover:text-blue-900 p-1 h-auto -ml-1">
                             <PlayCircle size={16} className="mr-1" /> Ouvir resposta
                           </Button>
                        )}
                      </motion.div>
                    </div>
                  ))}
                  {isIsaTyping && (
                      <div className="flex items-end space-x-2">
                         <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                           <Bot size={18} />
                         </div>
                         <div className="p-3 rounded-lg bg-blue-100 rounded-bl-none">
                            <div className="flex items-center space-x-1">
                                <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"></span>
                            </div>
                         </div>
                      </div>
                  )}
                   {messages.some(m => m.from === 'isa' && m.text.includes('WhatsApp')) && (
                     <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="flex justify-center pt-2">
                       <Button onClick={handleWhatsAppRedirect} variant="default" className="w-full bg-green-500 hover:bg-green-600 text-white">
                         <MessageSquare className="mr-2" size={16} />
                         Continuar no WhatsApp
                       </Button>
                     </motion.div>
                   )}
                   <div ref={messagesEndRef} />
                </div>
              </main>
              <footer className="p-4 border-t bg-white rounded-b-2xl">
                <form onSubmit={handleSend} className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder={`Fale com a ${AI_CONFIG.name}...`}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                   <Button type="button" size="icon" variant="ghost" onClick={handleMicClick}>
                    <Mic size={18} />
                  </Button>
                  <Button type="submit" size="icon" className="gradient-royal text-white" disabled={isIsaTyping}>
                    {isIsaTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  </Button>
                </form>
              </footer>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.button
        onClick={handleToggle}
        className="fixed bottom-5 right-5 z-[2001] w-16 h-16 rounded-full gradient-gold text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        aria-label={`Abrir chat com a assistente ${AI_CONFIG.name}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={isOpen ? "close" : "isa"}
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2, ease: "circOut" }}
          >
            {isOpen ? <X size={32} /> : <Sparkles size={32} />}
          </motion.div>
        </AnimatePresence>
      </motion.button>
    </>
  );
};

export default AiChatbot;