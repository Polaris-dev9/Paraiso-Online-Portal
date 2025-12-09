/**
 * Serviço para gerenciamento de planos
 * @module services/planService
 */

import contractService from './contractService';
import subscriberService from './subscriberService';

/**
 * Definição dos planos disponíveis
 */
export const PLAN_DEFINITIONS = {
  gratuito: {
    id: 'gratuito',
    name: 'Gratuito',
    subtitle: 'Comece sua presença online.',
    prices: {
      monthly: 0,
      annual: 0
    },
    features: [
      'Perfil básico no guia',
      'Logo e endereço',
      'Telefone (não clicável)'
    ],
    order: 0
  },
  essencial: {
    id: 'essencial',
    name: 'Essencial',
    subtitle: 'Destaque-se da concorrência.',
    prices: {
      monthly: 59.90,
      annual: 590.00
    },
    features: [
      'Página personalizada',
      'Galeria (até 10 fotos)',
      'Botão WhatsApp clicável',
      'Destaque sobre gratuitos'
    ],
    order: 1
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    subtitle: 'A solução para maior alcance.',
    prices: {
      monthly: 99.90,
      annual: 990.00
    },
    features: [
      'Tudo do Essencial',
      'Divulgação em redes sociais',
      '1 Banner Topo',
      '1 Banner Rodapé',
      '1 Banner Lateral'
    ],
    order: 2
  },
  premium_vip: {
    id: 'premium_vip',
    name: 'Premium VIP',
    subtitle: 'Domine o digital.',
    prices: {
      monthly: 129.90,
      annual: 1250.00
    },
    features: [
      'Tudo do Premium',
      'Loja Virtual/Catálogo',
      'Banner em Vídeo VIP',
      'Todos os Banners Inclusos',
      'Treinamento de IA (ISA)'
    ],
    order: 3
  }
};

/**
 * Ordem de hierarquia dos planos (para validação de upgrade/downgrade)
 */
const PLAN_HIERARCHY = ['gratuito', 'essencial', 'premium', 'premium_vip'];

/**
 * Serviço de planos
 */
export const planService = {
  /**
   * Retorna todos os planos disponíveis
   * @returns {Array} Lista de planos
   */
  getAllPlans() {
    return Object.values(PLAN_DEFINITIONS).sort((a, b) => a.order - b.order);
  },

  /**
   * Retorna um plano específico
   * @param {string} planId - ID do plano
   * @returns {Object|null} Plano ou null se não encontrado
   */
  getPlanById(planId) {
    return PLAN_DEFINITIONS[planId] || null;
  },

  /**
   * Verifica se um upgrade é válido
   * @param {string} currentPlan - Plano atual
   * @param {string} targetPlan - Plano alvo
   * @returns {Object} { valid: boolean, reason?: string }
   */
  validateUpgrade(currentPlan, targetPlan) {
    if (!PLAN_DEFINITIONS[currentPlan]) {
      return { valid: false, reason: 'Plano atual não reconhecido' };
    }

    if (!PLAN_DEFINITIONS[targetPlan]) {
      return { valid: false, reason: 'Plano alvo não reconhecido' };
    }

    // Não pode fazer "upgrade" para o mesmo plano
    if (currentPlan === targetPlan) {
      return { valid: false, reason: 'Você já possui este plano' };
    }

    // Pode fazer downgrade ou upgrade (não restringimos downgrades aqui)
    return { valid: true };
  },

  /**
   * Calcula o preço do plano
   * @param {string} planId - ID do plano
   * @param {string} billingCycle - 'monthly' ou 'annual'
   * @returns {number} Preço
   */
  getPrice(planId, billingCycle = 'monthly') {
    const plan = PLAN_DEFINITIONS[planId];
    if (!plan) return 0;
    return plan.prices[billingCycle] || plan.prices.monthly;
  },

  /**
   * Formata o preço para exibição
   * @param {number} price - Preço
   * @returns {string} Preço formatado
   */
  formatPrice(price) {
    if (price === 0) return 'Grátis';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  },

  /**
   * Verifica se um plano é upgrade em relação ao outro
   * @param {string} currentPlan - Plano atual
   * @param {string} targetPlan - Plano alvo
   * @returns {boolean} true se for upgrade
   */
  isUpgrade(currentPlan, targetPlan) {
    const currentIndex = PLAN_HIERARCHY.indexOf(currentPlan);
    const targetIndex = PLAN_HIERARCHY.indexOf(targetPlan);
    return targetIndex > currentIndex;
  },

  /**
   * Verifica se um plano é downgrade em relação ao outro
   * @param {string} currentPlan - Plano atual
   * @param {string} targetPlan - Plano alvo
   * @returns {boolean} true se for downgrade
   */
  isDowngrade(currentPlan, targetPlan) {
    const currentIndex = PLAN_HIERARCHY.indexOf(currentPlan);
    const targetIndex = PLAN_HIERARCHY.indexOf(targetPlan);
    return targetIndex < currentIndex;
  },

  /**
   * Executa upgrade de plano para um assinante
   * @param {string} subscriberId - ID do assinante
   * @param {string} newPlanId - ID do novo plano
   * @param {string} billingCycle - 'monthly' ou 'annual'
   * @returns {Promise<Object>} Resultado do upgrade
   */
  async upgradePlan(subscriberId, newPlanId, billingCycle = 'monthly') {
    try {
      // Buscar assinante atual
      const subscriber = await subscriberService.getSubscriberById(subscriberId);
      if (!subscriber) {
        throw new Error('Assinante não encontrado');
      }

      // Validar upgrade
      const validation = this.validateUpgrade(subscriber.plan_type || 'gratuito', newPlanId);
      if (!validation.valid) {
        throw new Error(validation.reason);
      }

      // Calcular preço
      const price = this.getPrice(newPlanId, billingCycle);

      // Atualizar plano do assinante
      await subscriberService.updateSubscriber(subscriberId, {
        plan_type: newPlanId,
        payment_status: 'pending' // Atualizar para 'paid' após confirmação de pagamento
      });

      // Criar novo contrato
      const contract = await contractService.createContract(subscriberId, {
        plan_type: newPlanId,
        billing_cycle: billingCycle,
        amount: price,
        payment_status: 'pending'
      });

      return {
        success: true,
        subscriber: await subscriberService.getSubscriberById(subscriberId),
        contract: contract,
        message: 'Upgrade realizado com sucesso!'
      };
    } catch (error) {
      console.error('Error upgrading plan:', error);
      throw new Error(error.message || 'Erro ao fazer upgrade do plano');
    }
  }
};

export default planService;

