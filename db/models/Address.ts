import { Schema, models, model } from "mongoose";
import { uuid, sharedOptions } from "./_shared";

const addressSchema = new Schema(
  {
    _id: { type: String, default: uuid },
    userId: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    houseNumber: { type: String, required: true },
    area: { type: String, required: true },
    pincode: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    nearby: { type: String, default: null },
  },
  { ...sharedOptions, _id: false },
);

export default models.Address || model("Address", addressSchema, "addresses");
