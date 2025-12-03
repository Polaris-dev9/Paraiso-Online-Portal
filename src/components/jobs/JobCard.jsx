import React from 'react';
import { motion } from 'framer-motion';
import { Building, MapPin, DollarSign, Clock, Users, Eye, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const JobCard = ({ job, isFeatured, onApply, onSchedule }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const commonClasses = "bg-white rounded-lg shadow-lg p-6 hover-lift relative";
  const featuredClasses = isFeatured ? "border-2 border-yellow-400" : "";

  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className={`${commonClasses} ${featuredClasses}`}
    >
      {job.urgent && (
        <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
          🚨 URGENTE
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-900 pr-8">
              {job.title}
            </h3>
            {isFeatured && <Star className="text-yellow-500 fill-current flex-shrink-0" size={24} />}
          </div>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 mb-3">
            <div className="flex items-center"><Building size={14} className="mr-1" /> <span className="font-semibold">{job.company}</span></div>
            <div className="flex items-center"><MapPin size={14} className="mr-1" /> <span>{job.location}</span></div>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{job.type}</span>
            <div className="flex items-center text-green-600 font-semibold"><DollarSign size={14} className="mr-1" /> <span>{job.salary}</span></div>
          </div>
          
          <p className="text-gray-600 mb-3 line-clamp-2 text-sm">
            {job.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {job.requirements.slice(0, 4).map((req, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{req}</span>
            ))}
            {job.requirements.length > 4 && <span className="text-gray-500 text-xs">+{job.requirements.length - 4}</span>}
          </div>
          
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span className="flex items-center"><Clock size={12} className="mr-1" /> {new Date(job.postedDate).toLocaleDateString('pt-BR')}</span>
            <span className="flex items-center"><Users size={12} className="mr-1" /> {job.applications} candidatos</span>
            <span className="flex items-center"><Eye size={12} className="mr-1" /> {job.views} visualizações</span>
          </div>
        </div>
        
        <div className="flex flex-col justify-center space-y-2">
          <Button onClick={() => onApply(job.id)} className="w-full gradient-royal text-white hover:opacity-90">Candidatar-se</Button>
          <Button onClick={() => onSchedule(job.id)} variant="outline" className="w-full text-blue-900 border-blue-900 hover:bg-blue-50 text-sm">Agendar Entrevista</Button>
        </div>
      </div>
    </motion.article>
  );
};

export default JobCard;