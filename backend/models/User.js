import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  nationality: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  countryCode: { type: String, default: '+977' },
  isAdmin: { type: Boolean, default: false },
  notifications: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: true },
    promotions: { type: Boolean, default: true }
  },
  preferredCurrency: { type: String, enum: ['NPR', 'USD', 'EUR'], default: 'NPR' },
  language: { type: String, enum: ['en', 'ne'], default: 'en' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    // Validate password before hashing
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(this.password)) {
      throw new Error('Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character');
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

export default mongoose.model('User', userSchema);