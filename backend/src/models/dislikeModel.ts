import mongoose, { Model, Schema, Types } from "mongoose";

export interface IDislike {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  postId: Types.ObjectId;
}

type DislikeModel = Model<IDislike>;

const DislikeSchema = new Schema<IDislike, DislikeModel>({
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

DislikeSchema.index({ userId: 1, postId: 1 }, { unique: true });

export default mongoose.model<IDislike, DislikeModel>('Dislike', DislikeSchema);
