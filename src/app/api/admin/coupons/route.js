import { NextResponse } from 'next/server';
import dbConnect from '../../../../utils/dbConnect';
import Coupon from '../../../../models/coupon';

export async function POST(request) {
  try {
    await dbConnect();

    const data = await request.json();
    
    // Add validation here
    if (!data.code || !data.usageLimit || !data.expiresAt) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const coupon = new Coupon({
      code: data.code,
      usageLimit: data.usageLimit,
      expiresAt: new Date(data.expiresAt),
      isActive: true
    });

    await coupon.save();

    return NextResponse.json(
      { message: 'Coupon created successfully', coupon },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating coupon:', error);
    return NextResponse.json(
      { message: 'Failed to create coupon' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    
    const coupons = await Coupon.find({})
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json(coupons);
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json(
      { message: 'Failed to fetch coupons' },
      { status: 500 }
    );
  }
}