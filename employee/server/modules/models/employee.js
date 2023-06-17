import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
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
  reportsTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
