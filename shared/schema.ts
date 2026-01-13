import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const snippets = pgTable("snippets", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  code: text("code").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSnippetSchema = createInsertSchema(snippets).omit({ 
  id: true, 
  createdAt: true 
});

export type Snippet = typeof snippets.$inferSelect;
export type InsertSnippet = z.infer<typeof insertSnippetSchema>;

export type RunCodeRequest = {
  code: string;
};

export type RunCodeResponse = {
  output: string;
  error?: string;
};
