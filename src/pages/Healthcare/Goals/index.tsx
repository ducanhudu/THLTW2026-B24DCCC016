import React, { useState, useEffect } from 'react';
import {
    Card,
    Button,
    Input,
    Select,
    DatePicker,
    Drawer,
    Form,
    InputNumber,
    Space,
    Popconfirm,
    Typography,
    Tag,
    Progress,
    Row,
    Col,
    Segmented,
} from 'antd';
import moment from 'moment';

const { Title, Text } = Typography;

const LOCAL_STORAGE_KEY = 'goals_data';

const GOAL_TYPES = ['Weight Loss', 'Muscle Gain', 'Endurance', 'Other'];
const GOAL_STATUSES = ['In Progress', 'Completed', 'Cancelled'];
const STATUS_COLORS: Record<string, string> = {
    'In Progress': 'blue',
    'Completed': 'green',
    'Cancelled': 'red',
};

interface Goal {
    id: number;
    name: string;
    type: string;
    targetValue: number;
    currentValue: number;
    deadline: string;
    status: string;
}

const Goals: React.FC = () => {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string>('All');
    const [form] = Form.useForm();

    useEffect(() => {
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedData) {
            setGoals(JSON.parse(savedData));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(goals));
    }, [goals]);

    const handleOpenDrawer = () => {
        form.resetFields();
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
    };

    const handleSave = () => {
        form.validateFields().then((values) => {
            const formattedValues = {
                ...values,
                deadline: values.deadline ? values.deadline.format('YYYY-MM-DD') : '',
                status: 'In Progress',
            };
            setGoals([...goals, { id: Date.now(), ...formattedValues }]);
            setIsDrawerOpen(false);
        });
    };

    const handleDelete = (id: number) => {
        setGoals(goals.filter((g) => g.id !== id));
    };

    const handleUpdateCurrentValue = (id: number, currentValue: number) => {
        setGoals(
            goals.map((g) => {
                if (g.id === id) {
                    const progress = g.targetValue > 0 ? Math.min((currentValue / g.targetValue) * 100, 100) : 0;
                    const status = progress >= 100 ? 'Completed' : g.status === 'Completed' ? g.status : 'In Progress';
                    return { ...g, currentValue, status };
                }
                return g;
            }),
        );
    };

    const handleStatusChange = (id: number, status: string) => {
        setGoals(goals.map((g) => (g.id === id ? { ...g, status } : g)));
    };

    const filteredGoals = filterStatus === 'All' ? goals : goals.filter((g) => g.status === filterStatus);

    const getProgress = (goal: Goal) => {
        if (goal.targetValue <= 0) return 0;
        return Math.min((goal.currentValue / goal.targetValue) * 100, 100);
    };

    const getProgressColor = (progress: number) => {
        if (progress >= 100) return 'green';
        if (progress >= 60) return 'blue';
        if (progress >= 30) return 'gold';
        return 'red';
    };

    return (
        <div style={{ padding: '24px' }}>
            <Card
                title={<Title level={3}>Goals</Title>}
                extra={
                    <Button type='primary' onClick={handleOpenDrawer}>
                        Add Goal
                    </Button>
                }
            >
                <div style={{ marginBottom: 24 }}>
                    <Segmented
                        options={['All', ...GOAL_STATUSES]}
                        value={filterStatus}
                        onChange={(value) => setFilterStatus(value as string)}
                    />
                </div>

                <Row gutter={[16, 16]}>
                    {filteredGoals.map((goal) => {
                        const progress = getProgress(goal);
                        return (
                            <Col xs={24} sm={12} md={8} lg={6} key={goal.id}>
                                <Card
                                    size='small'
                                    title={goal.name}
                                    extra={
                                        <Tag color={STATUS_COLORS[goal.status]}>{goal.status}</Tag>
                                    }
                                    actions={[
                                        <Select
                                            key='status'
                                            value={goal.status}
                                            size='small'
                                            style={{ width: 120 }}
                                            onChange={(value) => handleStatusChange(goal.id, value)}
                                        >
                                            {GOAL_STATUSES.map((s) => (
                                                <Select.Option key={s} value={s}>
                                                    {s}
                                                </Select.Option>
                                            ))}
                                        </Select>,
                                        <Popconfirm
                                            key='delete'
                                            title='Are you sure you want to delete this goal?'
                                            onConfirm={() => handleDelete(goal.id)}
                                            okText='Delete'
                                            cancelText='Cancel'
                                            okButtonProps={{ danger: true }}
                                        >
                                            <Button type='link' danger size='small'>
                                                Delete
                                            </Button>
                                        </Popconfirm>,
                                    ]}
                                >
                                    <Space direction='vertical' style={{ width: '100%' }}>
                                        <div>
                                            <Text type='secondary'>Type: </Text>
                                            <Tag>{goal.type}</Tag>
                                        </div>
                                        <div>
                                            <Text type='secondary'>Target: </Text>
                                            <Text strong>{goal.targetValue}</Text>
                                        </div>
                                        <div>
                                            <Text type='secondary'>Current: </Text>
                                            <InputNumber
                                                size='small'
                                                min={0}
                                                value={goal.currentValue}
                                                onChange={(value) =>
                                                    handleUpdateCurrentValue(goal.id, value || 0)
                                                }
                                                style={{ width: 100 }}
                                            />
                                        </div>
                                        <Progress
                                            percent={parseFloat(progress.toFixed(1))}
                                            strokeColor={getProgressColor(progress)}
                                        />
                                        <div>
                                            <Text type='secondary'>Deadline: </Text>
                                            <Text>{goal.deadline}</Text>
                                        </div>
                                    </Space>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>

                {filteredGoals.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '48px 0', color: '#999' }}>
                        No goals found.
                    </div>
                )}
            </Card>

            <Drawer
                title='Add Goal'
                placement='right'
                width={450}
                onClose={handleCloseDrawer}
                visible={isDrawerOpen}
                footer={
                    <div style={{ textAlign: 'right' }}>
                        <Space>
                            <Button onClick={handleCloseDrawer}>Cancel</Button>
                            <Button type='primary' onClick={handleSave}>
                                Save
                            </Button>
                        </Space>
                    </div>
                }
            >
                <Form form={form} layout='vertical'>
                    <Form.Item
                        name='name'
                        label='Name'
                        rules={[{ required: true, message: 'Please enter goal name' }]}
                    >
                        <Input placeholder='Enter goal name' />
                    </Form.Item>

                    <Form.Item
                        name='type'
                        label='Type'
                        rules={[{ required: true, message: 'Please select goal type' }]}
                    >
                        <Select placeholder='Select goal type'>
                            {GOAL_TYPES.map((type) => (
                                <Select.Option key={type} value={type}>
                                    {type}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name='targetValue'
                        label='Target Value'
                        rules={[{ required: true, message: 'Please enter target value' }]}
                    >
                        <InputNumber min={1} style={{ width: '100%' }} placeholder='Enter target value' />
                    </Form.Item>

                    <Form.Item
                        name='currentValue'
                        label='Current Value'
                        initialValue={0}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} placeholder='Enter current value' />
                    </Form.Item>

                    <Form.Item
                        name='deadline'
                        label='Deadline'
                        rules={[{ required: true, message: 'Please select a deadline' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
};

export default Goals;