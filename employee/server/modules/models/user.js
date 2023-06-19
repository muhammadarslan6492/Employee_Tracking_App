import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['EMPLOYEE', 'ADMIN'],
    default: 'EMPLOYEE',
  },
  verify: {
    type: Boolean,
    default: false,
  },
  online: Boolean,
  pushToken: String,
  lastLogin: Date,
  block: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model('User', userSchema);

export default User;
