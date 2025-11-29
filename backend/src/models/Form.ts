import { Schema, model } from "mongoose";


const FormSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true },
        prompt: { type: String, required: true },
        formSchema: { type: Object, required: true },
        shareableId: { type: String, required: true },
        metadata: { type: Object, required: false },


        embedding: {
            type: [Number],
            required: false,
            default: [],
        },
    },
    { timestamps: true }
);


export const Form = model("Form", FormSchema);