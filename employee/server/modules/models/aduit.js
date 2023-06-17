import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
