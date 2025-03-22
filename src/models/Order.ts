import mongoose, { Schema } from 'mongoose'
import OrderItemSchema from './OrderItem'
import { Item } from './Item'

export interface Order {
    orderItems: {
        item: Item
        quantity: number
    }[]
    totalAmount: number
    createdAt?: Date
    updatedAt?: Date
}

export const OrderSchema = new Schema<Order>(
    {
        orderItems: {
            type: [OrderItemSchema],
            required: true,
        },
        totalAmount: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
)

export default mongoose.models.Order ||
    mongoose.model<Order>('Order', OrderSchema)
