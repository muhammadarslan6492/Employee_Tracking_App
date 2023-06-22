import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    value: ['Available', 'OnTask'],
    default: 'Available',
  },
  reportsTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  lat: Number,
  lng: Number,
});

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
