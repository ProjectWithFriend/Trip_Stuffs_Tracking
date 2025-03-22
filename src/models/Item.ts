import mongoose from 'mongoose'

export interface Item {
    id: string
    name_th: string
    name_en: string
    const: number
    type: 'ALCOHOLIC' | 'NON_ALCOHOLIC_BEVERAGE' | 'SNACK'
    initial_quantity: number
    quantity: number
}

const ItemSchema = new mongoose.Schema(
    {
        name_th: {
            type: String,
            required: true,
        },
        name_en: {
            type: String,
            required: true,
        },
        const: {
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
        quantity: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

const Item = mongoose.models.Item || mongoose.model('Item', ItemSchema)

export default Item
