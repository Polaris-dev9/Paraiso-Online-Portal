import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Play, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EventCard = ({ event, isFeatured, onRegister, onMediaClick, categoryName }) => {
  const cardContent = (
    <>
      <img
        src={event.image}
        alt={event.title}
        className={`w-full object-cover ${isFeatured ? 'h-64' : 'h-48'}`}
      />
      <div className={`p-${isFeatured ? '6' : '4'}`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${isFeatured ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 text-xs'}`}>
            {categoryName}
          </span>
          <span className="text-green-600 font-semibold">{event.price}</span>
        </div>
        
        <h3 className={`font-bold text-gray-900 mb-3 line-clamp-2 ${isFeatured ? 'text-xl' : 'text-lg'}`}>
          {event.title}
        </h3>
        
        <p className={`text-gray-600 mb-4 line-clamp-2 ${isFeatured ? '' : 'text-sm'}`}>
          {event.description}
        </p>
        
        <div className={`space-y-2 mb-4 text-gray-600 ${isFeatured ? 'text-sm' : 'text-xs'}`}>
          <div className="flex items-center">
            <Calendar size={isFeatured ? 16 : 12} className="mr-2 text-blue-500" />
            <span>{new Date(event.date).toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="flex items-center">
            <Clock size={isFeatured ? 16 : 12} className="mr-2 text-blue-500" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center">
            <MapPin size={isFeatured ? 16 : 12} className="mr-2 text-blue-500" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center">
            <Users size={isFeatured ? 16 : 12} className="mr-2 text-blue-500" />
            <span>{event.registered} / {event.capacity} {isFeatured && 'inscritos'}</span>
          </div>
        </div>

        {(event.gallery.length > 0 || event.videos.length > 0) && (
          <div className="mb-4">
            {isFeatured && <h4 className="font-semibold text-sm text-gray-900 mb-2">📸 Galeria e Vídeos</h4>}
            <div className="flex space-x-2">
              {event.gallery.slice(0, isFeatured ? 3 : 2).map((image, index) => (
                <button
                  key={index}
                  onClick={() => onMediaClick('image')}
                  className={`relative rounded-lg overflow-hidden hover:opacity-80 transition-opacity ${isFeatured ? 'w-16 h-16' : 'w-12 h-12'}`}
                >
                  <img src={image} alt={`Galeria ${index + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                    <ImageIcon size={isFeatured ? 16 : 12} className="text-white" />
                  </div>
                </button>
              ))}
              {event.videos.slice(0, 1).map((video, index) => (
                <button
                  key={`video-${index}`}
                  onClick={() => onMediaClick('video')}
                  className={`relative rounded-lg overflow-hidden hover:opacity-80 transition-opacity ${isFeatured ? 'w-16 h-16' : 'w-12 h-12'}`}
                >
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <Play size={isFeatured ? 16 : 12} className="text-white" />
                  </div>
                </button>
              ))}
              {(event.gallery.length + event.videos.length > (isFeatured ? 4 : 3)) && (
                <button
                  onClick={() => onMediaClick('gallery')}
                  className={`bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors ${isFeatured ? 'w-16 h-16' : 'w-12 h-12'}`}
                >
                  <span className="text-xs font-semibold">+{event.gallery.length + event.videos.length - (isFeatured ? 3 : 2)}</span>
                </button>
              )}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className={`w-full bg-gray-200 rounded-full mr-4 ${isFeatured ? 'h-2' : 'h-1.5'}`}>
            <div 
              className="bg-blue-600 rounded-full"
              style={{ width: `${(event.registered / event.capacity) * 100}%`, height: '100%' }}
            ></div>
          </div>
          <Button 
            onClick={() => onRegister(event.id)}
            className={`${isFeatured ? 'gradient-royal text-white hover:opacity-90 whitespace-nowrap' : 'w-full text-blue-900 border-blue-900 hover:bg-blue-50'}`}
            variant={isFeatured ? 'default' : 'outline'}
          >
            Inscrever-se
          </Button>
        </div>
      </div>
    </>
  );

  if (isFeatured) {
    return (
      <article className="bg-white rounded-lg shadow-lg overflow-hidden hover-lift">
        {cardContent}
      </article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover-lift"
    >
      {cardContent}
    </motion.article>
  );
};

export default EventCard;