/**
 * Serviço para gerenciamento de categorias
 * @module services/categoryService
 */

import { supabase } from '@/lib/customSupabaseClient';

/**
 * Serviço de categorias dinâmicas
 */
export const categoryService = {
  /**
   * Busca todas as categorias por tipo
   * @param {string} type - Tipo de categoria (commercial, professional, news, event, job, forum)
   * @param {boolean} includeInactive - Se deve incluir categorias inativas
   * @returns {Promise<Array>} Lista de categorias
   */
  async getCategoriesByType(type, includeInactive = false) {
    try {
      let query = supabase
        .from('categories')
        .select('*');

      // Filtrar por type apenas se a coluna existir e type foi fornecido
      if (type) {
        query = query.eq('type', type);
      }

      // Filtrar por is_active apenas se a coluna existir
      if (!includeInactive) {
        // Verificar se a coluna existe antes de filtrar
        query = query.or('is_active.is.null,is_active.eq.true');
      }

      query = query
        .is('parent_id', null) // Apenas categorias pai
        .order('order_index', { ascending: true, nullsFirst: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching categories by type:', error);
        // Se erro por coluna não existir, tentar sem filtro de type
        if (error.message && error.message.includes('column')) {
          return this.getCategoriesByTypeFallback(type, includeInactive);
        }
        throw error;
      }
      
      // Filtrar por type no código se necessário (fallback)
      let filteredData = data || [];
      if (type && data) {
        filteredData = data.filter(cat => cat.type === type || !cat.type);
      }
      
      return filteredData;
    } catch (error) {
      console.error('Error fetching categories by type:', error);
      throw new Error('Erro ao buscar categorias: ' + error.message);
    }
  },

  // Fallback se colunas não existirem
  async getCategoriesByTypeFallback(type, includeInactive) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .is('parent_id', null);

      if (error) throw error;

      let filtered = data || [];
      
      // Filtrar por type se fornecido
      if (type) {
        filtered = filtered.filter(cat => cat.type === type || !cat.type);
      }
      
      // Filtrar por is_active se necessário
      if (!includeInactive) {
        filtered = filtered.filter(cat => cat.is_active !== false);
      }

      return filtered;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Busca categorias com suas subcategorias
   * @param {string} type - Tipo de categoria
   * @returns {Promise<Array>} Lista de categorias com subcategorias
   */
  async getCategoriesWithSubcategories(type) {
    try {
      // Buscar categorias pai - com fallback para casos onde colunas não existem
      let query = supabase
        .from('categories')
        .select('*')
        .is('parent_id', null);

      // Adicionar filtros se as colunas existirem
      try {
        if (type) {
          query = query.eq('type', type);
        }
        query = query.eq('is_active', true);
        query = query.order('order_index', { ascending: true, nullsFirst: false });
      } catch (e) {
        // Se erro, tentar sem os filtros
        console.warn('Some columns may not exist, using fallback:', e);
      }

      const { data: parents, error: parentError } = await query;

      if (parentError) {
        // Tentar sem filtros se houver erro
        const { data: fallbackData } = await supabase
          .from('categories')
          .select('*')
          .is('parent_id', null);
        
        if (type && fallbackData) {
          const filtered = fallbackData.filter(cat => cat.type === type || !cat.type);
          return filtered.map(p => ({ ...p, subcategories: [] }));
        }
        
        throw parentError;
      }

      if (!parents || parents.length === 0) {
        return [];
      }

      // Filtrar por type no código se necessário
      let filteredParents = parents;
      if (type) {
        filteredParents = parents.filter(cat => cat.type === type || !cat.type);
      }

      // Buscar subcategorias para cada categoria pai
      const categoriesWithChildren = await Promise.all(
        filteredParents.map(async (parent) => {
          try {
            const { data: children, error: childrenError } = await supabase
              .from('categories')
              .select('*')
              .eq('parent_id', parent.id)
              .order('order_index', { ascending: true, nullsFirst: false });

            if (childrenError) {
              console.error(`Error fetching subcategories for ${parent.id}:`, childrenError);
              return { ...parent, subcategories: [] };
            }

            // Filtrar por is_active se a coluna existir
            const activeChildren = (children || []).filter(c => c.is_active !== false);

            return { 
              ...parent, 
              subcategories: activeChildren || [] 
            };
          } catch (e) {
            return { ...parent, subcategories: [] };
          }
        })
      );

      return categoriesWithChildren;
    } catch (error) {
      console.error('Error fetching categories with subcategories:', error);
      throw new Error('Erro ao buscar categorias: ' + error.message);
    }
  },

  /**
   * Busca uma categoria por ID
   * @param {string} id - ID da categoria
   * @returns {Promise<Object>} Categoria encontrada
   */
  async getCategoryById(id) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching category by id:', error);
      throw new Error('Erro ao buscar categoria: ' + error.message);
    }
  },

  /**
   * Busca categoria por slug
   * @param {string} slug - Slug da categoria
   * @returns {Promise<Object>} Categoria encontrada
   */
  async getCategoryBySlug(slug) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error fetching category by slug:', error);
      throw new Error('Erro ao buscar categoria: ' + error.message);
    }
  },

  /**
   * Cria uma nova categoria
   * @param {Object} categoryData - Dados da categoria
   * @returns {Promise<Object>} Categoria criada
   */
  async createCategory(categoryData) {
    try {
      // Verificar se já existe categoria com o mesmo nome (ativa ou inativa)
      const { data: existingCategory } = await supabase
        .from('categories')
        .select('id, name, is_active, type')
        .eq('name', categoryData.name)
        .maybeSingle();

      // Se existe e está inativa, reativar em vez de criar nova
      if (existingCategory && existingCategory.is_active === false) {
        const updates = {
          is_active: true
        };
        
        if (categoryData.type && existingCategory.type !== categoryData.type) {
          updates.type = categoryData.type;
        }
        
        const { data: reactivated, error: updateError } = await supabase
          .from('categories')
          .update(updates)
          .eq('id', existingCategory.id)
          .select()
          .single();

        if (updateError) {
          throw updateError;
        }

        return reactivated;
      }

      // Se existe e está ativa, retornar erro amigável
      if (existingCategory && existingCategory.is_active !== false) {
        throw new Error(`Uma categoria com o nome "${categoryData.name}" já existe.`);
      }

      // Gerar slug se não fornecido
      let slug = categoryData.slug;
      if (!slug && categoryData.name) {
        slug = categoryData.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove acentos
          .replace(/[^a-z0-9]+/g, '-') // Substitui caracteres especiais por hífen
          .replace(/^-+|-+$/g, ''); // Remove hífens do início e fim
      }

      // Verificar se slug já existe e gerar único se necessário
      if (slug) {
        const { data: existingSlug } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', slug)
          .maybeSingle();

        if (existingSlug) {
          slug = `${slug}-${Date.now()}`;
        }
      }

      // Preparar dados mínimos (só campos que existem com certeza)
      const insertData = {
        name: categoryData.name,
        slug: slug || null,
        description: categoryData.description || null
      };

      // Adicionar campos opcionais (apenas se a tabela tiver essas colunas)
      // O Supabase vai ignorar campos que não existem na tabela
      if (categoryData.type) {
        insertData.type = categoryData.type;
      }
      if (categoryData.parent_id) {
        insertData.parent_id = categoryData.parent_id;
      }
      if (categoryData.order_index !== undefined) {
        insertData.order_index = categoryData.order_index;
      }
      if (categoryData.icon) {
        insertData.icon = categoryData.icon;
      }
      if (categoryData.is_active !== undefined) {
        insertData.is_active = categoryData.is_active;
      }

      // Simplificar dados - apenas campos essenciais
      const simpleData = {
        name: categoryData.name
      };
      
      // Adicionar slug se existir
      if (slug) {
        simpleData.slug = slug;
      }
      
      // Adicionar type se fornecido
      if (categoryData.type) {
        simpleData.type = categoryData.type;
      }
      
      console.log('Attempting to insert category:', simpleData);
      
      // Tentar inserção simples - versão 2.30.0 do Supabase
      let result = await supabase
        .from('categories')
        .insert([simpleData])
        .select()
        .single();

      if (result.error) {
        console.error('Supabase insert error:', result.error);
        console.error('Full error object:', JSON.stringify(result.error, null, 2));
        
        // Se erro ainda persistir, tentar apenas com name
        if (result.error.message && result.error.message.includes('schema')) {
          console.warn('Trying with name only...');
          
          const nameOnlyData = { name: categoryData.name };
          
          result = await supabase
            .from('categories')
            .insert([nameOnlyData])
            .select()
            .single();
          
          if (result.error) {
            console.error('Even name-only insert failed:', result.error);
            throw new Error(`Erro ao criar categoria: ${result.error.message}`);
          }
          
          // Se inseriu só com name, atualizar outros campos
          if (result.data && result.data.id) {
            const updates = {};
            if (slug) updates.slug = slug;
            if (categoryData.type) updates.type = categoryData.type;
            if (categoryData.order_index !== undefined) updates.order_index = categoryData.order_index;
            if (categoryData.is_active !== undefined) updates.is_active = categoryData.is_active;
            
            if (Object.keys(updates).length > 0) {
              const { data: updatedData, error: updateError } = await supabase
                .from('categories')
                .update(updates)
                .eq('id', result.data.id)
                .select()
                .single();
              
              if (!updateError && updatedData) {
                return updatedData;
              }
            }
          }
          
          return result.data;
        }
        
        // Tratar erros específicos
        if (result.error.code === '23505') {
          // Erro de constraint unique
          if (result.error.message.includes('categories_name_key')) {
            throw new Error(`Uma categoria com o nome "${categoryData.name}" já existe.`);
          } else if (result.error.message.includes('categories_slug_key')) {
            throw new Error(`Uma categoria com o slug "${slug}" já existe. Tente um nome diferente.`);
          }
        }
        
        throw new Error(`Erro ao criar categoria: ${result.error.message}`);
      }
      
      // Se inseriu com sucesso, atualizar campos adicionais se necessário
      if (result.data && result.data.id) {
        const updates = {};
        let needsUpdate = false;
        
        if (categoryData.order_index !== undefined && result.data.order_index !== categoryData.order_index) {
          updates.order_index = categoryData.order_index;
          needsUpdate = true;
        }
        
        if (categoryData.is_active !== undefined && result.data.is_active !== categoryData.is_active) {
          updates.is_active = categoryData.is_active;
          needsUpdate = true;
        }
        
        if (needsUpdate) {
          const { data: updatedData } = await supabase
            .from('categories')
            .update(updates)
            .eq('id', result.data.id)
            .select()
            .single();
          
          return updatedData || result.data;
        }
      }
      
      return result.data;
    } catch (error) {
      console.error('Error creating category:', error);
      
      // Se já é uma mensagem amigável, passar direto
      if (error.message && !error.message.includes('duplicate key') && !error.message.includes('23505')) {
        throw error;
      }
      
      // Melhorar mensagens de erro comuns
      if (error.message && error.message.includes('duplicate key')) {
        if (error.message.includes('categories_name_key')) {
          throw new Error(`Uma categoria com o nome "${categoryData.name}" já existe.`);
        } else if (error.message.includes('categories_slug_key')) {
          throw new Error(`Uma categoria com este slug já existe. Tente um nome diferente.`);
        }
      }
      
      throw new Error('Erro ao criar categoria: ' + error.message);
    }
  },

  /**
   * Atualiza uma categoria existente
   * @param {string} id - ID da categoria
   * @param {Object} updates - Dados para atualizar
   * @returns {Promise<Object>} Categoria atualizada
   */
  async updateCategory(id, updates) {
    try {
      // Se atualizando nome, atualizar slug também
      if (updates.name && !updates.slug) {
        updates.slug = updates.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }

      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw new Error('Erro ao atualizar categoria: ' + error.message);
    }
  },

  /**
   * Deleta uma categoria (soft delete)
   * @param {string} id - ID da categoria
   * @returns {Promise<void>}
   */
  async deleteCategory(id) {
    try {
      // Soft delete: marcar como inativa
      // NOTA: Isso mantém o registro no banco, então o nome ainda será único
      // Se quiser hard delete, use deleteCategoryPermanently
      const { error } = await supabase
        .from('categories')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw new Error('Erro ao deletar categoria: ' + error.message);
    }
  },

  /**
   * Deleta permanentemente uma categoria (cuidado!)
   * @param {string} id - ID da categoria
   * @returns {Promise<void>}
   */
  async permanentDeleteCategory(id) {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error permanently deleting category:', error);
      throw new Error('Erro ao deletar categoria permanentemente: ' + error.message);
    }
  },

  /**
   * Reordena categorias
   * @param {Array<string>} categoryIds - Array de IDs na nova ordem
   * @returns {Promise<void>}
   */
  async reorderCategories(categoryIds) {
    try {
      const updates = categoryIds.map((id, index) => ({
        id,
        order_index: index
      }));

      // Atualizar uma por uma (Supabase não suporta bulk update facilmente)
      for (const update of updates) {
        const { error } = await supabase
          .from('categories')
          .update({ order_index: update.order_index })
          .eq('id', update.id);

        if (error) {
          console.error(`Error reordering category ${update.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Error reordering categories:', error);
      throw new Error('Erro ao reordenar categorias: ' + error.message);
    }
  },

  /**
   * Busca subcategorias de uma categoria pai
   * @param {string} parentId - ID da categoria pai
   * @returns {Promise<Array>} Lista de subcategorias
   */
  async getSubcategories(parentId) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('parent_id', parentId)
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      throw new Error('Erro ao buscar subcategorias: ' + error.message);
    }
  }
};

export default categoryService;

