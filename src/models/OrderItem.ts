import mongoose, { Schema } from 'mongoose'

export interface OrderItem extends Document {
    item: mongoose.Types.ObjectId
    quantity: number
}

const OrderItemSchema = new Schema<OrderItem>(
    {
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
    },
    { _id: false }
)

export default mongoose.models.OrderItem ||
    mongoose.model<OrderItem>('OrderItem', OrderItemSchema)
