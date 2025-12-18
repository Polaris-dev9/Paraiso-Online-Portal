import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import imageService from '@/services/imageService';

/**
 * Componente de upload de imagem com preview
 * @param {Object} props
 * @param {string} props.label - Label do campo
 * @param {string} props.currentImageUrl - URL da imagem atual (opcional)
 * @param {Function} props.onImageChange - Callback quando imagem é alterada (recebe URL)
 * @param {Function} props.onImageUploaded - Callback quando upload é concluído (recebe URL, path)
 * @param {string} props.imageType - Tipo da imagem ('profile', 'banner', etc.)
 * @param {string} props.userId - ID do usuário (opcional)
 * @param {string} props.folder - Pasta onde a imagem será armazenada (default: 'subscribers')
 * @param {string} props.bucket - Nome do bucket do Supabase Storage (default: 'subscriber-images')
 * @param {boolean} props.required - Se é obrigatório
 * @param {string} props.accept - Tipos de arquivo aceitos (default: 'image/*')
 * @param {number} props.maxSizeMB - Tamanho máximo em MB (default: 5)
 */
const ImageUpload = ({
  label,
  currentImageUrl,
  onImageChange,
  onImageUploaded,
  imageType = 'image',
  userId,
  folder = 'subscribers',
  bucket = 'subscriber-images',
  required = false,
  accept = 'image/*',
  maxSizeMB = 5,
  className
}) => {
  const [preview, setPreview] = useState(currentImageUrl || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Atualizar preview quando currentImageUrl mudar
  React.useEffect(() => {
    console.log('[ImageUpload] currentImageUrl changed:', { currentImageUrl, imageType, label });
    setPreview(currentImageUrl || null);
  }, [currentImageUrl]);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar arquivo
    const validation = imageService.validateImage(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Criar preview local imediatamente
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Redimensionar se necessário (opcional, para otimização)
      let fileToUpload = file;
      if (file.size > 1024 * 1024) { // Se maior que 1MB, redimensionar
        try {
          fileToUpload = await imageService.resizeImage(file, 1920, 1080, 0.8);
        } catch (resizeError) {
          console.warn('Erro ao redimensionar, usando imagem original:', resizeError);
          fileToUpload = file;
        }
      }

      // Fazer upload para Supabase Storage
      const result = await imageService.uploadImage(fileToUpload, folder, userId, imageType, bucket);
      
      // Notificar componente pai
      if (onImageUploaded) {
        onImageUploaded(result.url, result.path);
      } else if (onImageChange) {
        // Manter compatibilidade com versão antiga
        onImageChange(result.url, result.path);
      }

      setError(null);
    } catch (uploadError) {
      console.error('Error uploading image:', uploadError);
      setError(uploadError.message || 'Erro ao fazer upload da imagem');
      setPreview(currentImageUrl || null); // Restaurar preview anterior
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Notificar componente pai da remoção
    if (onImageUploaded) {
      onImageUploaded(null, null);
    } else if (onImageChange) {
      onImageChange(null, null);
    }
    
    setError(null);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={`image-upload-${imageType}`}>
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}

      <div className="flex flex-col sm:flex-row items-start gap-4">
        {/* Preview da imagem */}
        <div className="relative flex-shrink-0 w-full sm:w-auto flex justify-center sm:block">
          {preview ? (
            <div className="relative group inline-block">
              <img
                src={preview}
                alt={label || 'Preview'}
                className={cn(
                  'border-2 border-gray-300 rounded-lg object-cover bg-white',
                  imageType === 'banner' 
                    ? 'w-full max-w-[400px] aspect-[21/9] sm:w-64 sm:h-32' 
                    : 'w-32 h-32'
                )}
              />
              {!uploading && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-md transition-all"
                  title="Remover imagem"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div
              className={cn(
                'border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50',
                imageType === 'banner' 
                  ? 'w-full max-w-[400px] aspect-[21/9] sm:w-64 sm:h-32' 
                  : 'w-32 h-32'
              )}
            >
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Controles de upload */}
        <div className="flex-1 w-full space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            id={`image-upload-${imageType}`}
            disabled={uploading}
          />
          
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClick}
              disabled={uploading}
              className="flex-1 sm:flex-none h-10"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  {preview ? 'Trocar Imagem' : 'Selecionar Imagem'}
                </>
              )}
            </Button>
            
            {preview && !uploading && (
              <Button
                type="button"
                variant="outline"
                onClick={handleRemove}
                className="flex-1 sm:flex-none text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 h-10"
              >
                <X className="w-4 h-4 mr-2" />
                Remover
              </Button>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-600 font-medium">{error}</p>
          )}

          <p className="text-xs text-gray-500 leading-relaxed">
            Formatos aceitos: JPG, PNG, WEBP, GIF.<br/>
            Tamanho máximo: {maxSizeMB}MB
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;

