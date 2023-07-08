import type { Config } from "drizzle-kit"
import * as dotenv from "dotenv"
dotenv.config()

export default {
  driver: "mysql2",
  dbCredentials: {
    host: process.env.DB_HOST ?? "",
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME ?? "",
  },
  schema: ["./src/data/db/**/schema.ts"],
  out: "./drizzle",
} satisfies Config
