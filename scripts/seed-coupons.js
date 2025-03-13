const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env.local file');
    process.exit(1);
}

// Define Coupon Schema
const CouponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    usageLimit: {
        type: Number,
        required: true,
    },
    usageCount: {
        type: Number,
        default: 0,
    }
});

const coupons = [
    {
        code: 'SAVE10',
        usageLimit: 100,
        expiresAt: new Date('2025-12-31'),
        isActive: true
    },
    {
        code: 'SAVE20',
        usageLimit: 50,
        expiresAt: new Date('2025-12-31'),
        isActive: true
    },
    {
        code: 'SPRING25',
        usageLimit: 75,
        expiresAt: new Date('2025-12-31'),
        isActive: true
    },
    {
        code: 'SUMMER20',
        usageLimit: 60,
        expiresAt: new Date('2025-12-31'),
        isActive: true
    }
];

async function seedCoupons() {
    try {
        console.log('Connecting to MongoDB...');
        const sanitizedUri = MONGODB_URI.replace(
            /mongodb\+srv:\/\/([^:]+):([^@]+)@/,
            'mongodb+srv://****:****@'
        );
        console.log('URI:', sanitizedUri);
        
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB successfully!');

        const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);

        console.log('Clearing existing coupons...');
        await Coupon.deleteMany({});
        console.log('Cleared existing coupons');

        console.log('Inserting new coupons...');
        for (const coupon of coupons) {
            await Coupon.create(coupon);
            console.log(`Created coupon: ${coupon.code}`);
        }

        console.log('Seeding completed successfully!');
    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
        process.exit();
    }
}

// Run the seed function
seedCoupons();