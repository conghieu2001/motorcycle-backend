import mongoose, { Schema } from "mongoose";

const guaranteeAccessModel = new Schema(
  { 
    productIdGuarantee: {
      type: Schema.Types.ObjectId,
      ref: 'product'
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'order'
    },
    accessories: [
      {
        accessId: {
          type: Schema.Types.ObjectId,
          ref: 'accessory'
        },
        quantity: {type: Number}
      },
    ],
    totalBill: {
      type: Number,
      default: 0
    },
    userCreate: {
      type: Schema.Types.ObjectId,
       ref: "user"
    },
    notes: {
      type: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("guarantee", guaranteeAccessModel);
