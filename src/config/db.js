import { neon } from "@neondatabase/serverless";
import "dotenv/config";

// create SQL connection using db uri
export const sql = neon(`${process.env.DATABASE_URL}`);
