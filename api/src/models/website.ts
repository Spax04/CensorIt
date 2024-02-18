import mongoose, { InferSchemaType, Schema, model } from "mongoose";

const websiteSchema = new Schema({
    link: { type: String, required: true },
    blockPercentage: { type: Number, required: true },
    categoryId: { type: Schema.Types.ObjectId, required: true }
});

type website = InferSchemaType<typeof websiteSchema>;
type websiteWithId = { _id: mongoose.Types.ObjectId } & website;
const websiteModel = model("website", websiteSchema);

export { website, websiteWithId, websiteModel, websiteSchema}
