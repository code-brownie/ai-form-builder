import { boolean, integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const Jsonforms = pgTable('jsonforms', {
    id: serial('id').primaryKey(),
    theme: varchar('theme'),
    background: varchar('background'),
    style: varchar('style'),
    jsonForm: text('jsonForm').notNull(),
    createdBy: varchar('createdBy').notNull(),
    createdAt: varchar('createdAt').notNull(),
    signInEnabled:boolean('signInEnabled').default(false)
});

export const userResponses = pgTable('userResponses', {
    id: serial('id').primaryKey(),
    jsonResponse: text('jsonResponse').notNull(),
    createdBy: varchar('createdBy').default('anonymous'),
    createdAt: varchar('createdAt').notNull(),
    formRef: integer('formRef')
        .references(() => Jsonforms.id, { onDelete: 'cascade' }) // Adding cascade delete
});