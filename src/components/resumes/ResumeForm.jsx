import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const ResumeForm = ({ formData, handleInputChange, handleSubmit, setShowForm }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-lg shadow-lg p-8 mb-12"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-900">📝 Cadastrar Currículo</h2>
        <Button 
          onClick={() => setShowForm(false)}
          variant="outline"
          className="text-gray-600"
        >
          Cancelar
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Nome Completo *</label>
            <input
              type="text" name="name" value={formData.name} onChange={handleInputChange} required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Seu nome completo"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">E-mail *</label>
            <input
              type="email" name="email" value={formData.email} onChange={handleInputChange} required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Telefone *</label>
            <input
              type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="(11) 99999-9999"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Localização *</label>
            <input
              type="text" name="location" value={formData.location} onChange={handleInputChange} required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Cidade, Estado"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Profissão/Área *</label>
            <input
              type="text" name="profession" value={formData.profession} onChange={handleInputChange} required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Desenvolvedor, Vendedor, Analista..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Experiência (anos)</label>
            <select
              name="experience" value={formData.experience} onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione...</option>
              <option value="0-1">0-1 anos</option>
              <option value="2-3">2-3 anos</option>
              <option value="4-5">4-5 anos</option>
              <option value="6-10">6-10 anos</option>
              <option value="10+">Mais de 10 anos</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Formação Acadêmica</label>
          <textarea
            name="education" value={formData.education} onChange={handleInputChange} rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Graduação em Administração - Universidade XYZ (2020)"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Principais Habilidades</label>
          <textarea
            name="skills" value={formData.skills} onChange={handleInputChange} rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Excel avançado, Inglês fluente, Gestão de equipes..."
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Resumo Profissional</label>
          <textarea
            name="summary" value={formData.summary} onChange={handleInputChange} rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Conte um pouco sobre sua experiência e objetivos profissionais..."
          />
        </div>
        <div className="flex justify-end space-x-4">
          <Button type="button" onClick={() => setShowForm(false)} variant="outline" className="px-6 py-3">
            Cancelar
          </Button>
          <Button type="submit" className="gradient-royal text-white hover:opacity-90 px-6 py-3">
            Cadastrar Currículo
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ResumeForm;