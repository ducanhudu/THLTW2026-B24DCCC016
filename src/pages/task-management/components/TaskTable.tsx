import React, { useState } from 'react';
import { Table, Input, Select, Button, Tag, Space, Popconfirm, Typography } from 'antd';
import { Task, TaskStatus, TaskPriority } from '../types/task';

const { Search } = Input;

const priorityColors: Record<TaskPriority, string> = {
    low: 'green',
    medium: 'orange',
    high: 'red',
};

const statusLabels: Record<TaskStatus, string> = {
    todo: 'Todo',
    'in-progress': 'In Progress',
    done: 'Done',
};

const statusColors: Record<TaskStatus, string> = {
    todo: 'default',
    'in-progress': 'processing',
    done: 'success',
};

interface TaskTableProps {
    tasks: Task[];
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    onStatusChange: (id: string, status: TaskStatus) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks, onEdit, onDelete, onStatusChange }) => {
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const filteredTasks = tasks
        .filter((task) => {
            const matchesSearch =
                !searchText ||
                task.name.toLowerCase().includes(searchText.toLowerCase()) ||
                task.description.toLowerCase().includes(searchText.toLowerCase());
            const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            if (!a.deadline) return 1;
            if (!b.deadline) return -1;
            return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        });

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: Task) => (
                <a onClick={() => onEdit(record)}>{text}</a>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: TaskStatus, record: Task) => (
                <Select
                    value={status}
                    size="small"
                    style={{ width: 120 }}
                    onChange={(value) => onStatusChange(record.id, value)}
                >
                    <Select.Option value="todo">Todo</Select.Option>
                    <Select.Option value="in-progress">In Progress</Select.Option>
                    <Select.Option value="done">Done</Select.Option>
                </Select>
            ),
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            render: (priority: TaskPriority) => (
                <Tag color={priorityColors[priority]}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </Tag>
            ),
        },
        {
            title: 'Deadline',
            dataIndex: 'deadline',
            key: 'deadline',
            sorter: (a: Task, b: Task) => {
                if (!a.deadline) return 1;
                if (!b.deadline) return -1;
                return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
            },
            render: (deadline: string) => {
                if (!deadline) return <Typography.Text type="secondary">No deadline</Typography.Text>;
                const isOverdue = new Date(deadline) < new Date();
                return (
                    <Typography.Text type={isOverdue ? 'danger' : undefined}>
                        {deadline}
                    </Typography.Text>
                );
            },
        },
        {
            title: 'Tags',
            dataIndex: 'tags',
            key: 'tags',
            render: (tags: string[]) => (
                <span>
                    {tags?.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                    ))}
                </span>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Task) => (
                <Space>
                    <Button size="small" onClick={() => onEdit(record)}>
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete this task?"
                        onConfirm={() => onDelete(record.id)}
                    >
                        <Button size="small" danger>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <Search
                    placeholder="Search tasks"
                    allowClear
                    style={{ width: 300 }}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <Select
                    value={statusFilter}
                    style={{ width: 150 }}
                    onChange={(value) => setStatusFilter(value)}
                >
                    <Select.Option value="all">All Status</Select.Option>
                    <Select.Option value="todo">Todo</Select.Option>
                    <Select.Option value="in-progress">In Progress</Select.Option>
                    <Select.Option value="done">Done</Select.Option>
                </Select>
            </div>
            <Table
                columns={columns}
                dataSource={filteredTasks}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default TaskTable;