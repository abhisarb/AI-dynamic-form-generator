import express, { Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { FormSubmission } from '../models/FormSubmission';
import { Form } from '../models/Form';

const router = express.Router();

/**
 * GET /api/submissions/form/:formId
 * Get all submissions for a specific form
 */
router.get(
    '/form/:formId',
    authenticate,
    async (req: AuthRequest, res: Response) => {
        try {
            const { formId } = req.params;
            const userId = req.userId!;

            // Verify form belongs to user
            const form = await Form.findOne({ _id: formId, userId });

            if (!form) {
                return res.status(404).json({
                    success: false,
                    message: 'Form not found',
                });
            }

            // Get all submissions for this form
            const submissions = await FormSubmission.find({ formId })
                .sort({ submittedAt: -1 })
                .select('-__v');

            res.json({
                success: true,
                data: {
                    form: {
                        id: form._id,
                        title: form.title,
                    },
                    submissions,
                    count: submissions.length,
                },
            });
        } catch (error) {
            console.error('Get submissions error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch submissions',
            });
        }
    }
);

/**
 * GET /api/submissions/user
 * Get all submissions for all user's forms
 */
router.get('/user', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId!;

        // Get all user's forms
        const forms = await Form.find({ userId }).select('_id title');

        if (forms.length === 0) {
            return res.json({
                success: true,
                data: {
                    submissions: [],
                    count: 0,
                },
            });
        }

        const formIds = forms.map((f) => f._id);

        // Get all submissions for user's forms
        const submissions = await FormSubmission.find({
            formId: { $in: formIds },
        })
            .sort({ submittedAt: -1 })
            .populate('formId', 'title')
            .select('-__v');

        res.json({
            success: true,
            data: {
                submissions,
                count: submissions.length,
            },
        });
    } catch (error) {
        console.error('Get user submissions error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch submissions',
        });
    }
});

export default router;
