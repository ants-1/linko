import mongoose, { Model, Types, Schema } from "mongoose";

export interface ILike {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  likes: Number;
}

type LikeModel = Model<ILike, {}>;

const LikeSchema = new Schema<ILike, LikeModel>({
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
});

LikeSchema.index({ userId: 1, postId: 1 }, { unique: true });

export default mongoose.model<ILike, LikeModel>('Like', LikeSchema);