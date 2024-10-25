import { Schema, model } from "mongoose";
const schema = new Schema({
    token: {
        type: Schema.Types.String,
        required: true,
    },
});
export const RefreshToken = model("RefreshToken", schema);
