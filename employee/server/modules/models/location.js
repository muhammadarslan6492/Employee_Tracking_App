import mongoose from 'mongoose';

const locationSchema = mongoose.Schema({
  location: [
    {
      lat: Number,
      lng: Number,
    },
  ],
  employee: {
    type: mongoose.Types.ObjectId,
    ref: 'Employee',
  },
  task: {
    type: mongoose.Types.ObjectId,
    ref: 'Task',
  },
});

const location = mongoose.model('Location', locationSchema);

export default location;
