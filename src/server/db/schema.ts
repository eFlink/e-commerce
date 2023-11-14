// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  index,
  mysqlTableCreator,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import { relations } from "drizzle-orm";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator((name) => `dohfigure_${name}`);

export const products = mysqlTable(
  "product",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    name: varchar("name", { length: 256 }).notNull(),
    description: varchar("description", { length: 256 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  })
);

export const productsRelations = relations(products, ({many}) => ({
  images: many(images),
}));

export const images = mysqlTable(
  "image",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    name: varchar("name", { length: 256 }).notNull(),
    alt_text: varchar("alt_text", { length: 256 }),
    product_id: bigint("productId", {mode: "number"}).notNull(),
    main_photo: boolean("main_photo").notNull(),
    image_url: varchar("imageUrl", { length: 256 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  })
);
export const imagesRelations = relations(images, ({one}) => ({
  product: one(products, {
    fields: [images.product_id],
    references: [products.id],
  }),
}));
