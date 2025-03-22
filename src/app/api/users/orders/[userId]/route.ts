import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import UserSchema from '@/models/User'
// Import all models to ensure they're registered
import '@/models/Order'
import '@/models/OrderItem'
import '@/models/Item'

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<Record<string, string>> }
) {
    try {
        const { userId } = await params // Access the userId from the URL params
        if (typeof userId !== 'string') {
            return NextResponse.json(
                { error: 'Invalid userId' },
                { status: 400 }
            )
        }

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            )
        }

        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI!)
        }

        // Query the user by userId and populate the orders and items
        const user = await UserSchema.findById(userId)
            .populate({
                path: 'orders',
                populate: {
                    path: 'orderItems',
                    populate: {
                        path: 'item',
                    },
                },
            })
            .exec()

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(user)
    } catch (error) {
        console.error('Error retrieving user:', error)
        return NextResponse.json(
            { error: 'Failed to retrieve user' },
            { status: 500 }
        )
    }
}
