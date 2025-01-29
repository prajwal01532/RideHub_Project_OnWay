import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Register new user
export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, nationality, mobileNumber } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !password || !nationality || !mobileNumber) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Create new user
        const user = new User({
            firstName,
            lastName,
            email,
            password,
            nationality,
            mobileNumber
        });

        await user.save();

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: {
                token,
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    nationality: user.nationality,
                    mobileNumber: user.mobileNumber,
                    isAdmin: user.isAdmin
                }
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle password validation error
        if (error.message.includes('Password must be')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        // Handle mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again.'
        });
    }
};

// Login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    nationality: user.nationality,
                    mobileNumber: user.mobileNumber,
                    isAdmin: user.isAdmin
                }
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed. Please try again later.'
        });
    }
};

// Admin login
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find admin user
        const user = await User.findOne({ email, isAdmin: true });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid admin credentials'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid admin credentials'
            });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            success: true,
            message: 'Admin login successful',
            data: {
                token,
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    nationality: user.nationality,
                    mobileNumber: user.mobileNumber,
                    isAdmin: user.isAdmin
                }
            }
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Admin login failed'
        });
    }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password') // Exclude password field
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch users'
    });
  }
};

// Block/Unblock user
export const blockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isBlocked } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isBlocked = isBlocked;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
      data: user
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update user status'
    });
  }
};

// Change password
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Check if new password is same as current password
        const isSamePassword = await user.comparePassword(newPassword);
        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                message: 'New password must be different from current password'
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        
        if (error.message.includes('Password must be')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to change password. Please try again.'
        });
    }
};

// Delete account
export const deleteAccount = async (req, res) => {
    try {
        const { password } = req.body;
        const userId = req.user._id;

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Incorrect password'
            });
        }

        // Delete user
        await User.findByIdAndDelete(userId);

        res.json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete account. Please try again.'
        });
    }
};