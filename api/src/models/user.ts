import mongoose, { Schema, InferSchemaType, model } from 'mongoose';
import { emailSchema } from './email';


const userSchema = new Schema({
    email: { type: emailSchema, required: true },
    password: { type: String, required: true },
    categoryList: { type: [Schema.Types.ObjectId], required: true },
    websiteList: { type: [Schema.Types.ObjectId], required: true },
    wordList: { type: [Schema.Types.ObjectId], required: true },
    personalBlockPercentage: { type: Number, default: 0 }, // ! TODO - think about the default value
});

type user = InferSchemaType<typeof userSchema>;
type userWithId = { _id: mongoose.Types.ObjectId } & user;
const userModel = model("user", userSchema);

export { user, userWithId, userModel, userSchema }
