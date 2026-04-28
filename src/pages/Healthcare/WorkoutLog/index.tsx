import React, { useState, useEffect } from 'react';
import {
    Table,
    Card,
    Button,
    Input,
    Select,
    DatePicker,
    Modal,
    Form,
    InputNumber,
    Space,
    Popconfirm,
    Typography,
    Tag,
    Row,
    Col,
} from 'antd';
import moment from 'moment';

const { Title } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const LOCAL_STORAGE_KEY = 'workout_log_data';

const WORKOUT_TYPES = ['Cardio', 'Strength', 'Yoga', 'HIIT', 'Other'];
const WORKOUT_STATUSES = ['Completed', 'Skipped'];

interface Workout {
    id: number;
    date: string;
    workoutType: string;
    duration: number;
    calories: number;
    notes: string;
    status: string;
}

const WorkoutLog: React.FC = () => {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [searchText, setSearchText] = useState('');
    const [filterType, setFilterType] = useState<string | undefined>(undefined);
    const [dateRange, setDateRange] = useState<[moment.Moment | null, moment.Moment | null] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedData) {
            setWorkouts(JSON.parse(savedData));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(workouts));
    }, [workouts]);

    useEffect(() => {
        if (isModalOpen) {
            if (editingWorkout) {
                form.setFieldsValue({
                    ...editingWorkout,
                    date: editingWorkout.date ? moment(editingWorkout.date) : undefined,
                });
            } else {
                form.resetFields();
            }
        }
    }, [isModalOpen, editingWorkout, form]);

    const handleOpenModal = (workout?: Workout) => {
        setEditingWorkout(workout || null);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        setWorkouts(workouts.filter((w) => w.id !== id));
    };

    const handleSave = () => {
        form.validateFields().then((values) => {
            const formattedValues = {
                ...values,
                date: values.date ? values.date.format('YYYY-MM-DD') : '',
            };

            if (editingWorkout) {
                setWorkouts(
                    workouts.map((w) => (w.id === editingWorkout.id ? { ...w, ...formattedValues } : w)),
                );
            } else {
                setWorkouts([...workouts, { id: Date.now(), ...formattedValues }]);
            }
            setIsModalOpen(false);
            setEditingWorkout(null);
        });
    };

    const filteredData = workouts.filter((w) => {
        const matchesSearch = w.notes.toLowerCase().includes(searchText.toLowerCase()) || w.workoutType.toLowerCase().includes(searchText.toLowerCase());
        const matchesType = filterType ? w.workoutType === filterType : true;
        let matchesDateRange = true;
        if (dateRange && dateRange[0] && dateRange[1]) {
            const workoutDate = moment(w.date);
            matchesDateRange = workoutDate.isSameOrAfter(dateRange[0]) && workoutDate.isSameOrBefore(dateRange[1]);
        }
        return matchesSearch && matchesType && matchesDateRange;
    });

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            sorter: (a: Workout, b: Workout) => a.date.localeCompare(b.date),
        },
        {
            title: 'Workout Type',
            dataIndex: 'workoutType',
            key: 'workoutType',
            render: (type: string) => {
                const colorMap: Record<string, string> = {
                    Cardio: 'volcano',
                    Strength: 'blue',
                    Yoga: 'green',
                    HIIT: 'orange',
                    Other: 'default',
                };
                return <Tag color={colorMap[type] || 'default'}>{type}</Tag>;
            },
        },
        {
            title: 'Duration (minutes)',
            dataIndex: 'duration',
            key: 'duration',
            sorter: (a: Workout, b: Workout) => a.duration - b.duration,
        },
        {
            title: 'Calories Burned',
            dataIndex: 'calories',
            key: 'calories',
            sorter: (a: Workout, b: Workout) => a.calories - b.calories,
        },
        {
            title: 'Notes',
            dataIndex: 'notes',
            key: 'notes',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const color = status === 'Completed' ? 'green' : 'red';
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 180,
            render: (_: any, record: Workout) => (
                <Space>
                    <Button type='link' onClick={() => handleOpenModal(record)}>
                        Edit
                    </Button>
                    <Popconfirm
                        title='Are you sure you want to delete this workout?'
                        onConfirm={() => handleDelete(record.id)}
                        okText='Delete'
                        cancelText='Cancel'
                        okButtonProps={{ danger: true }}
                    >
                        <Button type='link' danger>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Card
                title={<Title level={3}>Workout Log</Title>}
                extra={
                    <Button type='primary' onClick={() => handleOpenModal()}>
                        Add Workout
                    </Button>
                }
            >
                <div style={{ marginBottom: 24 }}>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Input
                                placeholder='Search by workout name'
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </Col>
                        <Col span={6}>
                            <Select
                                placeholder='Filter by workout type'
                                style={{ width: '100%' }}
                                allowClear
                                onChange={(value) => setFilterType(value)}
                            >
                                {WORKOUT_TYPES.map((type) => (
                                    <Select.Option key={type} value={type}>
                                        {type}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Col>
                        <Col span={8}>
                            <RangePicker
                                style={{ width: '100%' }}
                                onChange={(dates) => setDateRange(dates as [moment.Moment | null, moment.Moment | null] | null)}
                            />
                        </Col>
                    </Row>
                </div>

                <Table dataSource={filteredData} columns={columns} rowKey='id' pagination={{ pageSize: 10 }} />
            </Card>

            <Modal
                title={editingWorkout ? 'Edit Workout' : 'Add Workout'}
                visible={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    setEditingWorkout(null);
                }}
                onOk={handleSave}
                okText={editingWorkout ? 'Update' : 'Add'}
                cancelText='Cancel'
                width={650}
            >
                <Form form={form} layout='vertical'>
                    <Form.Item
                        name='date'
                        label='Date'
                        rules={[{ required: true, message: 'Please select a date' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name='workoutType'
                        label='Workout Type'
                        rules={[{ required: true, message: 'Please select a workout type' }]}
                    >
                        <Select placeholder='Select workout type'>
                            {WORKOUT_TYPES.map((type) => (
                                <Select.Option key={type} value={type}>
                                    {type}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name='duration'
                        label='Duration (minutes)'
                        rules={[{ required: true, message: 'Please enter duration' }]}
                    >
                        <InputNumber min={1} style={{ width: '100%' }} placeholder='Enter duration' />
                    </Form.Item>

                    <Form.Item
                        name='calories'
                        label='Calories Burned'
                        rules={[{ required: true, message: 'Please enter calories burned' }]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} placeholder='Enter calories burned' />
                    </Form.Item>

                    <Form.Item name='notes' label='Notes'>
                        <TextArea rows={4} placeholder='Enter notes' />
                    </Form.Item>

                    <Form.Item
                        name='status'
                        label='Status'
                        rules={[{ required: true, message: 'Please select status' }]}
                    >
                        <Select placeholder='Select status'>
                            {WORKOUT_STATUSES.map((status) => (
                                <Select.Option key={status} value={status}>
                                    {status}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default WorkoutLog;