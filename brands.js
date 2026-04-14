import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://mock.supabase.co';
const SUPABASE_ANON_KEY = 'mock-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Retrieves all brands from the database.
 * @returns {Promise<Array>} List of brands
 */
export async function getBrands() {
  const { data, error } = await supabase.from('brands').select('*');
  if (error) throw error;
  return data;
}

/**
 * Creates a new brand.
 * @param {Object} brand - Brand data
 * @returns {Promise<Object>} Created brand
 */
export async function createBrand(brand) {
  const { data, error } = await supabase.from('brands').insert([brand]).select();
  if (error) throw error;
  return data[0];
}

/**
 * Updates an existing brand.
 * @param {string} id - Brand ID
 * @param {Object} updates - Data to update
 * @returns {Promise<Object>} Updated brand
 */
export async function updateBrand(id, updates) {
  const { data, error } = await supabase.from('brands').update(updates).eq('id', id).select();
  if (error) throw error;
  return data[0];
}

/**
 * Deletes a brand.
 * @param {string} id - Brand ID
 * @returns {Promise<void>}
 */
export async function deleteBrand(id) {
  const { error } = await supabase.from('brands').delete().eq('id', id);
  if (error) throw error;
}
