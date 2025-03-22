import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import ItemSchema from '@/models/Item'
import Order from '@/models/Order'
import { Item } from '@/models/Item'

export async function GET() {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI!)
        }

        const items: Item[] = await ItemSchema.find().lean<Item[]>().exec()

        const totalOrderedQuantities = await Order.aggregate([
          { $unwind: '$orderItems' },
          {
            $group: {
              _id: '$orderItems.item',
              totalQuantityOrdered: { $sum: '$orderItems.quantity' },
            },
          },
        ]);

        const itemOrderQuantities: { [key: string]: number } =
            totalOrderedQuantities.reduce(
                (
                    acc: { [key: string]: number },
                    { _id, totalQuantityOrdered }
                ) => {
                    acc[_id.toString()] = totalQuantityOrdered
                    return acc
                },
                {}
            )

        const itemsWithRemainingQuantity = items.map((item) => {
            const totalOrdered = itemOrderQuantities[item._id.toString()] || 0
            const remainingQuantity = item.initial_quantity - totalOrdered

            return {
                ...item,
                remainingQuantity,
            }
        })

        return NextResponse.json(itemsWithRemainingQuantity)
    } catch (error) {
        console.error('Error retrieving items:', error)
        return NextResponse.json(
            { error: 'Failed to retrieve items' },
            { status: 500 }
        )
    }
}
