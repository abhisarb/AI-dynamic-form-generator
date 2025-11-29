import mongoose, { Document, Schema } from 'mongoose';

export interface IFormSubmission extends Document {
    formId: mongoose.Types.ObjectId;
    responses: Record<string, any>; // Field ID -> value mapping
    imageUrls: string[]; // Cloudinary URLs for uploaded images
    submittedAt: Date;
}

const formSubmissionSchema = new Schema<IFormSubmission>(
    {
        formId: {
            type: Schema.Types.ObjectId,
            ref: 'Form',
            required: true,
            index: true,
        },
        responses: {
            type: Schema.Types.Mixed,
            required: true,
        },
        imageUrls: {
            type: [String],
            default: [],
        },
        submittedAt: {
            type: Date,
            default: Date.now,
            index: true,
        },
    }
);

// Index for efficient querying of submissions by form
formSubmissionSchema.index({ formId: 1, submittedAt: -1 });

export const FormSubmission = mongoose.model<IFormSubmission>(
    'FormSubmission',
    formSubmissionSchema
);
