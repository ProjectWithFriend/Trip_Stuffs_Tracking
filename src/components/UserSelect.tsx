import { User } from '@/models/User'
import { UserOutlined } from '@ant-design/icons'
import { AutoComplete, Input } from 'antd'
import Avatar from 'antd/es/avatar'
import Space from 'antd/es/space'
import React, { useState } from 'react'

export default function UserSelect({
    users,
    onSelect,
}: {
    users: User[]
    loading: boolean
    onSelect: (userId: string) => void
}) {
    const [searchValue, setSearchValue] = useState<string>('')

    // Filter users dynamically based on search input
    const filteredOptions = users
        .filter((user) =>
            user.name.toLowerCase().includes(searchValue.toLowerCase())
        )
        .map((user) => ({
            value: user._id, // Pass user ID as value
            label: (
                <Space>
                    <Avatar icon={<UserOutlined />} size="small" />
                    {user.name}
                </Space>
            ),
            name: user.name, // Store the name for updating input field
        }))

    return (
        <AutoComplete
            options={filteredOptions}
            style={{ width: '100%', maxWidth: '250px' }}
            placeholder="Search user"
            onSearch={setSearchValue} // Update search text dynamically
            onSelect={(value, option: any) => {
                setSearchValue(option.name) // Set selected user's name in input
                onSelect(value) // Pass user ID to parent function
            }}
            value={searchValue} // Show selected value in input
            allowClear
        >
            <Input />
        </AutoComplete>
    )
}
