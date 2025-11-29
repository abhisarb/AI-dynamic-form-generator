import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

export interface AuthRequest extends Request {
    userId?: string;
}

/**
 * Middleware to verify JWT token and authenticate user
 */
export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided. Please log in.',
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };

        // Attach userId to request
        req.userId = decoded.userId;

        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                success: false,
                message: 'Token expired. Please log in again.',
            });
        }

        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. Please log in again.',
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Authentication failed.',
        });
    }
};
