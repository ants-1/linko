import mongoose, { Model, Types, Schema } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  googleId?: string;
  username: string;
  email: string;
  password?: string;
  avatarUrl?: string;
  description?: string;
  followers?: Types.ObjectId[];
  following?: Types.ObjectId[];
  dateJoined?: Date;
}

type UserModel = Model<IUser>;

const UserSchema = new Schema<IUser, UserModel>({
  googleId: { 
    type: String 
  },
  username: { 
    type: String,
    minlength: 3,
    maxlength: 100,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    minlength: 3,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 7,
  },
  avatarUrl: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  followers: [
    { type: Schema.Types.ObjectId, ref: 'User' }
  ],
  following: [
    { type: Schema.Types.ObjectId, ref: 'User' }
  ],
  dateJoined: {
    type: Date,
    default: Date.now()
  }
});

export default mongoose.model<IUser, UserModel>('User', UserSchema);