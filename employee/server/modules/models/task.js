import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low',
  },
  status: {
    type: String,
    enum: ['pending', 'in progress', 'completed'],
    default: 'pending',
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
  },
  geofence: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Geofence',
  },
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
