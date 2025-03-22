import { Item } from '@/models/Item'
import { Card, List, Typography } from 'antd'
import React from 'react'

const { Text } = Typography

export default function ItemList({
    items,
}: {
    items: {
        item: Item
        quantity: number
    }[]
}) {
    return (
        <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
            dataSource={items}
            renderItem={(item) => (
                <List.Item>
                    <Card hoverable className="shadow-sm">
                        <div className="flex justify-between items-center">
                            <div>
                                <Text strong>{item.item.name_th}</Text>
                                <div>
                                    <Text type="secondary">
                                        Quantity: {item.quantity}
                                    </Text>
                                </div>
                            </div>
                            <div>
                                <Text className="text-lg font-bold text-blue-500">
                                    {(
                                        item.item.cost * item.quantity
                                    ).toLocaleString('en-US', {
                                        style: 'currency',
                                        currency: 'THB',
                                    })}
                                </Text>
                            </div>
                        </div>
                    </Card>
                </List.Item>
            )}
        />
    )
}
