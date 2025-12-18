import React, { useState } from 'react';
import { Trash, Plus, Image as ImageIcon, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import imageService from '@/services/imageService';
import { useToast } from '@/components/ui/use-toast';

const MultiImageUpload = ({ 
  urls = [], 
  onImagesChange, 
  folder = 'general', 
  bucket = 'subscriber-images',
  userId,
  maxImages = 10 
}) => {
  const [uploading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (urls.length + files.length > maxImages) {
      toast({
        variant: "destructive",
        title: "Limite excedido",
        description: `Você pode enviar no máximo ${maxImages} imagens.`
      });
      return;
    }

    setLoading(true);
    const newUrls = [...urls];

    try {
      for (const file of files) {
        const result = await imageService.uploadImage(file, folder, userId, 'gallery', bucket);
        newUrls.push(result.url);
      }
      onImagesChange(newUrls);
      toast({ title: "Sucesso!", description: `${files.length} imagem(ns) enviada(s).` });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        variant: "destructive",
        title: "Erro no upload",
        description: "Não foi possível enviar algumas imagens."
      });
    } finally {
      setLoading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const removeImage = (indexToRemove) => {
    const newUrls = urls.filter((_, index) => index !== indexToRemove);
    onImagesChange(newUrls);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {urls.map((url, index) => (
          <div key={index} className="relative group aspect-square border rounded-lg overflow-hidden bg-gray-100">
            <img 
              src={url} 
              alt={`Galeria ${index + 1}`} 
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        
        {urls.length < maxImages && (
          <label className="relative aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            ) : (
              <>
                <Plus className="h-8 w-8 text-gray-400" />
                <span className="text-xs text-gray-500 mt-2 font-medium text-center px-2">Adicionar Fotos</span>
              </>
            )}
            <input 
              type="file" 
              className="hidden" 
              multiple 
              accept="image/*" 
              onChange={handleUpload} 
              disabled={uploading}
            />
          </label>
        )}
      </div>
      <p className="text-xs text-gray-500">
        Clique no "+" para selecionar várias imagens. Máximo de {maxImages} fotos.
      </p>
    </div>
  );
};

export default MultiImageUpload;

