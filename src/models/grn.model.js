import mongoose, { Schema } from "mongoose";

const grnAccessModel = new Schema(
  {
    products: [
      {
        accessoryId: {
          type: Schema.Types.ObjectId,
          ref: "accessory",
        },
        accessoryName: {
          type: String,
          require: true,
        },
        salePrice: {
          type: Number,
          require: true,
        },
      },
    ],
    tonghd: {
      type: Number,
    },
    userCreate: {
      type: Schema.Types.ObjectId, ref: "user"
    },
    providerId: { type: Schema.Types.ObjectId, ref: "provider" },
    note: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("good-reveived-note", grnAccessModel);
