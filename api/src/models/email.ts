import { InferSchemaType, Schema, model } from "mongoose";

const emailSchema = new Schema({
    address: { type: String, validate: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.com$/, required: true}
});

type email = InferSchemaType<typeof emailSchema>;
type emailWithId = { _id: Schema.Types.ObjectId } & email;
const emailModel = model("email", emailSchema);

// type email = `${string}@${string}.com`;

function isEmail(mail: {address: string}): mail is email {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.com$/;
    return emailRegex.test(mail.address);
}

export { email, emailWithId, isEmail, emailModel, emailSchema }
