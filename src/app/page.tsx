'use client'

import { useEffect, useState } from 'react'
import {
    Typography,
    Layout,
    Space,
    Badge,
    Button,
    Form,
    Input,
    InputNumber,
    Modal,
    Empty,
    theme,
} from 'antd'
import {
    ShoppingOutlined,
    PlusOutlined,
    AppstoreOutlined,
} from '@ant-design/icons'
import { User } from '@/models/User'
import { Item } from '@/models/Item'
import ItemList from '@/components/ItemList'
import UserSelect from '@/components/UserSelect'

const { Header, Content } = Layout
const { Title, Text } = Typography

export default function Home() {
    const [users, setUsers] = useState<User[]>([])
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [isModalVisible, setIsModalVisible] = useState(false)

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

    const { token } = theme.useToken()

    return (
        <Layout className="min-h-screen bg-gray-50">
            <Header
                className="flex items-center px-6 bg-gradient-to-r from-blue-600 to-blue-400 shadow-lg"
                style={{ padding: '0 24px' }}
            >
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                        <ShoppingOutlined className="text-2xl text-white mr-3" />
                        <Title level={4} style={{ color: 'white', margin: 0 }}>
                            Trip Items
                        </Title>
                    </div>
                    <div className="flex items-center">
                        <UserSelect
                            users={users}
                            loading={loading}
                            onSelect={handleUserChange}
                        />
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={showModal}
                            className="ml-4"
                            disabled={!selectedUser}
                            style={{
                                background: token.colorPrimaryActive,
                                borderColor: token.colorPrimaryActive,
                            }}
                        >
                            Add Item
                        </Button>
                    </div>
                </div>
            </Header>

            <Content className="p-6 max-w-5xl mx-auto w-full">
                {selectedUser ? (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="mb-6 flex justify-between items-center pb-4 border-b border-gray-100">
                            <div className="flex items-center">
                                <Title level={3} style={{ margin: 0 }}>
                                    {selectedUser.name}'s Items
                                </Title>
                            </div>
                            <Badge
                                count={totalItems}
                                showZero
                                color="blue"
                                overflowCount={99}
                            >
                                <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-700">
                                    <Text className="text-md font-medium">
                                        Total Items
                                    </Text>
                                </div>
                            </Badge>
                        </div>
                        <ItemList items={selectedUser.items} />
                    </div>
                ) : (
                    <div className="text-center p-12 bg-white rounded-lg shadow-md flex flex-col items-center justify-center h-[70vh]">
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={null}
                            className="mb-6"
                        />
                        <Title level={4} type="secondary" className="mb-4">
                            No User Selected
                        </Title>
                        <Text type="secondary" className="max-w-md">
                            Please select a user from the dropdown above to view
                            and manage their items
                        </Text>
                    </div>
                )}
            </Content>
        </Layout>
    )
}
