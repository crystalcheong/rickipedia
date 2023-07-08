import {
  int,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core"
import { createInsertSchema } from "drizzle-zod"
import { type z } from "zod"

import { SchemaTypes } from "@/types/rickAndMorty"

export const favourites = mysqlTable(
  "favourites",
  {
    id: varchar("id", { length: 255 }).notNull(),
    user_id: varchar("userId", { length: 191 }).notNull(),
    schemaType: mysqlEnum("schemaType", SchemaTypes).notNull(),
    schemaId: int("schemaId").notNull(),

    created_at: timestamp("created_at").notNull().defaultNow().onUpdateNow(),
  },
  (table) => {
    return {
      pk: primaryKey(table.schemaType, table.schemaId, table.user_id),
    }
  }
)

export const Favourite = createInsertSchema(favourites)
export type Favourite = z.infer<typeof Favourite>
