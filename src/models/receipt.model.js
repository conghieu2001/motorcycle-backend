import mongoose, { Schema } from "mongoose";

const inputProductAccessModel = new Schema(
  {
    products: [
      {
        productType: {
          type: String,
          default: 'product',
          enum: ['product', 'accessory']
        },
        productId: {
          type: Schema.Types.ObjectId,
          refPath: 'products.productType'
        },
        inputPrice: {
          type: Number,
          require: true,
        },
        inputQuantity: {
          type: Number,
          require: true,
        },
      },
    ],
    totalBill: {
      type: Number,
    },
    userCreate: {
      type: Schema.Types.ObjectId,
       ref: "user"
    },
    providerId: { type: Schema.Types.ObjectId, ref: "provider" },
    note: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("receipt", inputProductAccessModel);
