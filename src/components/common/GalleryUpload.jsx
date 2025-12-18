import React, { useState } from 'react';
import { X, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import imageService from '@/services/imageService';

const GalleryUpload = ({ subscriberId, currentImages = [], maxImages = 10, onImagesChange }) => {
    const { toast } = useToast();
    const [uploading, setUploading] = useState(false);
    const [images, setImages] = useState(currentImages);

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        
        if (images.length + files.length > maxImages) {
            toast({
                variant: "destructive",
                title: "Limite excedido",
                description: `Você pode adicionar no máximo ${maxImages} imagens. Você já tem ${images.length} imagem${images.length !== 1 ? 'ns' : ''}.`,
            });
            return;
        }

        setUploading(true);
        const newImages = [...images];

        for (const file of files) {
            try {
                const validation = imageService.validateImage(file);
                if (!validation.valid) {
                    toast({
                        variant: "destructive",
                        title: "Erro",
                        description: validation.error,
                    });
                    continue;
                }

                const result = await imageService.uploadImage(
                    file,
                    'subscribers',
                    subscriberId,
                    'gallery'
                );

                newImages.push({
                    url: result.url,
                    path: result.path,
                    name: file.name
                });
            } catch (error) {
                console.error('Error uploading image:', error);
                toast({
                    variant: "destructive",
                    title: "Erro ao enviar imagem",
                    description: error.message || "Tente novamente.",
                });
            }
        }

        setImages(newImages);
        onImagesChange?.(newImages);
        setUploading(false);

        if (files.length > 0 && newImages.length > images.length) {
            toast({
                title: "✅ Imagem(ns) adicionada(s)!",
                description: `${newImages.length - images.length} imagem(ns) adicionada(s) à galeria.`,
            });
        }
    };

    const handleRemoveImage = async (index) => {
        const imageToRemove = images[index];
        const newImages = images.filter((_, i) => i !== index);
        
        setImages(newImages);
        onImagesChange?.(newImages);

        // Deletar do storage
        if (imageToRemove.path) {
            try {
                await imageService.deleteImage(imageToRemove.path);
            } catch (error) {
                console.error('Error deleting image:', error);
            }
        }

        toast({
            title: "Imagem removida",
            description: "A imagem foi removida da galeria.",
        });
    };

    return (
        <div className="space-y-4">
            <div>
                <Label>Adicionar Imagens à Galeria</Label>
                <div className="relative mt-2">
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading || images.length >= maxImages}
                        className="absolute w-full h-full opacity-0 cursor-pointer"
                        id="gallery-upload"
                    />
                    <label
                        htmlFor="gallery-upload"
                        className={`flex items-center justify-center w-full h-32 px-3 py-2 text-sm border-2 border-dashed rounded-md cursor-pointer transition-colors ${
                            uploading || images.length >= maxImages
                                ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-50'
                                : 'bg-gray-50 border-gray-300 hover:bg-gray-100 hover:border-blue-400'
                        }`}
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 text-gray-500 animate-spin" />
                                <span className="text-gray-600">Enviando...</span>
                            </>
                        ) : images.length >= maxImages ? (
                            <>
                                <ImageIcon className="mr-2 h-5 w-5 text-gray-500" />
                                <span className="text-gray-600">Limite de {maxImages} imagens atingido</span>
                            </>
                        ) : (
                            <>
                                <Upload className="mr-2 h-5 w-5 text-gray-500" />
                                <span className="text-gray-600">
                                    Clique para adicionar imagens ({images.length}/{maxImages})
                                </span>
                            </>
                        )}
                    </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    Formatos: JPG, PNG, WEBP. Máx: 5MB por imagem. Limite: {maxImages} imagens.
                </p>
            </div>

            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={image.url}
                                alt={`Galeria ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border border-gray-300"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GalleryUpload;

