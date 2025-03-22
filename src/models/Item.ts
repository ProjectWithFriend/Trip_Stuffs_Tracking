import mongoose, { Document, Schema } from 'mongoose'

export interface Item extends Document {
    _id: string
    name_th: string
    name_en: string
    cost: number
    type: 'ALCOHOLIC_BEVERAGE' | 'NON_ALCOHOLIC_BEVERAGE' | 'SNACK'
    initial_quantity: number
    // quantity: number
    createdAt: Date
    updatedAt: Date
    remainingQuantity: number
}

export const ItemSchema = new Schema<Item>(
    {
        name_th: {
            type: String,
            required: true,
        },
        name_en: {
            type: String,
            required: true,
        },
        cost: {
            type: Number,
            required: true,
        },
        type: {
            type: String,
            enum: ['ALCOHOLIC', 'NON_ALCOHOLIC_BEVERAGE', 'SNACK'],
            required: true,
        },
        initial_quantity: {
            type: Number,
            required: true,
        },
        // quantity: {
        //     type: Number,
        //     required: true,
        // },
    },
    { timestamps: true }
)

export default mongoose.models.Item || mongoose.model<Item>('Item', ItemSchema)
