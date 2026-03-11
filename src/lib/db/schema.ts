import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { vector } from "drizzle-orm/pg-core"
import { monotonicFactory } from "ulidx"

const ulid = monotonicFactory()

export const resumes = pgTable("resumes", {
  id: text("id").primaryKey().$defaultFn(() => ulid()),
  title: text("title").notNull().default("제목 없는 이력서"),
  content: text("content").notNull().default(""),
  embedding: vector("embedding", { dimensions: 1536 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export type Resume = typeof resumes.$inferSelect
export type NewResume = typeof resumes.$inferInsert
