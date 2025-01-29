import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        // Set both user object and userId for flexibility
        req.user = user;
        req.userId = user._id;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }
        return res.status(401).json({
            success: false,
            message: 'Authentication failed'
        });
    }
};

export const verifyAdmin = async (req, res, next) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error verifying admin status'
        });
    }
};