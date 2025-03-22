import mongoose, { Document, Schema } from 'mongoose'
import { Order } from './Order'

export interface User extends Document {
    _id: string
    name: string
    orders: Order[]
}

export const UserSchema = new Schema<User>({
    name: {
        type: String,
        required: true,
    },
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
        },
    ],
})

export default mongoose.models.User || mongoose.model<User>('User', UserSchema)
