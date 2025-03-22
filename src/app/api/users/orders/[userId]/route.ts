import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import UserSchema from '@/models/User'

export async function GET(
    req: Request,
    { params }: { params: { userId: string } }
) {
    try {
        const { userId } = params // Access the userId from the URL params

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
                    path: 'orderItems.item', // Populate the item within orderItems
                    model: 'Item', // Populate with the Item model
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
