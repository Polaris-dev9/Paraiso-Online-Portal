/**
 * Serviço para gerenciamento de notícias
 * @module services/newsService
 */

import { supabase } from '@/lib/customSupabaseClient';

/**
 * Serviço de notícias
 */
export const newsService = {
  /**
   * Busca todas as notícias
   * @param {Object} filters - Filtros opcionais
   * @param {boolean} filters.publishedOnly - Se true, retorna apenas publicadas
   * @param {string} filters.categoryId - Filtrar por categoria
   * @param {string} filters.search - Buscar por título ou conteúdo
   * @param {number} filters.limit - Limite de resultados
   * @returns {Promise<Array>} Lista de notícias
   */
  async getAllNews(filters = {}) {
    try {
      let query = supabase
        .from('news')
        .select('*');

      if (filters.publishedOnly) {
        query = query.eq('is_published', true);
      }

      if (filters.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
      }

      query = query.order('published_at', { ascending: false, nullsLast: true })
                   .order('created_at', { ascending: false });

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching news:', error);
      throw new Error('Erro ao buscar notícias: ' + error.message);
    }
  },

  /**
   * Busca uma notícia por ID
   * @param {string} newsId - ID da notícia
   * @returns {Promise<Object>} Notícia
   */
  async getNewsById(newsId) {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', newsId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching news by id:', error);
      throw new Error('Erro ao buscar notícia: ' + error.message);
    }
  },

  /**
   * Busca uma notícia por slug
   * @param {string} slug - Slug da notícia
   * @returns {Promise<Object|null>} Notícia ou null
   */
  async getNewsBySlug(slug) {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error fetching news by slug:', error);
      throw new Error('Erro ao buscar notícia: ' + error.message);
    }
  },

  /**
   * Cria uma nova notícia
   * @param {Object} newsData - Dados da notícia
   * @returns {Promise<Object>} Notícia criada
   */
  async createNews(newsData) {
    try {
      const {
        title,
        content,
        excerpt,
        featured_image_url,
        banner_url,
        gallery_urls,
        related_links,
        author_id,
        category_id,
        is_published = false,
        published_at = null
      } = newsData;

      // Validações básicas
      if (!title || title.trim() === '') {
        throw new Error('Título da notícia é obrigatório');
      }
      if (!content || content.trim() === '') {
        throw new Error('Conteúdo da notícia é obrigatório');
      }

      // Gerar slug a partir do título
      const slug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Garantir slug único
      let finalSlug = slug;
      const { data: existing } = await supabase
        .from('news')
        .select('id')
        .eq('slug', finalSlug)
        .maybeSingle();

      if (existing) {
        finalSlug = `${slug}-${Date.now()}`;
      }

      // Se está publicada e não tem data de publicação, usar agora
      const publishDate = is_published && !published_at 
        ? new Date().toISOString() 
        : published_at;

      const { data, error } = await supabase
        .from('news')
        .insert({
          title: title.trim(),
          slug: finalSlug,
          content: content.trim(),
          excerpt: excerpt || null,
          featured_image_url: featured_image_url || null,
          banner_url: banner_url || null,
          gallery_urls: gallery_urls || [],
          related_links: related_links || [],
          author_id: author_id || null,
          category_id: category_id || null,
          is_published: Boolean(is_published),
          published_at: publishDate,
          views_count: 0
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating news:', error);
      throw new Error(error.message || 'Erro ao criar notícia');
    }
  },

  /**
   * Atualiza uma notícia existente
   * @param {string} newsId - ID da notícia
   * @param {Object} updates - Campos a atualizar
   * @returns {Promise<Object>} Notícia atualizada
   */
  async updateNews(newsId, updates) {
    try {
      const updateData = {};

      if (updates.title !== undefined) {
        updateData.title = updates.title.trim();
        
        // Se título mudou, atualizar slug também
        if (updates.title) {
          const slug = updates.title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

          // Verificar se slug já existe (exceto para esta notícia)
          const { data: existing } = await supabase
            .from('news')
            .select('id')
            .eq('slug', slug)
            .neq('id', newsId)
            .maybeSingle();

          updateData.slug = existing ? `${slug}-${Date.now()}` : slug;
        }
      }

      if (updates.content !== undefined) {
        updateData.content = updates.content.trim();
      }

      if (updates.excerpt !== undefined) {
        updateData.excerpt = updates.excerpt || null;
      }

      if (updates.featured_image_url !== undefined) {
        updateData.featured_image_url = updates.featured_image_url || null;
      }

      if (updates.banner_url !== undefined) {
        updateData.banner_url = updates.banner_url || null;
      }

      if (updates.gallery_urls !== undefined) {
        updateData.gallery_urls = updates.gallery_urls || [];
      }

      if (updates.related_links !== undefined) {
        updateData.related_links = updates.related_links || [];
      }

      if (updates.author_id !== undefined) {
        updateData.author_id = updates.author_id || null;
      }

      if (updates.category_id !== undefined) {
        updateData.category_id = updates.category_id || null;
      }

      if (updates.is_published !== undefined) {
        updateData.is_published = Boolean(updates.is_published);
        
        // Se está sendo publicada agora e não tem published_at, definir
        if (updates.is_published && !updates.published_at) {
          const { data: currentNews } = await this.getNewsById(newsId);
          if (!currentNews.published_at) {
            updateData.published_at = new Date().toISOString();
          }
        }
      }

      if (updates.published_at !== undefined) {
        updateData.published_at = updates.published_at || null;
      }

      updateData.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('news')
        .update(updateData)
        .eq('id', newsId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating news:', error);
      throw new Error(error.message || 'Erro ao atualizar notícia');
    }
  },

  /**
   * Deleta uma notícia
   * @param {string} newsId - ID da notícia
   * @returns {Promise<boolean>} true se deletado com sucesso
   */
  async deleteNews(newsId) {
    try {
      // Buscar notícia para deletar imagem se existir
      const news = await this.getNewsById(newsId);
      
      // Deletar imagem do storage se existir
      if (news?.featured_image_url) {
        try {
          // Extrair path da URL se for do Supabase Storage
          const urlParts = news.featured_image_url.split('/');
          const pathIndex = urlParts.findIndex(part => part === 'storage');
          if (pathIndex !== -1 && pathIndex < urlParts.length - 1) {
            const path = urlParts.slice(pathIndex + 2).join('/');
            const { error: deleteError } = await supabase.storage
              .from('subscriber-images')
              .remove([path]);
            
            if (deleteError) {
              console.warn('Error deleting news image:', deleteError);
            }
          }
        } catch (imageError) {
          console.warn('Error deleting news image:', imageError);
        }
      }

      // Deletar a notícia
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', newsId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting news:', error);
      throw new Error(error.message || 'Erro ao deletar notícia');
    }
  },

  /**
   * Incrementa contador de visualizações
   * @param {string} newsId - ID da notícia
   * @returns {Promise<void>}
   */
  async incrementViews(newsId) {
    try {
      const { data: news } = await this.getNewsById(newsId);
      if (news) {
        await this.updateNews(newsId, {
          views_count: (news.views_count || 0) + 1
        });
      }
    } catch (error) {
      console.error('Error incrementing news views:', error);
      // Não lançar erro, apenas logar (não é crítico)
    }
  },

  /**
   * Publica uma notícia
   * @param {string} newsId - ID da notícia
   * @returns {Promise<Object>} Notícia atualizada
   */
  async publishNews(newsId) {
    try {
      const { data: news } = await this.getNewsById(newsId);
      return await this.updateNews(newsId, {
        is_published: true,
        published_at: news.published_at || new Date().toISOString()
      });
    } catch (error) {
      console.error('Error publishing news:', error);
      throw new Error('Erro ao publicar notícia: ' + error.message);
    }
  },

  /**
   * Despublica uma notícia
   * @param {string} newsId - ID da notícia
   * @returns {Promise<Object>} Notícia atualizada
   */
  async unpublishNews(newsId) {
    try {
      return await this.updateNews(newsId, {
        is_published: false
      });
    } catch (error) {
      console.error('Error unpublishing news:', error);
      throw new Error('Erro ao despublicar notícia: ' + error.message);
    }
  }
};

export default newsService;

