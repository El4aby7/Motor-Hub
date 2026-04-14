import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://mock.supabase.co';
const SUPABASE_ANON_KEY = 'mock-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Retrieves global settings from the database.
 * @returns {Promise<Object>} Settings object
 */
export async function getSettings() {
  const { data, error } = await supabase.from('settings').select('*').single();
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
  return data || {};
}

/**
 * Updates global settings.
 * @param {Object} updates - Settings to update
 * @returns {Promise<Object>} Updated settings
 */
export async function updateSettings(updates) {
  // Assuming a single row with id 1 for settings
  const { data, error } = await supabase.from('settings').upsert({ id: 1, ...updates }).select();
  if (error) throw error;
  return data[0];
}

/**
 * Subscribes to real-time changes on the settings table.
 * @param {Function} callback - Function to call when settings change
 * @returns {Object} Subscription channel
 */
export function subscribeToSettings(callback) {
  const channel = supabase
    .channel('settings_changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'settings' },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();

  return channel;
}
