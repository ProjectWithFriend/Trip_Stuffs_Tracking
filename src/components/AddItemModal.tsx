import React, { useEffect, useState } from 'react'
import { Modal, List, Button, Typography, Space, Form, message } from 'antd'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import { Item } from '@/models/Item'
const { Text } = Typography

// Updated Item interface to match your definition
interface OrderItemRequest {
    itemId: string
    quantity: number
}

interface AddItemModalProps {
    userId: string
    visible: boolean
    onClose: () => void
    onOrderCreated?: () => void
}

export default function AddItemModal({
    userId,
    visible,
    onClose,
    onOrderCreated
}: AddItemModalProps) {
    const [items, setItems] = useState<Item[]>([])
    const [selectedItems, setSelectedItems] = useState<Record<string, number>>(
        {}
    )

    const [loading, setLoading] = useState<boolean>(false)
    const [submitting, setSubmitting] = useState<boolean>(false)
    const [form] = Form.useForm()

    const fetchItems = async (updateLoading = true) => {
        try {
            if (updateLoading) setLoading(true)
            const response = await fetch('/api/items')
            const data = await response.json()
            setItems(data)
        } catch (error) {
            console.error('Failed to fetch items:', error)
            message.error('Failed to load items')
        } finally {
            if (updateLoading) setLoading(false)
        }
    }

    useEffect(() => {
        if (visible) {
            fetchItems()
            setSelectedItems({}) // Reset selections when modal opens
            form.resetFields()
        }
    }, [visible, form])

    const increaseItem = (itemId: string) => {
        setSelectedItems((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1,
        }))
    }

    const decreaseItem = (itemId: string) => {
        setSelectedItems((prev) => {
            const newQuantity = Math.max(0, (prev[itemId] || 0) - 1)
            const newItems = { ...prev }

            if (newQuantity === 0) {
                delete newItems[itemId]
                return newItems
            }

            return {
                ...newItems,
                [itemId]: newQuantity,
            }
        })
    }

    const handleSubmit = async () => {
        try {
            setSubmitting(true)

            // Format selected items to match the API spec exactly
            const orderItems: OrderItemRequest[] = Object.entries(selectedItems)
                .filter(([_, quantity]) => quantity > 0)
                .map(([itemId, quantity]) => ({
                    itemId,
                    quantity,
                }))

            if (orderItems.length === 0) {
                message.warning('Please select at least one item')
                setSubmitting(false)
                return
            }

            // Submit the order to your API according to the API spec
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderItems,
                    userId,
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to create order')
            }

            message.success('Order created successfully')

            await fetchItems(false)

            if (onOrderCreated) {
                await onOrderCreated();
            }

            onClose()
        } catch (error) {
            console.error('Error creating order:', error)
            message.error(
                error instanceof Error
                    ? error.message
                    : 'Failed to create order'
            )
        } finally {
            setSubmitting(false)
        }
    }

    const onFinish = () => {
        handleSubmit()
    }

    // Group items by type for better organization
    const groupedItems = items.reduce((acc, item) => {
        if (!acc[item.type]) {
            acc[item.type] = []
        }
        acc[item.type].push(item)
        return acc
    }, {} as Record<string, Item[]>)

    // Map type to display name
    const typeDisplayNames = {
        ALCOHOLIC_BEVERAGE: 'Alcoholic Beverages',
        NON_ALCOHOLIC_BEVERAGE: 'Non-Alcoholic Beverages',
        SNACK: 'Snacks',
    }

    return (
        <Modal
            title="Add Items to Order"
            open={visible}
            onCancel={onClose}
            footer={null}
            maskClosable={!submitting}
            closable={!submitting}
            width={600}
        >
            <Form form={form} onFinish={onFinish} layout="vertical">
                {Object.entries(groupedItems).map(([type, typeItems]) => (
                    <div key={type} className="mb-6">
                        <Text strong className="text-lg mb-2 block">
                            {
                                typeDisplayNames[
                                    type as keyof typeof typeDisplayNames
                                ]
                            }
                        </Text>
                        <List
                            loading={loading}
                            dataSource={typeItems}
                            renderItem={(item) => (
                                <List.Item>
                                    <div className="flex justify-between items-center w-full">
                                        <div>
                                            <Text strong>{item.name_en}</Text>
                                            <div>
                                                <Text type="secondary">
                                                    {item.name_th}
                                                </Text>
                                            </div>
                                            <div>
                                                <Text type="secondary">
                                                    Available:{' '}
                                                    {item.remainingQuantity}
                                                </Text>
                                            </div>
                                        </div>
                                        <Space>
                                            <Button
                                                icon={<MinusOutlined />}
                                                onClick={() =>
                                                    decreaseItem(item._id)
                                                }
                                                disabled={
                                                    !selectedItems[item._id] ||
                                                    submitting
                                                }
                                            />
                                            <Text>
                                                {selectedItems[item._id] || 0}
                                            </Text>
                                            <Button
                                                icon={<PlusOutlined />}
                                                onClick={() =>
                                                    increaseItem(item._id)
                                                }
                                                disabled={
                                                    selectedItems[item._id] >=
                                                        item.remainingQuantity ||
                                                    submitting
                                                }
                                            />
                                        </Space>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </div>
                ))}

                <div
                    style={{
                        marginTop: 16,
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}
                >
                    <Button
                        onClick={onClose}
                        style={{ marginRight: 8 }}
                        disabled={submitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={submitting}
                        disabled={Object.keys(selectedItems).length === 0}
                    >
                        Create Order
                    </Button>
                </div>
            </Form>
        </Modal>
    )
}
