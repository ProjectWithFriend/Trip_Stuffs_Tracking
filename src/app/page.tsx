'use client'

import { useEffect, useState } from 'react'
import { Typography, Layout, Button, Empty, theme } from 'antd'
import { ShoppingOutlined, PlusOutlined } from '@ant-design/icons'
import { User } from '@/models/User'
import UserSelect from '@/components/UserSelect'
import AddItemModal from '@/components/AddItemModal'
import ItemList from '@/components/ItemList'

const { Header, Content } = Layout
const { Title, Text } = Typography

export default function Home() {
    const [users, setUsers] = useState<User[]>([])
    const [userData, setUserData] = useState<User>()
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
        const user = users.find((user) => user._id === userId)

        setSelectedUser(user || null)
    }

    // const totalItems =
    //     selectedUser?.items.reduce((sum, item) => sum + item.quantity, 0) || 0

    const showModal = () => {
        setIsModalVisible(true)
    }

    useEffect(() => {
        if (selectedUser) {
            const fetchUserItems = async () => {
                try {
                    setLoading(true)
                    const response = await fetch(
                        `/api/users/orders/${selectedUser._id}`
                    )
                    const data = await response.json()
                    setUserData(data)
                    setLoading(false)
                } catch (error) {
                    console.error('Failed to fetch user items:', error)
                    setLoading(false)
                }
            }
            fetchUserItems()
        }
    }, [selectedUser])
    const { token } = theme.useToken()

    return (
        <Layout className="min-h-screen bg-gray-50">
            <Header
                className="flex items-center px-6 bg-gradient-to-r from-blue-600 to-blue-400 shadow-lg"
                style={{ padding: '0 24px' }}
            >
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                        <ShoppingOutlined
                            className="text-2xl text-white mr-3"
                            style={{ color: 'white' }}
                        />
                        {/* <Title level={4} style={{ color: 'white', margin: 0 }}>
                            Trip Items
                        </Title> */}
                    </div>
                    <div className="flex items-center w-2xs">
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
                                background: 'orange',
                                borderColor: token.colorPrimaryActive,
                                color: 'black',
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
                        </div>

                        {userData?.orders?.map((order, idx) => (
                            <div key={idx} className="mb-4">
                                {order.totalAmount > 0 ? (
                                    <ItemList items={order.orderItems} />
                                ) : (
                                    <div className="text-gray-500 text-center py-2">
                                        No items available
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-12 bg-white rounded-lg shadow-md flex flex-col items-center justify-center h-[70vh] h-screen">
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
            {isModalVisible && (
                <AddItemModal
                    userId={selectedUser?._id || ''}
                    visible={isModalVisible}
                    onClose={() => setIsModalVisible(false)}
                />
            )}
        </Layout>
    )
}
