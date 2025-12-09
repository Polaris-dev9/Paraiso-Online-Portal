import { supabase } from '@/lib/customSupabaseClient';

const storeSettingsService = {
    /**
     * Busca as configurações da loja de um assinante
     * @param {string} subscriberId - ID do assinante
     * @returns {Promise<Object|null>} Configurações da loja ou null se não encontrado
     */
    async getStoreSettings(subscriberId) {
        try {
            const { data, error } = await supabase
                .from('store_settings')
                .select('*')
                .eq('subscriber_id', subscriberId)
                .maybeSingle(); // Usa maybeSingle() em vez de single() - retorna null se não encontrar

            if (error) {
                throw error;
            }
            return data;
        } catch (error) {
            console.error('Error fetching store settings:', error);
            // Se o erro for "não encontrado", retorna null em vez de lançar erro
            if (error.code === 'PGRST116') {
                return null;
            }
            throw new Error('Erro ao buscar configurações da loja: ' + error.message);
        }
    },

    /**
     * Cria ou atualiza as configurações da loja
     * @param {string} subscriberId - ID do assinante
     * @param {Object} settings - Objeto com as configurações
     * @returns {Promise<Object>} Configurações salvas
     */
    async saveStoreSettings(subscriberId, settings) {
        try {
            // Verificar se já existe configuração
            const existing = await this.getStoreSettings(subscriberId);

            if (existing) {
                // Atualizar
                const { data, error } = await supabase
                    .from('store_settings')
                    .update({
                        ...settings,
                        updated_at: new Date().toISOString()
                    })
                    .eq('subscriber_id', subscriberId)
                    .select()
                    .single();

                if (error) throw error;
                return data;
            } else {
                // Criar novo
                const { data, error } = await supabase
                    .from('store_settings')
                    .insert([{
                        subscriber_id: subscriberId,
                        ...settings
                    }])
                    .select()
                    .single();

                if (error) throw error;
                return data;
            }
        } catch (error) {
            console.error('Error saving store settings:', error);
            throw new Error('Erro ao salvar configurações da loja: ' + error.message);
        }
    },

    /**
     * Deleta as configurações da loja
     * @param {string} subscriberId - ID do assinante
     * @returns {Promise<void>}
     */
    async deleteStoreSettings(subscriberId) {
        try {
            const { error } = await supabase
                .from('store_settings')
                .delete()
                .eq('subscriber_id', subscriberId);

            if (error) throw error;
        } catch (error) {
            console.error('Error deleting store settings:', error);
            throw new Error('Erro ao deletar configurações da loja: ' + error.message);
        }
    }
};

export default storeSettingsService;

