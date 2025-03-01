import mongoose, { Schema } from "mongoose";

const MessageSchema = Schema({
  message: {
    type: String,
    minLength: 1,
    required: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  chatRoom: {
    type: Schema.Types.ObjectId,
    ref: "ChatRoom",
    required: true,
  },
  date: {
    type: Date,
    default: new Date(),
  },
});

export default mongoose.model("Message", MessageSchema);
