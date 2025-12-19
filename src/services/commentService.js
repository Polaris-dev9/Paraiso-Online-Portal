/**
 * Service for managing comments on news and events
 * @module services/commentService
 */

import { supabase } from '@/lib/customSupabaseClient';

export const commentService = {
  /**
   * Fetch comments for a specific target (approved and pending)
   * @param {string} targetType - 'news', 'event', or 'blog'
   * @param {string} targetId - The ID of the news or event
   * @returns {Promise<Array>} List of comments
   */
  async getComments(targetType, targetId) {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('target_type', targetType)
        .eq('target_id', targetId)
        .in('status', ['approved', 'pending']) // Include both approved and pending comments
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  },

  /**
   * Create a new comment
   * @param {Object} commentData - Comment details
   * @returns {Promise<Object>} Created comment
   */
  async createComment(commentData) {
    try {
      const {
        content,
        author_name,
        author_email,
        target_type,
        target_id,
        user_id = null
      } = commentData;

      const { data, error } = await supabase
        .from('comments')
        .insert({
          content,
          author_name,
          author_email,
          target_type,
          target_id,
          user_id,
          status: 'pending' // Most portals require moderation
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },

  /**
   * Get all comments (for admin moderation)
   * @param {string} status - Filter by status: 'pending', 'approved', 'rejected', or null for all
   * @param {string} targetType - Filter by target type: 'news', 'event', 'blog', or null for all
   * @returns {Promise<Array>} List of comments
   */
  async getAllComments(status = null, targetType = null) {
    try {
      let query = supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      if (targetType) {
        query = query.eq('target_type', targetType);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching all comments:', error);
      throw error;
    }
  },

  /**
   * Update comment status (approve/reject)
   * @param {string} commentId - Comment ID
   * @param {string} status - New status: 'approved', 'rejected', or 'pending'
   * @returns {Promise<Object>} Updated comment
   */
  async updateCommentStatus(commentId, status) {
    try {
      const { data, error } = await supabase
        .from('comments')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', commentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating comment status:', error);
      throw error;
    }
  },

  /**
   * Delete a comment
   * @param {string} commentId - Comment ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteComment(commentId) {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }
};

export default commentService;

