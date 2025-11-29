import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { config } from '../config/config';

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post(
    '/register',
    [
        body('email')
            .isEmail()
            .withMessage('Please provide a valid email')
            .normalizeEmail(),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long'),
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

            const { email, password } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User with this email already exists',
                });
            }

            // Create new user
            const user = new User({
                email,
                password, // Will be hashed by pre-save middleware
            });

            await user.save();

            // Generate JWT token
            const token = jwt.sign(
                { userId: user._id.toString() },
                config.jwtSecret,
                { expiresIn: config.jwtExpiresIn as any }
            );

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    token,
                    user: {
                        id: user._id,
                        email: user.email,
                    },
                },
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to register user',
            });
        }
    }
);

/**
 * POST /api/auth/login
 * Login user
 */
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('password').notEmpty().withMessage('Password is required'),
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

            const { email, password } = req.body;

            // Find user
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password',
                });
            }

            // Check password
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password',
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user._id.toString() },
                config.jwtSecret,
                { expiresIn: config.jwtExpiresIn as any }
            );

            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    token,
                    user: {
                        id: user._id,
                        email: user.email,
                    },
                },
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to login',
            });
        }
    }
);

export default router;
