import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { supabaseUrl } from "../constants";
import { supabaseAnonKey } from "../constants";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const getPublicImageUrl = (filePath) => {
  console.log(
    "img url",
    `${supabaseUrl}/storage/v1/object/public/uploads/${filePath}`
  );
  return `${supabaseUrl}/storage/v1/object/public/uploads/${filePath}`;
};
