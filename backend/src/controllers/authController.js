import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'better_life_secret', {
        expiresIn: '30d'
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone || '',
                shippingAddress: user.shippingAddress || '',
                allergies: user.allergies || '',
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const authUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Static Admin Account credentials
        if (email === 'admin@betterlife.com' && password === 'admin1234@') {
            return res.json({
                _id: 'static_admin_id_12345',
                name: 'System Admin',
                email: 'admin@betterlife.com',
                role: 'admin',
                phone: '0800-BETTER-LIFE',
                shippingAddress: 'Better Life Head Office, Islamabad',
                allergies: 'None',
                token: generateToken('static_admin_id_12345')
            });
        }

        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone || '',
                shippingAddress: user.shippingAddress || '',
                allergies: user.allergies || '',
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone || '',
                shippingAddress: user.shippingAddress || '',
                allergies: user.allergies || ''
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
            user.shippingAddress = req.body.shippingAddress !== undefined ? req.body.shippingAddress : user.shippingAddress;
            user.allergies = req.body.allergies !== undefined ? req.body.allergies : user.allergies;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                phone: updatedUser.phone || '',
                shippingAddress: updatedUser.shippingAddress || '',
                allergies: updatedUser.allergies || '',
                token: generateToken(updatedUser._id)
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Forgot password request (Generates OTP)
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Block static admin account
        if (email === 'admin@betterlife.com') {
            return res.status(400).json({ message: 'System Admin account cannot be reset.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'No user registered with this email address.' });
        }

        // Generate a 6-digit OTP code
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        console.log(`[PASSWORD RESET OTP for ${email}]: ${otp}`);
        
        res.json({ 
            message: 'A 6-digit OTP code has been generated.',
            otp: otp
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reset password using OTP
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (!user.resetPasswordOTP || user.resetPasswordOTP !== otp) {
            return res.status(400).json({ message: 'Invalid OTP code.' });
        }

        if (user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ message: 'OTP code has expired.' });
        }

        // Update password and clear OTP fields
        user.password = newPassword;
        user.resetPasswordOTP = '';
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: 'Password has been reset successfully. You can now log in.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
