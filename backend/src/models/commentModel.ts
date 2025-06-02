import mongoose, { Model, Types, Schema } from "mongoose";

export interface IComment {
  _id: Types.ObjectId;
  content: String;
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  createdAt: Date;
}

type CommentModel = Model<IComment, {}>;

const CommentSchema = new Schema<IComment, CommentModel>({
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

export default mongoose.model<IComment, CommentModel>('Comment', CommentSchema);