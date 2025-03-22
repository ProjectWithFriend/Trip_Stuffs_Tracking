import { User } from '@/models/User'
import { UserOutlined } from '@ant-design/icons'
import Avatar from 'antd/es/avatar'
import Select from 'antd/es/select'
import Space from 'antd/es/space'
import React from 'react'

export default function UserSelect({
    users,
    loading,
    onSelect,
}: {
    users: User[]
    loading: boolean
    onSelect: (userId: string) => void
}) {
    return (
        <Select
            loading={loading}
            className="w-full max-w-xs ml-auto"
            placeholder="Select a user"
            onChange={onSelect}
            optionLabelProp="label"
        >
            {users.map((user) => (
                <Select.Option key={user.id} value={user.id} label={user.name}>
                    <Space>
                        <Avatar icon={<UserOutlined />} size="small" />
                        {user.name}
                    </Space>
                </Select.Option>
            ))}
        </Select>
    )
}
