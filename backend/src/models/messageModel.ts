import mongoose, { Model, Types, Schema } from "mongoose";

export interface IMessage {
  _id: Types.ObjectId;
  sender: Types.ObjectId;
  content: string;
  imgUrl?: string;
  createdAt?: Date;
}

type MessageModel = Model<IMessage>;

const MessageSchema = new Schema<IMessage, MessageModel>({
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    minlength: 1,
    required: true,
  },
  imgUrl: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model<IMessage, MessageModel>("Message", MessageSchema);
