import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import "dotenv/config";

import * as schema from "@workspace/db/schema";

const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!);
const db = drizzle(sql, { schema });

export default db;
