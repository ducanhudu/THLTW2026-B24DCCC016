import React, { useState, useEffect } from 'react';
import {
    Table,
    Card,
    Button,
    InputNumber,
    DatePicker,
    Modal,
    Form,
    Space,
    Popconfirm,
    Typography,
    Tag,
} from 'antd';
import moment from 'moment';

const { Title } = Typography;

const LOCAL_STORAGE_KEY = 'health_metrics_data';

interface HealthMetric {
    id: number;
    date: string;
    weight: number;
    height: number;
    heartRate: number;
    sleepHours: number;
}

const calculateBMI = (weight: number, height: number): number => {
    const heightInMeters = height / 100;
    if (heightInMeters <= 0) return 0;
    return weight / (heightInMeters * heightInMeters);
};

const getBMIStatus = (bmi: number): { label: string; color: string } => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'blue' };
    if (bmi < 25) return { label: 'Normal', color: 'green' };
    if (bmi < 30) return { label: 'Overweight', color: 'gold' };
    return { label: 'Obese', color: 'red' };
};

const HealthMetrics: React.FC = () => {
    const [metrics, setMetrics] = useState<HealthMetric[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMetric, setEditingMetric] = useState<HealthMetric | null>(null);
    const [form] = Form.useForm();

    const weight = Form.useWatch('weight', form);
    const height = Form.useWatch('height', form);

    useEffect(() => {
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedData) {
            setMetrics(JSON.parse(savedData));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(metrics));
    }, [metrics]);

    useEffect(() => {
        if (isModalOpen) {
            if (editingMetric) {
                form.setFieldsValue({
                    ...editingMetric,
                    date: editingMetric.date ? moment(editingMetric.date) : undefined,
                });
            } else {
                form.resetFields();
            }
        }
    }, [isModalOpen, editingMetric, form]);

    const handleOpenModal = (metric?: HealthMetric) => {
        setEditingMetric(metric || null);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        setMetrics(metrics.filter((m) => m.id !== id));
    };

    const handleSave = () => {
        form.validateFields().then((values) => {
            const formattedValues = {
                ...values,
                date: values.date ? values.date.format('YYYY-MM-DD') : '',
                weight: values.weight,
                height: values.height,
                heartRate: values.heartRate,
                sleepHours: values.sleepHours,
            };

            if (editingMetric) {
                setMetrics(
                    metrics.map((m) =>
                        m.id === editingMetric.id ? { ...m, ...formattedValues } : m,
                    ),
                );
            } else {
                setMetrics([...metrics, { id: Date.now(), ...formattedValues }]);
            }
            setIsModalOpen(false);
            setEditingMetric(null);
        });
    };

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            sorter: (a: HealthMetric, b: HealthMetric) => a.date.localeCompare(b.date),
        },
        {
            title: 'Weight (kg)',
            dataIndex: 'weight',
            key: 'weight',
            sorter: (a: HealthMetric, b: HealthMetric) => a.weight - b.weight,
        },
        {
            title: 'Height (cm)',
            dataIndex: 'height',
            key: 'height',
            sorter: (a: HealthMetric, b: HealthMetric) => a.height - b.height,
        },
        {
            title: 'BMI',
            key: 'bmi',
            render: (_: any, record: HealthMetric) => {
                const bmi = calculateBMI(record.weight, record.height);
                return bmi.toFixed(2);
            },
            sorter: (a: HealthMetric, b: HealthMetric) =>
                calculateBMI(a.weight, a.height) - calculateBMI(b.weight, b.height),
        },
        {
            title: 'Heart Rate (bpm)',
            dataIndex: 'heartRate',
            key: 'heartRate',
            sorter: (a: HealthMetric, b: HealthMetric) => a.heartRate - b.heartRate,
        },
        {
            title: 'Sleep Hours',
            dataIndex: 'sleepHours',
            key: 'sleepHours',
            sorter: (a: HealthMetric, b: HealthMetric) => a.sleepHours - b.sleepHours,
        },
        {
            title: 'BMI Status',
            key: 'bmiStatus',
            render: (_: any, record: HealthMetric) => {
                const bmi = calculateBMI(record.weight, record.height);
                const status = getBMIStatus(bmi);
                return <Tag color={status.color}>{status.label}</Tag>;
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 180,
            render: (_: any, record: HealthMetric) => (
                <Space>
                    <Button type='link' onClick={() => handleOpenModal(record)}>
                        Edit
                    </Button>
                    <Popconfirm
                        title='Are you sure you want to delete this record?'
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

    const bmiPreview = weight && height ? calculateBMI(weight, height) : null;
    const bmiStatusPreview = bmiPreview !== null ? getBMIStatus(bmiPreview) : null;

    return (
        <div style={{ padding: '24px' }}>
            <Card
                title={<Title level={3}>Health Metrics</Title>}
                extra={
                    <Button type='primary' onClick={() => handleOpenModal()}>
                        Add Record
                    </Button>
                }
            >
                <Table
                    dataSource={metrics}
                    columns={columns}
                    rowKey='id'
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            <Modal
                title={editingMetric ? 'Edit Health Metric' : 'Add Health Metric'}
                visible={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    setEditingMetric(null);
                }}
                onOk={handleSave}
                okText={editingMetric ? 'Update' : 'Add'}
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
                        name='weight'
                        label='Weight (kg)'
                        rules={[{ required: true, message: 'Please enter weight' }]}
                    >
                        <InputNumber min={1} max={500} style={{ width: '100%' }} placeholder='Enter weight' />
                    </Form.Item>

                    <Form.Item
                        name='height'
                        label='Height (cm)'
                        rules={[{ required: true, message: 'Please enter height' }]}
                    >
                        <InputNumber min={1} max={300} style={{ width: '100%' }} placeholder='Enter height' />
                    </Form.Item>

                    <Form.Item
                        name='heartRate'
                        label='Heart Rate (bpm)'
                        rules={[{ required: true, message: 'Please enter heart rate' }]}
                    >
                        <InputNumber min={1} max={300} style={{ width: '100%' }} placeholder='Enter heart rate' />
                    </Form.Item>

                    <Form.Item
                        name='sleepHours'
                        label='Sleep Hours'
                        rules={[{ required: true, message: 'Please enter sleep hours' }]}
                    >
                        <InputNumber min={0} max={24} step={0.5} style={{ width: '100%' }} placeholder='Enter sleep hours' />
                    </Form.Item>

                    {bmiPreview !== null && bmiStatusPreview && (
                        <div style={{ padding: '12px 0' }}>
                            <strong>BMI: </strong>{bmiPreview.toFixed(2)}{' '}
                            <Tag color={bmiStatusPreview.color}>{bmiStatusPreview.label}</Tag>
                        </div>
                    )}
                </Form>
            </Modal>
        </div>
    );
};

export default HealthMetrics;