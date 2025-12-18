/**
 * Serviço para gerenciamento de eventos
 * @module services/eventService
 */

import { supabase } from '@/lib/customSupabaseClient';

/**
 * Serviço de eventos
 */
export const eventService = {
  /**
   * Busca todos os eventos
   * @param {Object} filters - Filtros opcionais
   * @param {boolean} filters.publishedOnly - Se true, retorna apenas publicados
   * @param {string} filters.categoryId - Filtrar por categoria
   * @param {string} filters.search - Buscar por título ou descrição
   * @param {Date} filters.startDate - Filtrar por data de início
   * @param {Date} filters.endDate - Filtrar por data de fim
   * @param {number} filters.limit - Limite de resultados
   * @returns {Promise<Array>} Lista de eventos
   */
  async getAllEvents(filters = {}) {
    try {
      let query = supabase
        .from('events')
        .select('*');

      if (filters.publishedOnly) {
        query = query.eq('is_published', true);
      }

      if (filters.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters.startDate) {
        query = query.gte('start_date', filters.startDate.toISOString());
      }

      if (filters.endDate) {
        query = query.lte('end_date', filters.endDate.toISOString());
      }

      // Ordenar por data de início (próximos eventos primeiro)
      query = query.order('start_date', { ascending: true });

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new Error('Erro ao buscar eventos: ' + error.message);
    }
  },

  /**
   * Busca um evento por ID
   * @param {string} eventId - ID do evento
   * @returns {Promise<Object>} Evento
   */
  async getEventById(eventId) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching event by id:', error);
      throw new Error('Erro ao buscar evento: ' + error.message);
    }
  },

  /**
   * Busca um evento por slug
   * @param {string} slug - Slug do evento
   * @returns {Promise<Object|null>} Evento ou null
   */
  async getEventBySlug(slug) {
    try {
      const { data, error } = await supabase
        .from('events')
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
      console.error('Error fetching event by slug:', error);
      throw new Error('Erro ao buscar evento: ' + error.message);
    }
  },

  /**
   * Cria um novo evento
   * @param {Object} eventData - Dados do evento
   * @returns {Promise<Object>} Evento criado
   */
  async createEvent(eventData) {
    try {
      const {
        title,
        description,
        content,
        start_date,
        end_date,
        location,
        image_url,
        banner_url,
        gallery_urls,
        related_links,
        category_id,
        is_featured = false,
        is_published = false
      } = eventData;

      // Validações básicas
      if (!title || title.trim() === '') {
        throw new Error('Título do evento é obrigatório');
      }
      if (!start_date) {
        throw new Error('Data de início do evento é obrigatória');
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
        .from('events')
        .select('id')
        .eq('slug', finalSlug)
        .maybeSingle();

      if (existing) {
        finalSlug = `${slug}-${Date.now()}`;
      }

      const { data, error } = await supabase
        .from('events')
        .insert({
          title: title.trim(),
          slug: finalSlug,
          description: description.trim(),
          content: content || null,
          start_date: start_date,
          end_date: end_date || null,
          location: location || null,
          image_url: image_url || null,
          banner_url: banner_url || null,
          gallery_urls: gallery_urls || [],
          related_links: related_links || [],
          category_id: category_id || null,
          is_featured: Boolean(is_featured),
          is_published: Boolean(is_published)
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw new Error(error.message || 'Erro ao criar evento');
    }
  },

  /**
   * Atualiza um evento existente
   * @param {string} eventId - ID do evento
   * @param {Object} updates - Campos a atualizar
   * @returns {Promise<Object>} Evento atualizado
   */
  async updateEvent(eventId, updates) {
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

          // Verificar se slug já existe (exceto para este evento)
          const { data: existing } = await supabase
            .from('events')
            .select('id')
            .eq('slug', slug)
            .neq('id', eventId)
            .maybeSingle();

          updateData.slug = existing ? `${slug}-${Date.now()}` : slug;
        }
      }

      if (updates.description !== undefined) {
        updateData.description = updates.description.trim();
      }

      if (updates.content !== undefined) {
        updateData.content = updates.content;
      }

      if (updates.start_date !== undefined) {
        updateData.start_date = updates.start_date;
      }

      if (updates.end_date !== undefined) {
        updateData.end_date = updates.end_date || null;
      }

      if (updates.location !== undefined) {
        updateData.location = updates.location || null;
      }

      if (updates.image_url !== undefined) {
        updateData.image_url = updates.image_url || null;
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

      if (updates.category_id !== undefined) {
        updateData.category_id = updates.category_id || null;
      }

      if (updates.is_featured !== undefined) {
        updateData.is_featured = Boolean(updates.is_featured);
      }

      if (updates.is_published !== undefined) {
        updateData.is_published = Boolean(updates.is_published);
      }

      updateData.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', eventId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw new Error(error.message || 'Erro ao atualizar evento');
    }
  },

  /**
   * Deleta um evento
   * @param {string} eventId - ID do evento
   * @returns {Promise<boolean>} true se deletado com sucesso
   */
  async deleteEvent(eventId) {
    try {
      // Buscar evento para deletar imagem se existir
      const event = await this.getEventById(eventId);
      
      // Deletar imagem do storage se existir
      if (event?.image_url) {
        try {
          // Extrair path da URL se for do Supabase Storage
          const urlParts = event.image_url.split('/');
          const pathIndex = urlParts.findIndex(part => part === 'storage');
          if (pathIndex !== -1 && pathIndex < urlParts.length - 1) {
            const path = urlParts.slice(pathIndex + 2).join('/');
            const { error: deleteError } = await supabase.storage
              .from('subscriber-images')
              .remove([path]);
            
            if (deleteError) {
              console.warn('Error deleting event image:', deleteError);
            }
          }
        } catch (imageError) {
          console.warn('Error deleting event image:', imageError);
        }
      }

      // Deletar o evento
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw new Error(error.message || 'Erro ao deletar evento');
    }
  },

  /**
   * Publica um evento
   * @param {string} eventId - ID do evento
   * @returns {Promise<Object>} Evento atualizado
   */
  async publishEvent(eventId) {
    try {
      return await this.updateEvent(eventId, {
        is_published: true
      });
    } catch (error) {
      console.error('Error publishing event:', error);
      throw new Error('Erro ao publicar evento: ' + error.message);
    }
  },

  /**
   * Despublica um evento
   * @param {string} eventId - ID do evento
   * @returns {Promise<Object>} Evento atualizado
   */
  async unpublishEvent(eventId) {
    try {
      return await this.updateEvent(eventId, {
        is_published: false
      });
    } catch (error) {
      console.error('Error unpublishing event:', error);
      throw new Error('Erro ao despublicar evento: ' + error.message);
    }
  }
};

export default eventService;

