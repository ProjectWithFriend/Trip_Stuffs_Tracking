import { NextResponse } from 'next/server'

// Mock data for the API
const users = [
    {
        id: '1',
        name: 'John Doe',
        items: [
            { id: '101', name: 'Coke', quantity: 1, price: 13 },
            { id: '102', name: 'Chips', quantity: 2, price: 8 },
            { id: '103', name: 'Sandwich', quantity: 1, price: 22 },
        ],
    },
    {
        id: '2',
        name: 'Jane Smith',
        items: [
            { id: '201', name: 'Water', quantity: 3, price: 5 },
            { id: '202', name: 'Chocolate', quantity: 2, price: 10 },
            { id: '203', name: 'Sunscreen', quantity: 1, price: 25 },
        ],
    },
    {
        id: '3',
        name: 'Mike Johnson',
        items: [
            { id: '301', name: 'Beer', quantity: 6, price: 18 },
            { id: '302', name: 'Snacks', quantity: 4, price: 12 },
            { id: '303', name: 'Hat', quantity: 1, price: 15 },
        ],
    },
]

export async function GET() {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json(users)
}
