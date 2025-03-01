import mongoose, { Schema } from "mongoose";

const ChatRoomSchema = Schema({
  name: {
    type: String,
    minLength: 3,
    maxLength: 60,
    unique: true,
    required: true,
  },
  description: {
    type: String,
    maxLength: 300,
  },
  image: {
    type: String,
  },
  host: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  date: {
    type: Date,
    default: new Date(),
  },
});

export default mongoose.model("ChatRoom", ChatRoomSchema);
