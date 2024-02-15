import mongoose, { InferSchemaType, Schema, model } from 'mongoose';

const categorySchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true }
});

type category = InferSchemaType<typeof categorySchema>;
type categoryWithId = { _id: mongoose.Types.ObjectId } & category;
const categoryModel = model("category", categorySchema);

export { category, categoryWithId, categorySchema, categoryModel }
