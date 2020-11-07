import { Schema, model, Document } from "mongoose";
import { Message } from "../../models/message.model";

interface IMessage extends Document, Message { }

const messageSchema = new Schema({
    fromId: { type: String, required: true },
    toId: { type: String, required: true },
    message: { type: String, required: true },
    dateSent: { type: Date, required: true },
});

const collectionName = 'messages';

const Message = model<IMessage>('Message', messageSchema, collectionName);

export default Message;