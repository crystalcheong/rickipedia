import type { Config } from "drizzle-kit"
import * as dotenv from "dotenv"
dotenv.config()

const dbCredentials = {
  connectionString: process.env.DB_URL ?? "",
}

export default {
  driver: "mysql2",
  dbCredentials,
  schema: ["./src/data/db/**/schema.ts"],
  out: "./drizzle",
} satisfies Config
