import mongoose, { Schema } from "mongoose";

const recruitmentAccessModel = new Schema(
  {
    position: {
      type: String
    },
    experience: {
        type: String
    },
    professionalTasks: [
        {
            title: { type: String}
        }
    ],
    togetherTask: [
        {
            title: { type: String }
        }
    ],
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
      }
  },
  { timestamps: true }
);

export default mongoose.model("recruitment", recruitmentAccessModel);
