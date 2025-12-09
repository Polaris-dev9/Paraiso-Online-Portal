/**
 * Serviço para gerenciamento de pedidos da loja virtual
 * @module services/orderService
 */

import { supabase } from '@/lib/customSupabaseClient';

/**
 * Serviço de pedidos
 */
export const orderService = {
  /**
   * Busca todos os pedidos de um assinante
   * @param {string} subscriberId - ID do assinante
   * @param {string} status - Filtro por status (opcional)
   * @returns {Promise<Array>} Lista de pedidos
   */
  async getOrdersBySubscriberId(subscriberId, status = null) {
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('subscriber_id', subscriberId);

      if (status) {
        query = query.eq('status', status);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw new Error('Erro ao buscar pedidos: ' + error.message);
    }
  },

  /**
   * Busca um pedido por ID
   * @param {string} orderId - ID do pedido
   * @returns {Promise<Object>} Pedido com itens
   */
  async getOrderById(orderId) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw new Error('Erro ao buscar pedido: ' + error.message);
    }
  },

  /**
   * Atualiza o status de um pedido
   * @param {string} orderId - ID do pedido
   * @param {string} status - Novo status
   * @returns {Promise<Object>} Pedido atualizado
   */
  async updateOrderStatus(orderId, status) {
    try {
      const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        throw new Error('Status inválido');
      }

      const { data, error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw new Error('Erro ao atualizar status do pedido: ' + error.message);
    }
  },

  /**
   * Atualiza o status de pagamento de um pedido
   * @param {string} orderId - ID do pedido
   * @param {string} paymentStatus - Novo status de pagamento
   * @returns {Promise<Object>} Pedido atualizado
   */
  async updatePaymentStatus(orderId, paymentStatus) {
    try {
      const validStatuses = ['pending', 'paid', 'failed', 'refunded'];
      if (!validStatuses.includes(paymentStatus)) {
        throw new Error('Status de pagamento inválido');
      }

      const { data, error } = await supabase
        .from('orders')
        .update({ 
          payment_status: paymentStatus,
          updated_at: new Date().toISOString() 
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw new Error('Erro ao atualizar status de pagamento: ' + error.message);
    }
  },

  /**
   * Atualiza múltiplos campos de um pedido
   * @param {string} orderId - ID do pedido
   * @param {Object} updates - Campos a atualizar
   * @returns {Promise<Object>} Pedido atualizado
   */
  async updateOrder(orderId, updates) {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)
        .select(`
          *,
          order_items (*)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating order:', error);
      throw new Error('Erro ao atualizar pedido: ' + error.message);
    }
  },

  /**
   * Obtém estatísticas de pedidos
   * @param {string} subscriberId - ID do assinante
   * @returns {Promise<Object>} Estatísticas
   */
  async getOrderStats(subscriberId) {
    try {
      const orders = await this.getOrdersBySubscriberId(subscriberId);

      const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        confirmed: orders.filter(o => o.status === 'confirmed').length,
        processing: orders.filter(o => o.status === 'processing').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
        totalRevenue: orders
          .filter(o => o.payment_status === 'paid')
          .reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0),
        pendingRevenue: orders
          .filter(o => o.payment_status === 'pending' && o.status !== 'cancelled')
          .reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0)
      };

      return stats;
    } catch (error) {
      console.error('Error getting order stats:', error);
      throw new Error('Erro ao buscar estatísticas: ' + error.message);
    }
  },

  /**
   * Formata o status do pedido para exibição
   * @param {string} status - Status do pedido
   * @returns {Object} Objeto com label e cor
   */
  getStatusLabel(status) {
    const statusMap = {
      'pending': { label: 'Pendente', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
      'confirmed': { label: 'Confirmado', color: 'blue', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
      'processing': { label: 'Em Processamento', color: 'purple', bgColor: 'bg-purple-100', textColor: 'text-purple-800' },
      'shipped': { label: 'Enviado', color: 'indigo', bgColor: 'bg-indigo-100', textColor: 'text-indigo-800' },
      'delivered': { label: 'Entregue', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-800' },
      'cancelled': { label: 'Cancelado', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-800' }
    };

    return statusMap[status] || { label: status, color: 'gray', bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
  },

  /**
   * Formata o status de pagamento para exibição
   * @param {string} paymentStatus - Status de pagamento
   * @returns {Object} Objeto com label e cor
   */
  getPaymentStatusLabel(paymentStatus) {
    const statusMap = {
      'pending': { label: 'Pendente', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
      'paid': { label: 'Pago', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-800' },
      'failed': { label: 'Falhou', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-800' },
      'refunded': { label: 'Reembolsado', color: 'orange', bgColor: 'bg-orange-100', textColor: 'text-orange-800' }
    };

    return statusMap[paymentStatus] || { label: paymentStatus, color: 'gray', bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
  }
};

export default orderService;

