import dotenv from 'dotenv';

dotenv.config();

export const config = {
    // Server
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',

    // MongoDB
    mongodbUri: process.env.MONGODB_URI || '',

    // JWT
    jwtSecret: process.env.JWT_SECRET || 'default-secret-change-in-production',
    jwtExpiresIn: '7d',

    // Google Gemini
    geminiApiKey: process.env.GEMINI_API_KEY || '',

    // Pinecone
    pineconeApiKey: process.env.PINECONE_API_KEY || '',
    pineconeEnvironment: process.env.PINECONE_ENVIRONMENT || '',
    pineconeIndexName: process.env.PINECONE_INDEX_NAME || 'form-embeddings',

    // Cloudinary
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
        apiKey: process.env.CLOUDINARY_API_KEY || '',
        apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    },

    // CORS
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
};

// Validate required environment variables
const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'GEMINI_API_KEY',
    'PINECONE_API_KEY',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
];

export const validateConfig = () => {
    const missing = requiredEnvVars.filter(
        (varName) => !process.env[varName]
    );

    if (missing.length > 0) {
        console.warn(
            `⚠️  Missing environment variables: ${missing.join(', ')}`
        );
        console.warn('Please create a .env file based on .env.example');
    }
};
