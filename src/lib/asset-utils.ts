
import { supabase } from "@/integrations/supabase/client";

export type AssetType = "audio" | "image" | "video" | "document";

export const uploadAssetToStorage = async (
  file: File,
  userId: string,
  onProgress?: (progress: number) => void
) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('assets')
    .upload(fileName, file, {
      cacheControl: '3600'
    });
    
  if (error) throw error;
  
  return { path: fileName };
};

export const getAssetUrl = async (filePath: string) => {
  const { data } = await supabase.storage
    .from('assets')
    .createSignedUrl(filePath, 3600);
    
  return data?.signedUrl;
};

export const deleteAssetFromStorage = async (filePath: string) => {
  const { error } = await supabase.storage
    .from('assets')
    .remove([filePath]);
    
  if (error) throw error;
};

export const getAssetType = (fileName: string): AssetType => {
  const ext = fileName.toLowerCase().split('.').pop() || '';
  
  if (['mp3', 'wav', 'm4a', 'aac', 'ogg'].includes(ext)) return "audio";
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return "image";
  if (['mp4', 'mov', 'avi', 'webm'].includes(ext)) return "video";
  return "document";
};
