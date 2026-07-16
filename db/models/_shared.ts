import type { SchemaOptions } from "mongoose";

/** Default id generator, mirrors the old `text("id").$defaultFn(() => crypto.randomUUID())` pattern. */
export const uuid = () => crypto.randomUUID();

/**
 * Shared schema options for all non-auth collections: keeps a string UUID
 * as `_id` (instead of Mongo's default ObjectId) so ids look/behave the
 * same as before, and includes the `id` virtual in JSON output.
 */
export const sharedOptions: SchemaOptions = {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
};
