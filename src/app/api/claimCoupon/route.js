import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import dbConnect from '../../../utils/dbConnect';
import { getCoupon, canClaimCoupon, recordClaim } from '../../../utils/coupons';

export async function POST(request) {
  try {
    await dbConnect();

    // Get client IP
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';

    // Get or set session ID from cookies
    const cookieStore = cookies();
    const sessionCookie = await cookieStore.get('sessionId');
    let sessionId = sessionCookie?.value;
    
    if (!sessionId) {
      sessionId = uuidv4();
    }

    // Check if user can claim
    const canClaim = await canClaimCoupon(ip, sessionId);
    if (!canClaim.allowed) {
      return NextResponse.json(
        { message: `Please wait ${canClaim.timeRemaining} before claiming another coupon` },
        { status: 429 }
      );
    }

    // Get next coupon
    const coupon = await getCoupon();
    if (!coupon) {
      return NextResponse.json(
        { message: 'No coupons available at the moment' },
        { status: 503 }
      );
    }

    // Record the claim
    await recordClaim(ip, sessionId, coupon._id);

    // Create response
    const response = NextResponse.json(
      { 
        message: `Successfully claimed coupon: ${coupon.code}`,
        coupon: coupon.code
      },
      { status: 200 }
    );

    // Set cookie if it doesn't exist
    if (!sessionCookie) {
      response.cookies.set('sessionId', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
    }

    return response;

  } catch (error) {
    console.error('Coupon claim error:', error);
    return NextResponse.json(
      { message: 'Internal server error while processing your request' },
      { status: 500 }
    );
  }
}