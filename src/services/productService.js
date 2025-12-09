/**
 * Serviço para gerenciamento de produtos da loja virtual
 * @module services/productService
 */

import { supabase } from '@/lib/customSupabaseClient';

/**
 * Serviço de produtos
 */
export const productService = {
  /**
   * Busca todos os produtos de um assinante
   * @param {string} subscriberId - ID do assinante
   * @param {boolean} activeOnly - Se true, retorna apenas produtos ativos
   * @returns {Promise<Array>} Lista de produtos
   */
  async getProductsBySubscriberId(subscriberId, activeOnly = false) {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('subscriber_id', subscriberId);

      if (activeOnly) {
        query = query.eq('is_active', true);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Erro ao buscar produtos: ' + error.message);
    }
  },

  /**
   * Busca um produto por ID
   * @param {string} productId - ID do produto
   * @returns {Promise<Object>} Produto
   */
  async getProductById(productId) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw new Error('Erro ao buscar produto: ' + error.message);
    }
  },

  /**
   * Busca produtos públicos de um assinante (para página pública da loja)
   * @param {string} subscriberId - ID do assinante
   * @returns {Promise<Array>} Lista de produtos ativos
   */
  async getPublicProducts(subscriberId) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('subscriber_id', subscriberId)
        .eq('is_active', true)
        .order('is_promotion', { ascending: false }) // Promoções primeiro
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching public products:', error);
      throw new Error('Erro ao buscar produtos: ' + error.message);
    }
  },

  /**
   * Cria um novo produto
   * @param {Object} productData - Dados do produto
   * @returns {Promise<Object>} Produto criado
   */
  async createProduct(productData) {
    try {
      const {
        subscriber_id,
        name,
        description,
        price,
        image_url,
        image_path,
        is_promotion = false,
        is_active = true,
        stock_quantity = null,
        category = null,
        sku = null,
        weight = null,
        dimensions = {},
        tags = []
      } = productData;

      // Validações básicas
      if (!subscriber_id) {
        throw new Error('ID do assinante é obrigatório');
      }
      if (!name || name.trim() === '') {
        throw new Error('Nome do produto é obrigatório');
      }
      if (price === null || price === undefined || price < 0) {
        throw new Error('Preço válido é obrigatório');
      }

      const { data, error } = await supabase
        .from('products')
        .insert({
          subscriber_id,
          name: name.trim(),
          description: description || null,
          price: parseFloat(price),
          image_url: image_url || null,
          image_path: image_path || null,
          is_promotion: Boolean(is_promotion),
          is_active: Boolean(is_active),
          stock_quantity: stock_quantity !== null && stock_quantity !== undefined ? parseInt(stock_quantity) : null,
          category: category || null,
          sku: sku || null,
          weight: weight !== null && weight !== undefined ? parseFloat(weight) : null,
          dimensions: dimensions || {},
          tags: Array.isArray(tags) ? tags : []
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error(error.message || 'Erro ao criar produto');
    }
  },

  /**
   * Atualiza um produto existente
   * @param {string} productId - ID do produto
   * @param {Object} updates - Campos a atualizar
   * @returns {Promise<Object>} Produto atualizado
   */
  async updateProduct(productId, updates) {
    try {
      const updateData = {};

      // Aplicar apenas campos fornecidos
      if (updates.name !== undefined) updateData.name = updates.name.trim();
      if (updates.description !== undefined) updateData.description = updates.description || null;
      if (updates.price !== undefined) updateData.price = parseFloat(updates.price);
      if (updates.image_url !== undefined) updateData.image_url = updates.image_url || null;
      if (updates.image_path !== undefined) updateData.image_path = updates.image_path || null;
      if (updates.is_promotion !== undefined) updateData.is_promotion = Boolean(updates.is_promotion);
      if (updates.is_active !== undefined) updateData.is_active = Boolean(updates.is_active);
      if (updates.stock_quantity !== undefined) {
        updateData.stock_quantity = updates.stock_quantity !== null && updates.stock_quantity !== undefined 
          ? parseInt(updates.stock_quantity) 
          : null;
      }
      if (updates.category !== undefined) updateData.category = updates.category || null;
      if (updates.sku !== undefined) updateData.sku = updates.sku || null;
      if (updates.weight !== undefined) {
        updateData.weight = updates.weight !== null && updates.weight !== undefined 
          ? parseFloat(updates.weight) 
          : null;
      }
      if (updates.dimensions !== undefined) updateData.dimensions = updates.dimensions || {};
      if (updates.tags !== undefined) updateData.tags = Array.isArray(updates.tags) ? updates.tags : [];

      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', productId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error(error.message || 'Erro ao atualizar produto');
    }
  },

  /**
   * Deleta um produto
   * @param {string} productId - ID do produto
   * @returns {Promise<boolean>} true se deletado com sucesso
   */
  async deleteProduct(productId) {
    try {
      // Primeiro, buscar o produto para obter image_path
      const product = await this.getProductById(productId);
      
      // Deletar imagem do storage se existir
      if (product?.image_path) {
        try {
          const { error: deleteError } = await supabase.storage
            .from('subscriber-images')
            .remove([product.image_path]);
          
          if (deleteError) {
            console.warn('Error deleting product image:', deleteError);
            // Não bloquear a exclusão do produto se falhar deletar a imagem
          }
        } catch (imageError) {
          console.warn('Error deleting product image:', imageError);
        }
      }

      // Deletar o produto
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error(error.message || 'Erro ao deletar produto');
    }
  },

  /**
   * Verifica o limite de produtos permitido pelo plano
   * @param {string} planType - Tipo de plano ('gratuito', 'essencial', 'premium', 'premium_vip')
   * @returns {number} Limite de produtos
   */
  getProductLimit(planType) {
    const limits = {
      'gratuito': 3,
      'essencial': 10,
      'premium': 50,
      'premium_vip': 300
    };
    return limits[planType] || 0;
  },

  /**
   * Verifica se o assinante pode adicionar mais produtos
   * @param {string} subscriberId - ID do assinante
   * @param {string} planType - Tipo de plano
   * @returns {Promise<{canAdd: boolean, currentCount: number, limit: number}>}
   */
  async canAddProduct(subscriberId, planType) {
    try {
      const products = await this.getProductsBySubscriberId(subscriberId, false);
      const limit = this.getProductLimit(planType);
      const currentCount = products.length;

      return {
        canAdd: currentCount < limit,
        currentCount,
        limit
      };
    } catch (error) {
      console.error('Error checking product limit:', error);
      throw new Error('Erro ao verificar limite de produtos');
    }
  },

  /**
   * Cria um pedido (para funcionalidade futura)
   * @param {Object} orderData - Dados do pedido
   * @returns {Promise<Object>} Pedido criado
   */
  async createOrder(orderData) {
    try {
      const {
        subscriber_id,
        customer_name,
        customer_email,
        customer_phone,
        customer_address,
        items, // Array de {product_id, quantity}
        payment_method,
        notes
      } = orderData;

      // Calcular total
      let totalAmount = 0;
      const orderItems = [];

      for (const item of items) {
        const product = await this.getProductById(item.product_id);
        if (!product || !product.is_active) {
          throw new Error(`Produto ${item.product_id} não encontrado ou inativo`);
        }

        const subtotal = product.price * item.quantity;
        totalAmount += subtotal;

        orderItems.push({
          product_id: item.product_id,
          product_name: product.name,
          product_price: product.price,
          quantity: item.quantity,
          subtotal: subtotal
        });
      }

      // Criar pedido
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          subscriber_id,
          customer_name,
          customer_email,
          customer_phone: customer_phone || null,
          customer_address: customer_address || {},
          total_amount: totalAmount,
          payment_method: payment_method || null,
          notes: notes || null,
          status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Criar itens do pedido
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(
          orderItems.map(item => ({
            order_id: order.id,
            ...item
          }))
        );

      if (itemsError) throw itemsError;

      // Buscar pedido completo
      const { data: fullOrder, error: fetchError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('id', order.id)
        .single();

      if (fetchError) throw fetchError;

      return fullOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error(error.message || 'Erro ao criar pedido');
    }
  },

  /**
   * Busca pedidos de um assinante
   * @param {string} subscriberId - ID do assinante
   * @returns {Promise<Array>} Lista de pedidos
   */
  async getOrdersBySubscriberId(subscriberId) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('subscriber_id', subscriberId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw new Error('Erro ao buscar pedidos: ' + error.message);
    }
  }
};

export default productService;

