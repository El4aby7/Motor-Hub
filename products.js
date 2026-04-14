import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// In a real application, these would come from environment variables.
// For the sake of this challenge and providing a functional mock/wrapper structure:
const SUPABASE_URL = 'https://mock.supabase.co';
const SUPABASE_ANON_KEY = 'mock-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Retrieves all vehicles from the database.
 * @returns {Promise<Array>} List of vehicles
 */
export async function getVehicles() {
  const { data, error } = await supabase.from('products').select('*').order('inventory_order', { ascending: true });
  if (error) throw error;
  return data;
}

/**
 * Retrieves spotlight vehicles from the database.
 * @returns {Promise<Array>} List of spotlight vehicles
 */
export async function getSpotlightVehicles() {
  const { data, error } = await supabase.from('products').select('*').eq('is_spotlight', true).order('spotlight_order', { ascending: true });
  if (error) throw error;
  return data;
}

/**
 * Creates a new vehicle.
 * @param {Object} vehicle - Vehicle data
 * @returns {Promise<Object>} Created vehicle
 */
export async function createVehicle(vehicle) {
  const { data, error } = await supabase.from('products').insert([vehicle]).select();
  if (error) throw error;
  return data[0];
}

/**
 * Updates an existing vehicle.
 * @param {string} id - Vehicle ID
 * @param {Object} updates - Data to update
 * @returns {Promise<Object>} Updated vehicle
 */
export async function updateVehicle(id, updates) {
  const { data, error } = await supabase.from('products').update(updates).eq('id', id).select();
  if (error) throw error;
  return data[0];
}

/**
 * Deletes a vehicle.
 * @param {string} id - Vehicle ID
 * @returns {Promise<void>}
 */
export async function deleteVehicle(id) {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}
