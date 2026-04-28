import React, { useState, useEffect } from 'react';
import {
    Card,
    Button,
    Input,
    Select,
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

const { Title, Text, Paragraph } = Typography;

const LOCAL_STORAGE_KEY = 'exercise_library_data';

const MUSCLE_GROUPS = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const DIFFICULTY_COLORS: Record<string, string> = {
    Easy: 'green',
    Medium: 'gold',
    Hard: 'red',
};

interface Exercise {
    id: number;
    name: string;
    muscleGroup: string;
    difficulty: string;
    description: string;
    caloriesPerHour: number;
}

const ExerciseLibrary: React.FC = () => {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [searchText, setSearchText] = useState('');
    const [filterMuscle, setFilterMuscle] = useState<string | undefined>(undefined);
    const [filterDifficulty, setFilterDifficulty] = useState<string | undefined>(undefined);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedData) {
            setExercises(JSON.parse(savedData));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(exercises));
    }, [exercises]);

    useEffect(() => {
        if (isFormModalOpen) {
            if (editingExercise) {
                form.setFieldsValue(editingExercise);
            } else {
                form.resetFields();
            }
        }
    }, [isFormModalOpen, editingExercise, form]);

    const handleOpenFormModal = (exercise?: Exercise) => {
        setEditingExercise(exercise || null);
        setIsFormModalOpen(true);
    };

    const handleCloseFormModal = () => {
        setIsFormModalOpen(false);
        setEditingExercise(null);
    };

    const handleOpenDetail = (exercise: Exercise) => {
        setSelectedExercise(exercise);
        setIsDetailModalOpen(true);
    };

    const handleCloseDetail = () => {
        setIsDetailModalOpen(false);
        setSelectedExercise(null);
    };

    const handleDelete = (id: number) => {
        setExercises(exercises.filter((e) => e.id !== id));
    };

    const handleSave = () => {
        form.validateFields().then((values) => {
            if (editingExercise) {
                setExercises(
                    exercises.map((e) =>
                        e.id === editingExercise.id ? { ...e, ...values } : e,
                    ),
                );
            } else {
                setExercises([...exercises, { id: Date.now(), ...values }]);
            }
            setIsFormModalOpen(false);
            setEditingExercise(null);
        });
    };

    const filteredExercises = exercises.filter((e) => {
        const matchesSearch = e.name.toLowerCase().includes(searchText.toLowerCase());
        const matchesMuscle = filterMuscle ? e.muscleGroup === filterMuscle : true;
        const matchesDifficulty = filterDifficulty ? e.difficulty === filterDifficulty : true;
        return matchesSearch && matchesMuscle && matchesDifficulty;
    });

    return (
        <div style={{ padding: '24px' }}>
            <Card
                title={<Title level={3}>Exercise Library</Title>}
                extra={
                    <Button type='primary' onClick={() => handleOpenFormModal()}>
                        Add Exercise
                    </Button>
                }
            >
                <div style={{ marginBottom: 24 }}>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Input
                                placeholder='Search by name'
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </Col>
                        <Col span={8}>
                            <Select
                                placeholder='Filter by muscle group'
                                style={{ width: '100%' }}
                                allowClear
                                onChange={(value) => setFilterMuscle(value)}
                            >
                                {MUSCLE_GROUPS.map((group) => (
                                    <Select.Option key={group} value={group}>
                                        {group}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Col>
                        <Col span={8}>
                            <Select
                                placeholder='Filter by difficulty'
                                style={{ width: '100%' }}
                                allowClear
                                onChange={(value) => setFilterDifficulty(value)}
                            >
                                {DIFFICULTIES.map((d) => (
                                    <Select.Option key={d} value={d}>
                                        {d}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Col>
                    </Row>
                </div>

                <Row gutter={[16, 16]}>
                    {filteredExercises.map((exercise) => (
                        <Col xs={24} sm={12} md={8} key={exercise.id}>
                            <Card
                                size='small'
                                title={exercise.name}
                                hoverable
                                onClick={() => handleOpenDetail(exercise)}
                                extra={
                                    <Tag color={DIFFICULTY_COLORS[exercise.difficulty]}>
                                        {exercise.difficulty}
                                    </Tag>
                                }
                                actions={[
                                    <Button
                                        key='edit'
                                        type='link'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleOpenFormModal(exercise);
                                        }}
                                    >
                                        Edit
                                    </Button>,
                                    <Popconfirm
                                        key='delete'
                                        title='Are you sure you want to delete this exercise?'
                                        onConfirm={(e) => {
                                            e?.stopPropagation();
                                            handleDelete(exercise.id);
                                        }}
                                        onCancel={(e) => e?.stopPropagation()}
                                        okText='Delete'
                                        cancelText='Cancel'
                                        okButtonProps={{ danger: true }}
                                    >
                                        <Button
                                            type='link'
                                            danger
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            Delete
                                        </Button>
                                    </Popconfirm>,
                                ]}
                            >
                                <Space direction='vertical' style={{ width: '100%' }}>
                                    <div>
                                        <Text type='secondary'>Muscle Group: </Text>
                                        <Tag color='blue'>{exercise.muscleGroup}</Tag>
                                    </div>
                                    <div>
                                        <Text type='secondary'>Calories/hr: </Text>
                                        <Text strong>{exercise.caloriesPerHour}</Text>
                                    </div>
                                    <Paragraph
                                        ellipsis={{ rows: 2 }}
                                        style={{ marginBottom: 0, color: '#666' }}
                                    >
                                        {exercise.description}
                                    </Paragraph>
                                </Space>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {filteredExercises.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '48px 0', color: '#999' }}>
                        No exercises found.
                    </div>
                )}
            </Card>

            <Modal
                title={selectedExercise?.name}
                visible={isDetailModalOpen}
                onCancel={handleCloseDetail}
                footer={[
                    <Button key='close' onClick={handleCloseDetail}>
                        Close
                    </Button>,
                    <Button
                        key='edit'
                        type='primary'
                        onClick={() => {
                            handleCloseDetail();
                            handleOpenFormModal(selectedExercise!);
                        }}
                    >
                        Edit
                    </Button>,
                ]}
                width={600}
            >
                {selectedExercise && (
                    <Space direction='vertical' size='middle' style={{ width: '100%' }}>
                        <div>
                            <Text type='secondary'>Muscle Group: </Text>
                            <Tag color='blue'>{selectedExercise.muscleGroup}</Tag>
                        </div>
                        <div>
                            <Text type='secondary'>Difficulty: </Text>
                            <Tag color={DIFFICULTY_COLORS[selectedExercise.difficulty]}>
                                {selectedExercise.difficulty}
                            </Tag>
                        </div>
                        <div>
                            <Text type='secondary'>Calories per hour: </Text>
                            <Text strong>{selectedExercise.caloriesPerHour}</Text>
                        </div>
                        <div>
                            <Text type='secondary'>Description:</Text>
                            <Paragraph>{selectedExercise.description}</Paragraph>
                        </div>
                    </Space>
                )}
            </Modal>

            <Modal
                title={editingExercise ? 'Edit Exercise' : 'Add Exercise'}
                visible={isFormModalOpen}
                onCancel={handleCloseFormModal}
                onOk={handleSave}
                okText={editingExercise ? 'Update' : 'Add'}
                cancelText='Cancel'
                width={600}
            >
                <Form form={form} layout='vertical'>
                    <Form.Item
                        name='name'
                        label='Exercise Name'
                        rules={[{ required: true, message: 'Please enter exercise name' }]}
                    >
                        <Input placeholder='Enter exercise name' />
                    </Form.Item>

                    <Form.Item
                        name='muscleGroup'
                        label='Muscle Group'
                        rules={[{ required: true, message: 'Please select muscle group' }]}
                    >
                        <Select placeholder='Select muscle group'>
                            {MUSCLE_GROUPS.map((group) => (
                                <Select.Option key={group} value={group}>
                                    {group}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name='difficulty'
                        label='Difficulty'
                        rules={[{ required: true, message: 'Please select difficulty' }]}
                    >
                        <Select placeholder='Select difficulty'>
                            {DIFFICULTIES.map((d) => (
                                <Select.Option key={d} value={d}>
                                    {d}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name='caloriesPerHour'
                        label='Calories Burned per Hour'
                        rules={[{ required: true, message: 'Please enter calories burned per hour' }]}
                    >
                        <InputNumber min={1} style={{ width: '100%' }} placeholder='Enter calories' />
                    </Form.Item>

                    <Form.Item
                        name='description'
                        label='Description'
                        rules={[{ required: true, message: 'Please enter description' }]}
                    >
                        <Input.TextArea rows={4} placeholder='Enter description' />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ExerciseLibrary;