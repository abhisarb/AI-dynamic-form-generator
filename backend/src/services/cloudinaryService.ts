import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config/config';

let isConfigured = false;

/**
 * Initialize Cloudinary configuration
 */
export const initCloudinary = () => {
    if (isConfigured) {
        return;
    }

    cloudinary.config({
        cloud_name: config.cloudinary.cloudName,
        api_key: config.cloudinary.apiKey,
        api_secret: config.cloudinary.apiSecret,
    });

    isConfigured = true;
    console.log('✅ Cloudinary configured');
};

/**
 * Upload image to Cloudinary
 */
export const uploadImage = async (
    fileBuffer: Buffer,
    options: {
        folder?: string;
        filename?: string;
    } = {}
): Promise<{
    url: string;
    publicId: string;
    width: number;
    height: number;
}> => {
    initCloudinary();

    try {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: options.folder || 'ai-form-generator',
                    public_id: options.filename,
                    resource_type: 'image',
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else if (result) {
                        resolve({
                            url: result.secure_url,
                            publicId: result.public_id,
                            width: result.width,
                            height: result.height,
                        });
                    } else {
                        reject(new Error('Upload failed: no result'));
                    }
                }
            );

            uploadStream.end(fileBuffer);
        });
    } catch (error) {
        console.error('❌ Failed to upload image to Cloudinary:', error);
        throw error;
    }
};

/**
 * Delete image from Cloudinary
 */
export const deleteImage = async (publicId: string): Promise<void> => {
    initCloudinary();

    try {
        await cloudinary.uploader.destroy(publicId);
        console.log(`✅ Deleted image: ${publicId}`);
    } catch (error) {
        console.error('❌ Failed to delete image from Cloudinary:', error);
        throw error;
    }
};

/**
 * Validate image file
 */
export const validateImageFile = (
    file: Express.Multer.File
): { valid: boolean; error?: string } => {
    // Check file type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
        return {
            valid: false,
            error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.',
        };
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        return {
            valid: false,
            error: 'File size exceeds 5MB limit.',
        };
    }

    return { valid: true };
};
