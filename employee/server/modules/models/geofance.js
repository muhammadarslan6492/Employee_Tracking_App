import mongoose from 'mongoose';

const geofenceSchema = new mongoose.Schema({
  address: String,
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
  },
  radius: { type: Number, required: true },
  status: {
    type: String,
    vaue: ['OPEN', 'CLOSED'],
    default: 'OPEN',
  },
});

geofenceSchema.index({ location: '2dsphere' });

const Geofence = mongoose.model('Geofence', geofenceSchema);

export default Geofence;
