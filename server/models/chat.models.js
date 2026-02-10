import mongoose, { Schema, Types } from "mongoose";

const chatSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    groupAvatar: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    groupChat: {
      type: Boolean,
      default: false,
    },
    creator: {
      type: Types.ObjectId,
      ref: "User",
    },
    members: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// chatSchema.pre("save", function (next) {
//   if (!this.groupChat) {
//     this.groupAvatar = undefined;
//   }
//   next();
// });

export const Chat = mongoose.model("Chat", chatSchema);
