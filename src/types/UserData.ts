import { OrderItem } from './Order'

export interface UserData {
    _id: string
    name: string
    orders: OrderItem[]
}
