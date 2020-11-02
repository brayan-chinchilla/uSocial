import { Schema, model, Document } from "mongoose";
import { User } from "../../models/user.model";

interface IUser extends Document, User { }

const userSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    photo: { type: String, required: false },
    botmode: { type: Boolean, required: true }
});

const collectionName = 'users';

const User = model<IUser>('User', userSchema, collectionName);

export default User;