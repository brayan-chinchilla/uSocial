import { Schema, model, Document } from "mongoose";
import { Post } from "../../models/post.model";

interface IPost extends Document, Post {
    timestamp: string,
    labels: Array<string>
}

const postSchema = new Schema({
    username: { type: String, required: true },
    text: { type: String, required: false },
    image: { type: String, required: true },
    timestamp: {type: Date, required: true},
    labels: [{type: String, required: true}]
});

const collectionName = 'posts';

const Post = model<IPost>('Post', postSchema, collectionName);

export default Post;