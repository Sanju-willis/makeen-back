// src\config\dbClient.ts
import postgres from "postgres";
import {
  DATABASE_URL,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
} from "@/config/env";

export const queryClient = postgres(DATABASE_URL, {
  prepare: false,
  max: 1,
});

export const supabaseConfig = {
  url: SUPABASE_URL,
  anonKey: SUPABASE_ANON_KEY,
  serviceRoleKey: SUPABASE_SERVICE_ROLE_KEY,
};
