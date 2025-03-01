import mongoose, { Schema } from "mongoose";

const UserSchema = Schema({
    username: {
        type: String,
        minLength: 3,
        maxLength: 50,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        minLength: 1,
        maxLength: 30,
        required: true,
    },
    avater: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

export default mongoose.model("User", UserSchema);