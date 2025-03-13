import mongoose from 'mongoose';

const ClaimSchema = new mongoose.Schema({
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  sessionId: {
    type: String,
    required: true,
  },
  claimedAt: {
    type: Date,
    default: Date.now,
  }
});

// Index for quick lookups
ClaimSchema.index({ ipAddress: 1, claimedAt: -1 });
ClaimSchema.index({ sessionId: 1, claimedAt: -1 });

export default mongoose.models.Claim || mongoose.model('Claim', ClaimSchema);