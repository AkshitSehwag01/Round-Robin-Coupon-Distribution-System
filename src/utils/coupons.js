import mongoose from 'mongoose';
import dbConnect from './dbConnect';
import Coupon from '../models/coupon';

const COOLDOWN_PERIOD = 600000; // 10 min in milliseconds

export const getCoupon = async () => {
  await dbConnect();

  // Get the next available coupon using $expr for field comparison
  const coupon = await Coupon.findOne({
    isActive: true,
    $expr: { $lt: ["$usageCount", "$usageLimit"] },
    expiresAt: { $gt: new Date() }
  }).sort({ usageCount: 1 });

  return coupon;
};

export const canClaimCoupon = async (ip, sessionId) => {
  await dbConnect();
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - COOLDOWN_PERIOD);

  // Check IP-based claims using MongoDB
  const ipClaim = await mongoose.connection.collection('claims').findOne({
    ipAddress: ip,
    claimedAt: { $gt: oneHourAgo }
  });

  if (ipClaim) {
    const timeRemaining = Math.ceil(
      (COOLDOWN_PERIOD - (now - ipClaim.claimedAt)) / 60000
    );
    return {
      allowed: false,
      timeRemaining: `${timeRemaining} minute${timeRemaining !== 1 ? 's' : ''}`
    };
  }

  // Check session-based claims
  const sessionClaim = await mongoose.connection.collection('claims').findOne({
    sessionId: sessionId,
    claimedAt: { $gt: oneHourAgo }
  });

  if (sessionClaim) {
    const timeRemaining = Math.ceil(
      (COOLDOWN_PERIOD - (now - sessionClaim.claimedAt)) / 60000
    );
    return {
      allowed: false,
      timeRemaining: `${timeRemaining} minute${timeRemaining !== 1 ? 's' : ''}`
    };
  }

  return { allowed: true };
};

export const recordClaim = async (ip, sessionId, couponId) => {
  await dbConnect();

  // Record claim in MongoDB
  await mongoose.connection.collection('claims').insertOne({
    couponId,
    ipAddress: ip,
    sessionId,
    claimedAt: new Date()
  });

  // Update coupon usage count
  await Coupon.findByIdAndUpdate(couponId, {
    $inc: { usageCount: 1 }
  });
};