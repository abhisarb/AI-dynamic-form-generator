import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { Form } from '../models/Form';
import { FormSubmission } from '../models/FormSubmission';

const router = express.Router();

/**
 * GET /api/public/form/:shareableId
 * Get form schema for public rendering (no authentication required)
 */
router.get('/form/:shareableId', async (req: Request, res: Response) => {
    try {
        const { shareableId } = req.params;

        const form = await Form.findOne({ shareableId }).select(
            'title description formSchema createdAt'
        );

        if (!form) {
            return res.status(404).json({
                success: false,
                message: 'Form not found',
            });
        }

        res.json({
            success: true,
            data: {
                form: {
                    id: form._id,
                    title: form.title,
                    description: form.metadata?.description || "",
                    schema: form.formSchema,
                    createdAt: form.createdAt,
                },
            },
        });
    } catch (error) {
        console.error('Get public form error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch form',
        });
    }
});

/**
 * POST /api/public/form/:shareableId/submit
 * Submit form response (no authentication required)
 */
router.post(
    '/form/:shareableId/submit',
    [
        body('responses')
            .isObject()
            .withMessage('Responses must be an object'),
    ],
    async (req: Request, res: Response) => {
        try {
            // Validate input
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array(),
                });
            }

            const { shareableId } = req.params;
            const { responses, imageUrls = [] } = req.body;

            // Find form
            const form = await Form.findOne({ shareableId });

            if (!form) {
                return res.status(404).json({
                    success: false,
                    message: 'Form not found',
                });
            }

            // Validate responses against schema
            const validationErrors: string[] = [];

            form.formSchema.fields.forEach((field: any) => {
                const value = responses[field.id];

                // Check required fields
                if (field.required && (value === undefined || value === null || value === '')) {
                    validationErrors.push(`Field "${field.label}" is required`);
                }

                // Validate field types
                if (value !== undefined && value !== null && value !== '') {
                    switch (field.type) {
                        case 'email':
                            if (!/^\S+@\S+\.\S+$/.test(value)) {
                                validationErrors.push(`Field "${field.label}" must be a valid email`);
                            }
                            break;
                        case 'number':
                            if (isNaN(Number(value))) {
                                validationErrors.push(`Field "${field.label}" must be a number`);
                            }
                            if (field.validation?.min !== undefined && Number(value) < field.validation.min) {
                                validationErrors.push(`Field "${field.label}" must be at least ${field.validation.min}`);
                            }
                            if (field.validation?.max !== undefined && Number(value) > field.validation.max) {
                                validationErrors.push(`Field "${field.label}" must be at most ${field.validation.max}`);
                            }
                            break;
                        case 'tel':
                            if (!/^[0-9+\-\s()]+$/.test(value)) {
                                validationErrors.push(`Field "${field.label}" must be a valid phone number`);
                            }
                            break;
                        case 'url':
                            try {
                                new URL(value);
                            } catch {
                                validationErrors.push(`Field "${field.label}" must be a valid URL`);
                            }
                            break;
                    }

                    // Validate length
                    if (typeof value === 'string') {
                        if (field.validation?.minLength && value.length < field.validation.minLength) {
                            validationErrors.push(`Field "${field.label}" must be at least ${field.validation.minLength} characters`);
                        }
                        if (field.validation?.maxLength && value.length > field.validation.maxLength) {
                            validationErrors.push(`Field "${field.label}" must be at most ${field.validation.maxLength} characters`);
                        }
                    }
                }
            });

            if (validationErrors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: validationErrors,
                });
            }

            // Create submission
            const submission = new FormSubmission({
                formId: form._id,
                responses,
                imageUrls: Array.isArray(imageUrls) ? imageUrls : [],
            });

            await submission.save();

            console.log(`✅ Form submission created: ${submission._id}`);

            res.status(201).json({
                success: true,
                message: 'Form submitted successfully',
                data: {
                    submissionId: submission._id,
                },
            });
        } catch (error) {
            console.error('Form submission error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to submit form',
            });
        }
    }
);

export default router;
