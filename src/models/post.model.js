import mongoose, { Schema } from "mongoose";

const postAccessModel = new Schema(
  {
    title: {
      type: String
    },
    descriptions: [
      {
        desTitle: {type: String},
        desDes: {type: String}
      }
    ],
    image: {type: String},
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    }
  },
  { timestamps: true }
);

export default mongoose.model("post", postAccessModel);
