import mongoose, { InferSchemaType, Schema, model } from 'mongoose';

const wordSchema = new Schema({
    content: { type: String, required: true },
    categoryId: { type: Schema.Types.ObjectId, required: true }
});

type word = InferSchemaType<typeof wordSchema>;
type wordWithId = { _id: mongoose.Types.ObjectId } & word;
const wordModel = model("word", wordSchema);

export { word, wordWithId, wordModel, wordSchema}
