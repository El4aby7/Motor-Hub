import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://wyuenhyfnnnvhgknoknt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_62seLeSmlfymfS7LUYtHcg_VVS7T77X';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { storage: typeof window !== 'undefined' ? window.sessionStorage : null }
});

/**
 * Uploads a file to the specified Supabase storage bucket
 * @param {File} file - The file object from the input element
 * @param {string} bucket - The name of the storage bucket
 * @param {string} folder - Optional folder structure (e.g. 'vehicles/' or 'brands/')
 * @returns {Promise<string>} The public URL of the uploaded image
 */
export async function uploadImage(file, bucket = 'uploads', folder = '') {
    if (!file) throw new Error('No file provided.');

    // Create a unique file name to prevent collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
    });

    if (error) {
        console.error('Upload Error:', error.message);
        throw error;
    }

    // Retrieve public URL
    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return publicData.publicUrl;
}
