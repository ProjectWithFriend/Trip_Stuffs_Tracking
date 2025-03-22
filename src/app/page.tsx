'use client'

import { useEffect, useState } from 'react'
import {
    Select,
    List,
    Card,
    Typography,
    Layout,
    Space,
    Modal,
    Badge,
    Avatar,
    Button,
    Form,
    Input,
    InputNumber,
} from 'antd'
import {
    ShoppingOutlined,
    UserOutlined,
    PlusOutlined,
    MinusOutlined,
} from '@ant-design/icons'

// Define types
interface Item {
    id: string
    name: string
    quantity: number
    price: number
}

interface User {
    id: string
    name: string
    items: Item[]
}

const { Header, Content } = Layout
const { Title, Text } = Typography

export default function Home() {
    const [users, setUsers] = useState<User[]>([])
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [form] = Form.useForm()

    useEffect(() => {
        async function fetchUsers() {
            try {
                setLoading(true)
                const response = await fetch('/api/users')
                const data = await response.json()
                setUsers(data)
                setLoading(false)
            } catch (error) {
                console.error('Failed to fetch users:', error)
                setLoading(false)
            }
        }
        fetchUsers()
    }, [])

    const handleUserChange = (userId: string) => {
        const user = users.find((user) => user.id === userId)
        setSelectedUser(user || null)
    }

    const totalItems =
        selectedUser?.items.reduce((sum, item) => sum + item.quantity, 0) || 0

    const showModal = () => {
        setIsModalVisible(true)
    }

    const handleOk = () => {
        form.validateFields().then((values) => {
            if (selectedUser) {
                const newItem: Item = {
                    id: `${Date.now()}`,
                    name: values.name,
                    quantity: values.quantity,
                    price: values.price,
                }
                const updatedUser = {
                    ...selectedUser,
                    items: [...selectedUser.items, newItem],
                }
                setSelectedUser(updatedUser)
                setIsModalVisible(false)
                form.resetFields()
            }
        })
    }

    const handleCancel = () => {
        setIsModalVisible(false)
    }

    const increaseQuantity = (itemId: string) => {
        if (selectedUser) {
            const updatedItems = selectedUser.items.map((item) =>
                item.id === itemId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
            setSelectedUser({ ...selectedUser, items: updatedItems })
        }
    }

    const decreaseQuantity = (itemId: string) => {
        if (selectedUser) {
            const updatedItems = selectedUser.items.map((item) =>
                item.id === itemId && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
            setSelectedUser({ ...selectedUser, items: updatedItems })
        }
    }

    return (
        <Layout className="min-h-screen">
            <Header className="flex items-center px-4 bg-blue-500 shadow-md">
                <Space align="center" className="w-full">
                    <ShoppingOutlined
                        className="text-2xl text-white"
                        style={{ color: 'white' }}
                    />

                    <Select
                        loading={loading}
                        className="w-full max-w-xs ml-auto"
                        placeholder="Select a user"
                        onChange={handleUserChange}
                        optionLabelProp="label"
                    >
                        {users.map((user) => (
                            <Select.Option
                                key={user.id}
                                value={user.id}
                                label={user.name}
                            >
                                <Space>
                                    <Avatar
                                        icon={<UserOutlined />}
                                        size="small"
                                    />
                                    {user.name}
                                </Space>
                            </Select.Option>
                        ))}
                    </Select>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={showModal}
                        className="ml-4"
                    >
                        Add Item
                    </Button>
                </Space>
            </Header>

            <Content className="p-4">
                {selectedUser ? (
                    <div>
                        <div className="mb-4 flex justify-between items-center">
                            <Title level={4}>{selectedUser.name}'s Items</Title>
                            <Badge count={totalItems} showZero color="blue">
                                <Text className="text-lg font-medium">
                                    Items
                                </Text>
                            </Badge>
                        </div>

                        <List
                            grid={{
                                gutter: 16,
                                xs: 1,
                                sm: 2,
                                md: 3,
                                lg: 3,
                                xl: 4,
                                xxl: 4,
                            }}
                            dataSource={selectedUser.items}
                            renderItem={(item) => (
                                <List.Item>
                                    <Card hoverable className="shadow-sm">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <Text strong>{item.name}</Text>
                                                <div>
                                                    <Text type="secondary">
                                                        Quantity:{' '}
                                                        {item.quantity}
                                                    </Text>
                                                </div>
                                            </div>
                                            <div>
                                                <Text className="text-lg font-bold text-blue-500">
                                                    ${item.price}
                                                </Text>
                                            </div>
                                            <div>
                                                <Button
                                                    icon={<PlusOutlined />}
                                                    onClick={() =>
                                                        increaseQuantity(
                                                            item.id
                                                        )
                                                    }
                                                />
                                                <Button
                                                    icon={<MinusOutlined />}
                                                    onClick={() =>
                                                        decreaseQuantity(
                                                            item.id
                                                        )
                                                    }
                                                    disabled={
                                                        item.quantity <= 1
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </Card>
                                </List.Item>
                            )}
                        />
                    </div>
                ) : (
                    <div className="text-center p-8 h-screen flex">
                        <Title level={4} type="secondary">
                            Please select a user to view their items
                        </Title>
                    </div>
                )}
            </Content>

            <Modal
                title="Add Item"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Item Name"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the item name',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="quantity"
                        label="Quantity"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the quantity',
                            },
                        ]}
                    >
                        <InputNumber min={1} />
                    </Form.Item>
                    <Form.Item
                        name="price"
                        label="Price"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the price',
                            },
                        ]}
                    >
                        <InputNumber min={0.01} step={0.01} />
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button
                                icon={<MinusOutlined />}
                                onClick={() => {
                                    const quantity =
                                        form.getFieldValue('quantity') || 1
                                    if (quantity > 1) {
                                        form.setFieldsValue({
                                            quantity: quantity - 1,
                                        })
                                    }
                                }}
                            />
                            <Button
                                icon={<PlusOutlined />}
                                onClick={() => {
                                    const quantity =
                                        form.getFieldValue('quantity') || 1
                                    form.setFieldsValue({
                                        quantity: quantity + 1,
                                    })
                                }}
                            />
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    )
}
