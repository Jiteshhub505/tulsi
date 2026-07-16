/**
 * Sentinel user id used for guest (unauthenticated) carts/orders.
 * Must be a valid 24-char hex string so it casts cleanly to a Mongo
 * ObjectId wherever it's stored/queried against the `User` model.
 */
export const GUEST_USER_ID = "000000000000000000000001";
export const GUEST_USER_EMAIL = "guest@tulsiveda.com";
