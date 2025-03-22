import { Item } from '@/models/Item'

export type OrderItem = {
    orderItems: {
        item: Item
        quantity: number
    }[]
    totalAmount: number
    createdAt?: Date
    updatedAt?: Date
}
