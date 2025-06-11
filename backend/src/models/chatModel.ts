import mongoose, { Model, Types, Schema } from "mongoose";

export interface IChat {
  _id: Types.ObjectId;
  name: string;
  imgUrl?: string;
  host: Types.ObjectId;
  users?: Types.ObjectId[];
  messages: Types.ObjectId[];
  countries: string[];
  createdAt?: Date;
}

type ChatModel = Model<IChat>;

const ChatSchema = new Schema<IChat, ChatModel>({
  name: {
    type: String,
    minlength: 3,
    maxLength: 256,
    required: true,
  },
  imgUrl: {
    type: String,
    default: "",
  },
  host: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  users: [
    { type: Schema.Types.ObjectId, ref: "User" }
  ],
  messages: [
    { type: Schema.Types.ObjectId, ref: "Message" }
  ],
  countries: [
    { type: String, default: [] },
  ],
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

export default mongoose.model<IChat, ChatModel>('Chat', ChatSchema);