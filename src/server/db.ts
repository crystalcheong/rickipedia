import { drizzle } from "drizzle-orm/mysql2"
import mysql, { type PoolOptions } from "mysql2/promise"

import { env } from "@/env.mjs"

const config: PoolOptions = {
  host: env.DB_HOST,
  user: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
}
const connection = mysql.createPool(config)

export const db = drizzle(connection)
