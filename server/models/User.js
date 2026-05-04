
import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({   
    fullName: {
    type: String,
    required: true,
    trim: true
  },
  idNumber: {
    type: String,
    required: true,
    unique: true
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['customer', 'staff'],
    default: 'customer'
  }}, { timestamps: true });
const User = mongoose.model('User', userSchema);
export default User;