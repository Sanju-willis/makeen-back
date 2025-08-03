// src\db\index.ts
import { drizzle } from "drizzle-orm/postgres-js";
import { queryClient } from "@/lib/clients/dbClient";
import * as schema from "@/db/schema";

export const db = drizzle(queryClient, { schema });
