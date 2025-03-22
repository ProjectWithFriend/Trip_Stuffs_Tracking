import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import UserSchema from '@/models/User'

export async function GET() {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI!)
        }

        // const users = await UserSchema.find().populate('orders').exec()

        const users = await UserSchema.find()
            // .populate({
            //     path: 'orders',
            //     populate: {
            //         path: 'orderItems.item', // Populating the item within orderItems
            //         model: 'Item', // Populate with the Item model
            //     },
            // })
            .exec()

        return NextResponse.json(users)
    } catch (error) {
        console.error('Error retrieving users:', error)
        return NextResponse.json(
            { error: 'Failed to retrieve users' },
            { status: 500 }
        )
    }
}
