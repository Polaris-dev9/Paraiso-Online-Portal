/**
 * Serviço para gerenciamento de assinantes
 * @module services/subscriberService
 */

import { supabase } from '@/lib/customSupabaseClient';

/**
 * Serviço de assinantes
 */
export const subscriberService = {
  /**
   * Cria um novo assinante
   * @param {Object} subscriberData - Dados do assinante
   * @returns {Promise<Object>} Assinante criado
   */
  async createSubscriber(subscriberData) {
    try {
      const email = (subscriberData.email || subscriberData.user_email || '').trim().toLowerCase();
      
      // Verificar se já existe assinante com esse email
      if (email) {
        const { data: existingSubscriber, error: checkError } = await supabase
          .from('subscribers')
          .select('id, email, status, name')
          .ilike('email', email)
          .maybeSingle();

        // Se erro na verificação, apenas logar e continuar (não bloquear)
        if (checkError && checkError.code !== 'PGRST116') {
          console.warn('Error checking existing email:', checkError);
        }

        // Se existe, lançar erro amigável
        if (existingSubscriber) {
          throw new Error(`Já existe um cadastro com o email "${email}". Por favor, use outro email ou faça login para atualizar seus dados.`);
        }
      }

      // Gerar slug se não fornecido
      let slug = subscriberData.slug;
      if (!slug && subscriberData.name) {
        slug = subscriberData.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }

      // Garantir slug único
      if (slug) {
        const { data: existing } = await supabase
          .from('subscribers')
          .select('id')
          .eq('slug', slug)
          .maybeSingle();

        if (existing) {
          slug = `${slug}-${Date.now()}`;
        }
      }

      const insertData = {
        user_id: subscriberData.user_id || null,
        name: subscriberData.name,
        email: email.trim().toLowerCase(), // Normalizar email
        phone: subscriberData.phone || null,
        cpf_cnpj: subscriberData.cpf_cnpj || null,
        profile_type: subscriberData.profile_type || 'empresarial',
        plan_type: subscriberData.plan_type || 'gratuito',
        payment_status: subscriberData.payment_status || 'pending',
        contract_start_date: subscriberData.contract_start_date || null,
        contract_end_date: subscriberData.contract_end_date || null,
        status: subscriberData.status !== undefined ? subscriberData.status : true,
        address: subscriberData.address || {},
        social_links: subscriberData.social_links || {},
        description: subscriberData.description || null,
        specialties: subscriberData.specialties || [],
        business_hours: subscriberData.business_hours || {},
        banner_image_url: subscriberData.banner_image_url || null,
        profile_image_url: subscriberData.profile_image_url || null,
        slug: slug
      };

      const { data, error } = await supabase
        .from('subscribers')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        // Tratar erros específicos
        if (error.code === '23505') {
          // Erro de constraint unique
          if (error.message && error.message.includes('subscribers_email_key')) {
            throw new Error(`Já existe um cadastro com o email "${email}". Por favor, use outro email.`);
          } else if (error.message && error.message.includes('subscribers_slug_key')) {
            throw new Error(`Já existe um cadastro com este nome/slug. Tente um nome diferente.`);
          }
        }
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error creating subscriber:', error);
      
      // Se já é uma mensagem amigável, passar direto
      if (error.message && !error.message.includes('duplicate key') && !error.message.includes('23505')) {
        throw error;
      }
      
      // Melhorar mensagens de erro comuns
      if (error.message && error.message.includes('duplicate key')) {
        if (error.message.includes('subscribers_email_key')) {
          throw new Error(`Já existe um cadastro com o email "${subscriberData.email || subscriberData.user_email}". Por favor, use outro email.`);
        } else if (error.message.includes('subscribers_slug_key')) {
          throw new Error(`Já existe um cadastro com este nome. Tente um nome diferente.`);
        }
      }
      
      throw new Error('Erro ao criar assinante: ' + error.message);
    }
  },

  /**
   * Busca assinante por user_id
   * @param {string} userId - ID do usuário (auth.users.id)
   * @returns {Promise<Object|null>} Assinante encontrado ou null
   */
  async getSubscriberByUserId(userId) {
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle(); // Usa maybeSingle para evitar erro 406 quando não encontra

      if (error) {
        // PGRST116 = no rows returned (não é um erro real, apenas não encontrou)
        if (error.code === 'PGRST116') {
          return null;
        }
        console.error('Error fetching subscriber by user_id:', error);
        throw error;
      }
      return data || null;
    } catch (error) {
      console.error('Error fetching subscriber by user_id:', error);
      // Se for erro 406, significa que não encontrou - retornar null
      if (error.code === 'PGRST116' || error.message?.includes('Cannot coerce')) {
        return null;
      }
      throw new Error('Erro ao buscar assinante: ' + error.message);
    }
  },

  /**
   * Busca assinante por slug
   * @param {string} slug - Slug do assinante
   * @returns {Promise<Object|null>} Assinante encontrado ou null
   */
  async getSubscriberBySlug(slug) {
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .eq('slug', slug)
        .eq('status', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error fetching subscriber by slug:', error);
      throw new Error('Erro ao buscar assinante: ' + error.message);
    }
  },

  /**
   * Busca assinante por ID
   * @param {string} id - ID do assinante
   * @returns {Promise<Object|null>} Assinante encontrado
   */
  async getSubscriberById(id) {
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching subscriber by id:', error);
      throw new Error('Erro ao buscar assinante: ' + error.message);
    }
  },

  /**
   * Atualiza um assinante
   * @param {string} id - ID do assinante
   * @param {Object} updates - Dados para atualizar
   * @returns {Promise<Object>} Assinante atualizado
   */
  async updateSubscriber(id, updates) {
    try {
      // Se atualizando nome, atualizar slug também se não fornecido
      if (updates.name && !updates.slug) {
        updates.slug = updates.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }

      const { data, error } = await supabase
        .from('subscribers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating subscriber:', error);
      throw new Error('Erro ao atualizar assinante: ' + error.message);
    }
  },

  /**
   * Lista todos os assinantes (com filtros opcionais)
   * @param {Object} filters - Filtros opcionais
   * @returns {Promise<Array>} Lista de assinantes
   */
  async getAllSubscribers(filters = {}) {
    try {
      let query = supabase
        .from('subscribers')
        .select('*');

      if (filters.plan_type) {
        query = query.eq('plan_type', filters.plan_type);
      }

      if (filters.profile_type) {
        query = query.eq('profile_type', filters.profile_type);
      }

      if (filters.status !== undefined) {
        query = query.eq('status', filters.status);
      }

      if (filters.payment_status) {
        query = query.eq('payment_status', filters.payment_status);
      }

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      query = query.order('created_at', { ascending: false });

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching all subscribers:', error);
      throw new Error('Erro ao buscar assinantes: ' + error.message);
    }
  },

  /**
   * Incrementa contador de visualizações
   * @param {string} id - ID do assinante
   * @returns {Promise<void>}
   */
  async incrementViews(id) {
    try {
      const { error } = await supabase.rpc('increment_subscriber_views', {
        subscriber_id: id
      });

      // Se a função não existir, fazer update manual
      if (error && error.message.includes('function')) {
        const { data: subscriber } = await this.getSubscriberById(id);
        await this.updateSubscriber(id, {
          views_count: (subscriber?.views_count || 0) + 1
        });
        return;
      }

      if (error) throw error;
    } catch (error) {
      console.error('Error incrementing views:', error);
      // Não lançar erro, apenas logar (não é crítico)
    }
  },

  /**
   * Desativa um assinante (soft delete)
   * @param {string} id - ID do assinante
   * @returns {Promise<void>}
   */
  async deactivateSubscriber(id) {
    try {
      const { error } = await supabase
        .from('subscribers')
        .update({ status: false })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deactivating subscriber:', error);
      throw new Error('Erro ao desativar assinante: ' + error.message);
    }
  },

  /**
   * Ativa um assinante
   * @param {string} id - ID do assinante
   * @returns {Promise<void>}
   */
  async activateSubscriber(id) {
    try {
      const { error } = await supabase
        .from('subscribers')
        .update({ status: true })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error activating subscriber:', error);
      throw new Error('Erro ao ativar assinante: ' + error.message);
    }
  }
};

export default subscriberService;

