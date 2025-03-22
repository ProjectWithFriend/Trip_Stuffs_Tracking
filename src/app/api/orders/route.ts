import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import OrderSchema from '@/models/Order'
import ItemSchema from '@/models/Item'

interface OrderItemRequest {
    itemId: string
    quantity: number
}

interface CreateOrderRequest {
    orderItems: OrderItemRequest[]
    userId: string
}

export async function POST(req: Request) {
    try {
        const { orderItems, userId }: CreateOrderRequest = await req.json()

        const validOrderItems = await Promise.all(
            orderItems.map(
                async (orderItem: { itemId: string; quantity: number }) => {
                    const item = await ItemSchema.findById(orderItem.itemId)
                    if (!item) {
                        throw new Error(
                            `Item with ID ${orderItem.itemId} not found`
                        )
                    }
                    const itemCost = item.cost * orderItem.quantity
                    return {
                        item: item._id,
                        quantity: orderItem.quantity,
                        totalCost: itemCost,
                    }
                }
            )
        )

        const totalAmount = validOrderItems.reduce(
            (acc, orderItem) => acc + orderItem.totalCost,
            0
        )

        const newOrderItems = validOrderItems.map(({ item, quantity }) => ({
            item,
            quantity,
        }))

        const newOrder = new OrderSchema({
            // orderItems: validOrderItems,
            orderItems: newOrderItems,
            totalAmount,
        })

        await newOrder.save()

        // Add the new order to the user's `orders` array if needed
        const user = await mongoose.models.User.findById(userId)
        if (user) {
            user.orders.push(newOrder)
            await user.save()
        }

        return NextResponse.json(newOrder)
    } catch (error) {
        console.error('Error creating order:', error)
        return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
        )
    }
}
