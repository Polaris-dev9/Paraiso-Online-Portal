# 📦 Serviços (Services)

Esta pasta contém todos os serviços que fazem comunicação com o backend (Supabase) e APIs externas.

## 📋 Estrutura

```
services/
├── cepService.js          # Integração com ViaCEP
├── categoryService.js     # Gerenciamento de categorias
├── subscriberService.js   # Gerenciamento de assinantes
├── contractService.js     # Gerenciamento de contratos
├── votingService.js       # Sistema de votação
├── forumService.js        # Fórum comunitário
├── aiService.js           # Integração com Horizons AI
└── bannerService.js       # Gerenciamento de banners
```

## 🚀 Como Usar

### Exemplo Básico

```javascript
import { categoryService } from '@/services/categoryService';

// Buscar categorias comerciais
const categories = await categoryService.getCategoriesByType('commercial');

// Criar nova categoria
const newCategory = await categoryService.createCategory({
  name: 'Restaurantes',
  type: 'commercial'
});
```

### Tratamento de Erros

Todos os serviços lançam erros que devem ser tratados:

```javascript
try {
  const subscriber = await subscriberService.getSubscriberByUserId(userId);
} catch (error) {
  console.error(error.message);
  toast.error('Erro ao buscar assinante');
}
```

## 📚 Documentação dos Serviços

### cepService

Busca de endereços via CEP usando a API ViaCEP.

```javascript
import { cepService } from '@/services/cepService';

// Buscar endereço
const address = await cepService.getAddressByCep('12345678');

// Formatar CEP
const formatted = cepService.formatCep('12345678'); // '12345-678'

// Validar CEP
const isValid = cepService.isValidCep('12345678'); // true
```

### categoryService

Gerenciamento completo de categorias dinâmicas.

```javascript
import { categoryService } from '@/services/categoryService';

// Buscar categorias por tipo
const categories = await categoryService.getCategoriesByType('commercial');

// Buscar com subcategorias
const withSubs = await categoryService.getCategoriesWithSubcategories('commercial');

// Criar categoria
const category = await categoryService.createCategory({
  name: 'Restaurantes',
  type: 'commercial',
  order_index: 0
});
```

### subscriberService

Gerenciamento de assinantes (empresas, profissionais, personalidades).

```javascript
import { subscriberService } from '@/services/subscriberService';

// Criar assinante
const subscriber = await subscriberService.createSubscriber({
  user_id: userId,
  name: 'Empresa Exemplo',
  email: 'contato@exemplo.com',
  profile_type: 'empresarial',
  plan_type: 'premium'
});

// Buscar por user_id
const mySubscriber = await subscriberService.getSubscriberByUserId(userId);

// Atualizar
await subscriberService.updateSubscriber(id, {
  description: 'Nova descrição'
});
```

## 🔄 Convenções

1. **Nomes de funções**: Usar camelCase e ser descritivo
2. **Tratamento de erros**: Sempre lançar erros descritivos
3. **Validação**: Validar dados antes de enviar ao backend
4. **Retornos**: Retornar dados ou null/[] quando não encontrado
5. **Logging**: Usar console.error para erros, console.log apenas em dev

## 🐛 Troubleshooting

### Erro: "relation does not exist"
- Verifique se as tabelas foram criadas no Supabase
- Execute o arquivo `database/complete_schema.sql`

### Erro: "permission denied"
- Verifique as RLS policies no Supabase
- Confirme que o usuário tem permissões adequadas

### Erro: "network request failed"
- Verifique conexão com internet
- Confirme que as credenciais do Supabase estão corretas

## 📝 Adicionando Novo Serviço

1. Criar arquivo em `src/services/`
2. Importar `supabase` de `@/lib/customSupabaseClient`
3. Exportar objeto com métodos
4. Adicionar tratamento de erros
5. Adicionar JSDoc comments
6. Adicionar exemplo de uso neste README

