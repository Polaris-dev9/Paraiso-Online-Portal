import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Phone } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const WhatsAppFloat = () => {
  const [isOpen, setIsOpen] = useState(false);

  const contacts = [
    { name: "Comercial", number: "38998085771" },
    { name: "Suporte", number: "38997279279" },
    { name: "Redação", number: "38998518103" },
  ];

  const openWhatsApp = (number) => {
    window.open(`https://wa.me/55${number}`, '_blank');
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <motion.button
          className="whatsapp-float bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={isOpen ? "x" : "message"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2 mr-4 mb-2" side="top" align="end">
        <div className="p-4 bg-green-600 text-white rounded-t-lg">
          <h3 className="font-bold text-center">Fale Conosco</h3>
        </div>
        <div className="space-y-2 p-2">
          {contacts.map((contact) => (
            <button
              key={contact.number}
              onClick={() => openWhatsApp(contact.number)}
              className="w-full flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Phone size={18} className="mr-3 text-green-500" />
              <div className="text-left">
                <p className="font-semibold text-sm text-gray-800">{contact.name}</p>
                <p className="text-xs text-gray-500">(38) {contact.number.slice(2, 7)}-{contact.number.slice(7)}</p>
              </div>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default WhatsAppFloat;