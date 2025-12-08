import { supabase } from '@/lib/customSupabaseClient';

/**
 * Serviço para upload e gerenciamento de imagens no Supabase Storage
 */
const imageService = {
  /**
   * Faz upload de uma imagem para o Supabase Storage
   * @param {File} file - Arquivo de imagem a ser enviado
   * @param {string} folder - Pasta onde a imagem será armazenada (ex: 'profiles', 'banners')
   * @param {string} userId - ID do usuário (para organizar arquivos)
   * @param {string} imageType - Tipo da imagem (ex: 'profile', 'banner')
   * @returns {Promise<{url: string, path: string}>} URL pública e caminho da imagem
   */
  async uploadImage(file, folder = 'subscribers', userId, imageType = 'image') {
    try {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        throw new Error('O arquivo deve ser uma imagem');
      }

      // Validar tamanho (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('A imagem deve ter no máximo 5MB');
      }

      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${imageType}_${userId}_${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${userId}/${fileName}`;

      // Fazer upload para o Supabase Storage
      const { data, error } = await supabase.storage
        .from('subscriber-images') // Nome do bucket
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading image:', error);
        throw new Error(`Erro ao fazer upload da imagem: ${error.message}`);
      }

      // Obter URL pública da imagem
      // getPublicUrl retorna diretamente { publicUrl: string }, é síncrono
      const urlResult = supabase.storage
        .from('subscriber-images')
        .getPublicUrl(filePath);

      console.log('[imageService] getPublicUrl result:', { urlResult, filePath });

      // urlResult pode ser { publicUrl: string } ou { data: { publicUrl: string } }
      let publicUrl = urlResult?.publicUrl || urlResult?.data?.publicUrl;
      
      // Se ainda não encontrou, tentar acessar diretamente
      if (!publicUrl && urlResult) {
        // Verificar todas as propriedades possíveis
        console.log('[imageService] urlResult keys:', Object.keys(urlResult));
        publicUrl = urlResult.publicUrl || (urlResult.data && urlResult.data.publicUrl);
      }
      
      // Se getPublicUrl não retornou a URL, construir manualmente
      if (!publicUrl) {
        // Construir URL manualmente: https://[PROJECT-REF].supabase.co/storage/v1/object/public/[BUCKET]/[PATH]
        // A URL do Supabase está no cliente: https://eymkoopvzukbigeoikkf.supabase.co
        const supabaseUrl = 'https://eymkoopvzukbigeoikkf.supabase.co';
        if (supabaseUrl && filePath) {
          publicUrl = `${supabaseUrl}/storage/v1/object/public/subscriber-images/${filePath}`;
          console.log('[imageService] Constructed public URL manually:', publicUrl);
        } else {
          console.error('[imageService] Failed to get public URL:', { 
            filePath, 
            urlResult, 
            urlResultType: typeof urlResult,
            urlResultKeys: urlResult ? Object.keys(urlResult) : 'null'
          });
          throw new Error('Erro ao obter URL pública da imagem');
        }
      }
      
      console.log('[imageService] Image uploaded successfully:', {
        path: filePath,
        publicUrl: publicUrl
      });

      return {
        url: publicUrl,
        path: filePath,
        success: true
      };
    } catch (error) {
      console.error('Error in imageService.uploadImage:', error);
      throw error;
    }
  },

  /**
   * Deleta uma imagem do Supabase Storage
   * @param {string} filePath - Caminho do arquivo no storage
   * @returns {Promise<boolean>} true se deletado com sucesso
   */
  async deleteImage(filePath) {
    try {
      if (!filePath) {
        return true; // Se não há arquivo, consideramos sucesso
      }

      // Extrair apenas o caminho relativo (sem o bucket)
      const pathParts = filePath.split('/');
      const relativePath = pathParts.slice(pathParts.indexOf('subscriber-images') + 1).join('/');

      const { error } = await supabase.storage
        .from('subscriber-images')
        .remove([relativePath]);

      if (error) {
        console.error('Error deleting image:', error);
        // Não lançar erro, apenas logar (imagem pode não existir)
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in imageService.deleteImage:', error);
      return false;
    }
  },

  /**
   * Redimensiona uma imagem no cliente (opcional, para otimização)
   * @param {File} file - Arquivo original
   * @param {number} maxWidth - Largura máxima em pixels
   * @param {number} maxHeight - Altura máxima em pixels
   * @param {number} quality - Qualidade da compressão (0-1)
   * @returns {Promise<File>} Arquivo redimensionado
   */
  async resizeImage(file, maxWidth = 1920, maxHeight = 1080, quality = 0.8) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const img = new Image();
        
        img.onload = () => {
          // Calcular novas dimensões mantendo proporção
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = width * ratio;
            height = height * ratio;
          }

          // Criar canvas para redimensionar
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          
          ctx.drawImage(img, 0, 0, width, height);

          // Converter para blob
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const resizedFile = new File([blob], file.name, {
                  type: file.type,
                  lastModified: Date.now()
                });
                resolve(resizedFile);
              } else {
                reject(new Error('Erro ao redimensionar imagem'));
              }
            },
            file.type,
            quality
          );
        };

        img.onerror = () => {
          reject(new Error('Erro ao carregar imagem'));
        };

        img.src = event.target.result;
      };

      reader.onerror = () => {
        reject(new Error('Erro ao ler arquivo'));
      };

      reader.readAsDataURL(file);
    });
  },

  /**
   * Valida se o arquivo é uma imagem válida
   * @param {File} file - Arquivo a validar
   * @returns {{valid: boolean, error?: string}} Resultado da validação
   */
  validateImage(file) {
    // Verificar se é uma imagem
    if (!file.type.startsWith('image/')) {
      return {
        valid: false,
        error: 'O arquivo deve ser uma imagem (JPG, PNG, etc.)'
      };
    }

    // Verificar tipos permitidos
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Tipo de imagem não permitido. Use JPG, PNG, WEBP ou GIF'
      };
    }

    // Verificar tamanho (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'A imagem deve ter no máximo 5MB'
      };
    }

    return { valid: true };
  }
};

export default imageService;

