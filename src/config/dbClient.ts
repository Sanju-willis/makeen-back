// src\config\dbClient.ts
import postgres from "postgres";
import { DATABASE_URL } from "@/config/env";

export const queryClient = postgres(DATABASE_URL, {
  prepare: false,
  max: 1,
});
