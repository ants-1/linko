import mongoose, { Model, Types, Schema } from "mongoose";

export interface IPost {
  _id: Types.ObjectId;
  title: string;
  imgUrl?: string;
  content: string;
  country: string;
  visitDate?: Date;
  author: Types.ObjectId;
  viewCount?: Number;
  createdAt?: Date;
}

type PostModel = Model<IPost, {}>;

const PostSchema = new Schema<IPost, PostModel>({
  title: {
    type: String,
    minlength: 3,
    maxlength: 256,
    required: true
  },
  imgUrl: {
    type: String,
    default: 'https://placehold.co/600x400/png'
  },
  content: {
    type: String,
    minlength: 3,
    required: true,
  },
  country: {
    type: String,
    minLength: 1,
    required: true
  },
  visitDate: {
    type: Date,
  },
  author: {
    type: Schema.Types.ObjectId, ref: 'User',
    required: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
}); 

export default mongoose.model<IPost, PostModel>('Post', PostSchema);