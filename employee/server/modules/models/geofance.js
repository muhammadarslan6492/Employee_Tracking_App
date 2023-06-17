import mongoose from 'mongoose';

const geofenceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  coordinates: [
    {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
  ],
  radius: {
    type: Number,
    required: true,
  },
});

const Geofence = mongoose.model('Geofence', geofenceSchema);

export default Geofence;
