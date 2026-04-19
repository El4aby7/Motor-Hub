import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://wyuenhyfnnnvhgknoknt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_62seLeSmlfymfS7LUYtHcg_VVS7T77X';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ======== MAIN GALLERY IMAGES ========

export async function getGalleryImages() {
  const { data, error } = await supabase.from('gallery_images').select('*').order('order_index', { ascending: true });
  if (error) throw error;
  return data;
}

export async function createGalleryImage(imageData) {
  const { data, error } = await supabase.from('gallery_images').insert([imageData]).select();
  if (error) throw error;
  return data[0];
}

export async function updateGalleryImage(id, updates) {
  const { data, error } = await supabase.from('gallery_images').update(updates).eq('id', id).select();
  if (error) throw error;
  return data[0];
}

export async function deleteGalleryImage(id) {
  const { error } = await supabase.from('gallery_images').delete().eq('id', id);
  if (error) throw error;
}

// ======== CLIENT IMAGES ========

export async function getClientImages() {
  const { data, error } = await supabase.from('client_images').select('*').order('order_index', { ascending: true });
  if (error) throw error;
  return data;
}

export async function createClientImage(imageData) {
  const { data, error } = await supabase.from('client_images').insert([imageData]).select();
  if (error) throw error;
  return data[0];
}

export async function updateClientImage(id, updates) {
  const { data, error } = await supabase.from('client_images').update(updates).eq('id', id).select();
  if (error) throw error;
  return data[0];
}

export async function deleteClientImage(id) {
  const { error } = await supabase.from('client_images').delete().eq('id', id);
  if (error) throw error;
}
