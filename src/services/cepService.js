/**
 * Serviço de integração com ViaCEP para busca de endereços
 * @module services/cepService
 */

/**
 * Busca informações de endereço a partir de um CEP
 * @param {string} cep - CEP a ser consultado (com ou sem formatação)
 * @returns {Promise<Object>} Objeto com informações do endereço
 * @throws {Error} Erro caso CEP seja inválido ou não encontrado
 */
export const cepService = {
  async getAddressByCep(cep) {
    // Remove formatação do CEP (mantém apenas números)
    const cleanCep = cep.replace(/\D/g, '');
    
    // Validação básica
    if (cleanCep.length !== 8) {
      throw new Error('CEP deve conter 8 dígitos');
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      
      if (!response.ok) {
        throw new Error('Erro ao consultar CEP');
      }

      const data = await response.json();

      // ViaCEP retorna erro quando não encontra
      if (data.erro) {
        throw new Error('CEP não encontrado');
      }

      return {
        cep: data.cep || cleanCep,
        street: data.logradouro || '',
        neighborhood: data.bairro || '',
        city: data.localidade || '',
        state: data.uf || '',
        complement: data.complemento || '',
        ibge: data.ibge || '',
        gia: data.gia || '',
        ddd: data.ddd || '',
        siafi: data.siafi || ''
      };
    } catch (error) {
      // Se for erro de rede, lança erro mais amigável
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
      }
      
      // Re-lança erros conhecidos
      if (error.message.includes('CEP') || error.message.includes('endereço')) {
        throw error;
      }
      
      // Erro genérico
      throw new Error('Erro ao buscar CEP: ' + error.message);
    }
  },

  /**
   * Formata CEP para exibição (00000-000)
   * @param {string} cep - CEP sem formatação
   * @returns {string} CEP formatado
   */
  formatCep(cep) {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return cep;
    return cleanCep.replace(/(\d{5})(\d{3})/, '$1-$2');
  },

  /**
   * Valida se CEP tem formato válido
   * @param {string} cep - CEP a ser validado
   * @returns {boolean} True se válido
   */
  isValidCep(cep) {
    const cleanCep = cep.replace(/\D/g, '');
    return cleanCep.length === 8 && /^\d+$/.test(cleanCep);
  }
};

export default cepService;

