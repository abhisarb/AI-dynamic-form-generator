import express, { Request, Response } from 'express';
import multer from 'multer';
import { uploadImage, validateImageFile } from '../services/cloudinaryService';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});

/**
 * POST /api/upload/image
 * Upload image to Cloudinary
 */
router.post(
    '/image',
    upload.single('image'),
    async (req: Request, res: Response) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No image file provided',
                });
            }

            // Validate image file
            const validation = validateImageFile(req.file);
            if (!validation.valid) {
                return res.status(400).json({
                    success: false,
                    message: validation.error,
                });
            }

            // Upload to Cloudinary
            const result = await uploadImage(req.file.buffer, {
                folder: 'ai-form-generator',
            });

            res.json({
                success: true,
                message: 'Image uploaded successfully',
                data: {
                    url: result.url,
                    publicId: result.publicId,
                    width: result.width,
                    height: result.height,
                },
            });
        } catch (error) {
            console.error('Image upload error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to upload image',
            });
        }
    }
);

export default router;
