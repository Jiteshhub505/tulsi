import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
  varchar,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/postgres-js";
import { number } from "zod";

type AdapterAccountType = string;

///////////////////ENUMS//////////////////////////////
export const rolesEnum = pgEnum("roles", ["user", "support", "admin"]);
export const categoryEnum = pgEnum("categories", [
  "Uncategorized",
  "Health & Fitness",
  "Suppliments",
  "Skin",
  "Hygiene",
]);
export const medicineType = pgEnum("medicineType", [
  "powder",
  "capsule",
  "tablet",
  "liquid",
]);
export const cartStatusEnum = pgEnum("cart_status", [
  "active",
  "completed",
  "abandoned",
]);
export const states = pgEnum("states", [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttarakhand",
  "Uttar Pradesh",
  "West Bengal",
]);

export const status = pgEnum("status", [
  "pending",
  "open",
  "completed",
  "replied",
]);

export const order_status = pgEnum("order_status", [
  "created",
  "paid",
  "failed",
  "cancelled",
]);

export const paymentStatus = pgEnum("payment_status", ["success", "failed"]);

/////////////////////////TABLES///////////////////////////////////
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  phone: text("phone").default(""),
  role: rolesEnum().default("user"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ],
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ],
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ],
);

export const products = pgTable("products", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  title: text("title").notNull(),
  category: categoryEnum().default("Uncategorized").notNull(),
  description: text("description"),

  price: integer("price").notNull(),
  discountPrice: integer("discount_price"),

  inStock: integer("in_stock"),

  // featureImage: jsonb("featureImage").$type<string[]>().default([]),
  galleryImages: jsonb("galleryImages").$type<string[]>().default([]),

  // Supplement-specific
  form: varchar("form", { length: 50 }), // powder | capsule | tablet | liquid
  goal: jsonb("goal").$type<string[]>(), // ["weight-loss"] / ["muscle-gain"]
  ingredients: jsonb("ingredients").$type<string[]>(),
  allergens: jsonb("allergens").$type<string[]>(),

  // Regulatory
  warnings: jsonb("warnings").$type<string[]>(),
  directions: text("directions"),
  certifications: jsonb("certifications").$type<string[]>(),

  expiryDate: timestamp("expiry_date", { mode: "date" }),
  manufacturedDate: timestamp("manufactured_date", { mode: "date" }),
  medicineType: medicineType("medicine_type").default("capsule"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const ratings = pgTable("ratings", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  userId: text("userId")
    .notNull()
    .references(() => users.id),

  productId: text("productId")
    .notNull()
    .references(() => products.id),

  rating: integer("rating").notNull(), //1-5

  comment: text("comment"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cart = pgTable("cart", {
  id: text("id")
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey()
    .notNull(),
  userId: text("userId").references(() => users.id),
  status: cartStatusEnum("status").notNull().default("active"),
});

export const cartItems = pgTable("cartItems", {
  id: text("id")
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),

  cartId: text("cartId")
    .notNull()
    .references(() => cart.id),

  productId: text("productId")
    .notNull()
    .references(() => products.id),

  quantity: integer("quantity").notNull().default(1),
});

export const addresses = pgTable("addresses", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id),
  phoneNumber: varchar("phoneNumber", { length: 15 }).notNull(),
  houseNumber: text("houseNumber").notNull(),
  area: text("area").notNull(),
  pincode: text("pincode").notNull(),
  city: text("city").notNull(),
  state: states().notNull(),
  nearby: text("nearby"),
});

export const ticket = pgTable("ticket", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").references(() => users.id),
  subject: text("subject").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  status: status().default("pending"),
});

export const chats = pgTable("chats", {
  id: text("id").primaryKey(),
  ticketId: text("ticket_id").references(() => ticket.id),
  userEmail: text("user_email").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  role: rolesEnum().notNull().default("support"),
});

export const orders = pgTable(
  "orders",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    order_id: text("order_id").notNull().unique(),
    user_id: text("user_id").notNull(),
    amount: integer("amount").notNull(),
    currency: text("currency").notNull(),
    order_status: order_status("order_status").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (t) => ({
    userIdx: index("orders_user_id_idx").on(t.user_id),
  }),
);

export const payments = pgTable("payments", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  order_id: text("order_id")
    .notNull()
    .references(() => orders.order_id, { onDelete: "cascade" }),

  payment_id: text("payment_id").notNull().unique(),

  signature: text("signature"),

  provider: text("provider").notNull().default("razorpay"),

  amount: integer("amount").notNull(),

  method: text("method"),

  payment_status: paymentStatus("payment_status").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
export const orderItems = pgTable(
  "order_items",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    order_id: text("order_id").notNull(),
    product_id: text("product_id").notNull(),
    price: integer("price").notNull(),
    quantity: integer("quantity").notNull(),
  },
  (t) => ({
    orderIdx: index("order_items_order_id_idx").on(t.order_id),
    productIdx: index("order_items_product_id_idx").on(t.product_id),
  }),
);

/////////////////////////END///////////////////////////////////
export default {
  users,
  products,
  cart,
  cartItems,
  addresses,
  chats,
  ticket,
  orders,
  payments,
  orderItems,
};
