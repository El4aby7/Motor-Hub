import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://wyuenhyfnnnvhgknoknt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_62seLeSmlfymfS7LUYtHcg_VVS7T77X';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Retrieves all categories from the database.
 * @returns {Promise<Array>} List of categories
 */
export async function getCategories() {
  const { data, error } = await supabase.from('categories').select('*');
  if (error) throw error;
  return data;
}

/**
 * Creates a new category.
 * @param {Object} category - Category data
 * @returns {Promise<Object>} Created category
 */
export async function createCategory(category) {
  const { data, error } = await supabase.from('categories').insert([category]).select();
  if (error) throw error;
  return data[0];
}

/**
 * Updates an existing category.
 * @param {string} id - Category ID
 * @param {Object} updates - Data to update
 * @returns {Promise<Object>} Updated category
 */
export async function updateCategory(id, updates) {
  const { data, error } = await supabase.from('categories').update(updates).eq('id', id).select();
  if (error) throw error;
  return data[0];
}

/**
 * Deletes a category.
 * @param {string} id - Category ID
 * @returns {Promise<void>}
 */
export async function deleteCategory(id) {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}
