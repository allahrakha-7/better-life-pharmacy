import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'better_life_secret');

            if (decoded.id === 'static_admin_id_12345') {
                req.user = {
                    _id: 'static_admin_id_12345',
                    name: 'System Admin',
                    email: 'admin@betterlife.com',
                    role: 'admin'
                };
                return next();
            }

            req.user = await User.findById(decoded.id).select('-password');
            return next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    } else {
        return res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

export const optionalProtect = async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'better_life_secret');

            if (decoded.id === 'static_admin_id_12345') {
                req.user = {
                    _id: 'static_admin_id_12345',
                    name: 'System Admin',
                    email: 'admin@betterlife.com',
                    role: 'admin'
                };
            } else {
                req.user = await User.findById(decoded.id).select('-password');
            }
        } catch (error) {
            // Silence token verification errors to continue as guest
        }
    }
    next();
};
