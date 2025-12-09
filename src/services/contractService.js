/**
 * Serviço para gerenciamento de contratos
 * @module services/contractService
 */

import { supabase } from '@/lib/customSupabaseClient';

/**
 * Serviço de contratos
 */
export const contractService = {
  /**
   * Busca contratos de um assinante
   * @param {string} subscriberId - ID do assinante
   * @returns {Promise<Array>} Lista de contratos
   */
  async getContractsBySubscriberId(subscriberId) {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('subscriber_id', subscriberId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching contracts:', error);
      throw new Error('Erro ao buscar contratos: ' + error.message);
    }
  },

  /**
   * Busca o contrato ativo de um assinante
   * @param {string} subscriberId - ID do assinante
   * @returns {Promise<Object|null>} Contrato ativo ou null
   */
  async getActiveContract(subscriberId) {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('subscriber_id', subscriberId)
        .in('payment_status', ['paid', 'pending'])
        .gte('end_date', new Date().toISOString().split('T')[0])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      console.error('Error fetching active contract:', error);
      return null;
    }
  },

  /**
   * Cria um novo contrato
   * @param {string} subscriberId - ID do assinante
   * @param {Object} contractData - Dados do contrato
   * @returns {Promise<Object>} Contrato criado
   */
  async createContract(subscriberId, contractData) {
    try {
      const startDate = contractData.start_date || new Date();
      let endDate = new Date(startDate);

      // Calcular data de término baseado no billing_cycle
      if (contractData.billing_cycle === 'annual') {
        endDate.setFullYear(endDate.getFullYear() + 1);
      } else {
        // Mensal por padrão
        endDate.setMonth(endDate.getMonth() + 1);
      }

      const insertData = {
        subscriber_id: subscriberId,
        plan_type: contractData.plan_type || 'gratuito',
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        amount: contractData.amount || null,
        billing_cycle: contractData.billing_cycle || 'monthly',
        payment_status: contractData.payment_status || 'pending',
        auto_renew: contractData.auto_renew || false
      };

      const { data, error } = await supabase
        .from('contracts')
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;

      // Atualizar subscriber com informações do contrato
      await supabase
        .from('subscribers')
        .update({
          plan_type: insertData.plan_type,
          contract_start_date: insertData.start_date,
          contract_end_date: insertData.end_date,
          payment_status: insertData.payment_status === 'paid' ? 'paid' : 'pending'
        })
        .eq('id', subscriberId);

      return data;
    } catch (error) {
      console.error('Error creating contract:', error);
      throw new Error('Erro ao criar contrato: ' + error.message);
    }
  },

  /**
   * Renova um contrato
   * @param {string} contractId - ID do contrato a renovar
   * @returns {Promise<Object>} Novo contrato criado
   */
  async renewContract(contractId) {
    try {
      // Buscar contrato atual
      const { data: currentContract, error: fetchError } = await supabase
        .from('contracts')
        .select('*')
        .eq('id', contractId)
        .single();

      if (fetchError || !currentContract) {
        throw new Error('Contrato não encontrado');
      }

      // Criar novo contrato com base no anterior
      const newStartDate = new Date(currentContract.end_date);
      newStartDate.setDate(newStartDate.getDate() + 1); // Começar no dia seguinte ao término

      return await this.createContract(currentContract.subscriber_id, {
        plan_type: currentContract.plan_type,
        start_date: newStartDate,
        billing_cycle: currentContract.billing_cycle,
        amount: currentContract.amount,
        payment_status: 'pending',
        auto_renew: currentContract.auto_renew
      });
    } catch (error) {
      console.error('Error renewing contract:', error);
      throw new Error('Erro ao renovar contrato: ' + error.message);
    }
  },

  /**
   * Atualiza status de pagamento do contrato
   * @param {string} contractId - ID do contrato
   * @param {string} status - Novo status ('paid', 'pending', 'expired', 'cancelled')
   * @returns {Promise<Object>} Contrato atualizado
   */
  async updatePaymentStatus(contractId, status) {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .update({ 
          payment_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', contractId)
        .select()
        .single();

      if (error) throw error;

      // Se pagamento aprovado, restaurar acesso do assinante
      if (status === 'paid' && data.subscriber_id) {
        await supabase
          .from('subscribers')
          .update({
            status: true,
            payment_status: 'paid'
          })
          .eq('id', data.subscriber_id);
      }

      return data;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw new Error('Erro ao atualizar status de pagamento: ' + error.message);
    }
  },

  /**
   * Verifica se contrato está expirado
   * @param {Object} contract - Contrato a verificar
   * @returns {boolean} true se expirado
   */
  isContractExpired(contract) {
    if (!contract || !contract.end_date) return false;
    const endDate = new Date(contract.end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return endDate < today;
  },

  /**
   * Verifica se contrato está próximo do vencimento (10 dias)
   * @param {Object} contract - Contrato a verificar
   * @returns {boolean} true se próximo do vencimento
   */
  isContractExpiringSoon(contract) {
    if (!contract || !contract.end_date) return false;
    const endDate = new Date(contract.end_date);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 10 && daysUntilExpiry >= 0;
  },

  /**
   * Calcula dias até vencimento
   * @param {Object} contract - Contrato
   * @returns {number} Dias até vencimento (negativo se já expirado)
   */
  getDaysUntilExpiry(contract) {
    if (!contract || !contract.end_date) return null;
    const endDate = new Date(contract.end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
  }
};

export default contractService;

