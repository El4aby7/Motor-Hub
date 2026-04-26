import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://wyuenhyfnnnvhgknoknt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_62seLeSmlfymfS7LUYtHcg_VVS7T77X';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { storage: typeof window !== 'undefined' ? window.sessionStorage : null }
});

const CACHE_TTL = 5 * 60 * 1000;
async function fetchWithCache(key, fetcher) {
  try {
    const cached = localStorage.getItem(key);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL) return data;
    }
  } catch (e) {}
  const data = await fetcher();
  try { localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() })); } catch (e) {}
  return data;
}

/**
 * Retrieves all brands from the database.
 * @returns {Promise<Array>} List of brands
 */
export async function getBrands() {
  return fetchWithCache('cache_brands', async () => {
    const { data, error } = await supabase.from('brands').select('*');
    if (error) throw error;
    return data;
  });
}

/**
 * Creates a new brand.
 * @param {Object} brand - Brand data
 * @returns {Promise<Object>} Created brand
 */
export async function createBrand(brand) {
  const { data, error } = await supabase.from('brands').insert([brand]).select();
  if (error) throw error;
  try { localStorage.removeItem('cache_brands'); } catch(e) {}
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
  try { localStorage.removeItem('cache_brands'); } catch(e) {}
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
  try { localStorage.removeItem('cache_brands'); } catch(e) {}
}
