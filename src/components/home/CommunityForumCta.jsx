import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CommunityForumCta = () => {
  return (
    <section className="py-16 bg-blue-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-white rounded-2xl shadow-lg p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="flex-shrink-0">
            <div className="p-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full">
                <MessageSquare className="text-white h-16 w-16" />
            </div>
          </div>
          <div className="flex-grow text-center md:text-left">
            <h2 className="text-3xl font-bold text-blue-900 mb-2">Participe do Fórum da Comunidade!</h2>
            <p className="text-gray-600 text-lg">
              Conecte-se, compartilhe ideias, tire dúvidas e faça parte das discussões que movimentam nossa cidade.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link to="/forum">
              <Button size="lg" className="gradient-royal text-white font-bold text-lg rounded-full px-8 py-6">
                Acessar Fórum <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunityForumCta;