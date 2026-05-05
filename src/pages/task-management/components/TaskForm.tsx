import React, { useEffect } from 'react';
import { Form, Input, DatePicker, Select, Button, Modal } from 'antd';
import { Task, TaskPriority, TaskStatus } from '../types/task';

const { TextArea } = Input;

interface TaskFormProps {
    visible: boolean;
    editingTask: Task | null;
    onSave: (values: any) => void;
    onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ visible, editingTask, onSave, onCancel }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible) {
            if (editingTask) {
                form.setFieldsValue({
                    ...editingTask,
                    deadline: editingTask.deadline ? null : undefined,
                    tags: editingTask.tags?.join(', ') || '',
                });
            } else {
                form.resetFields();
            }
        }
    }, [visible, editingTask, form]);

    const handleFinish = (values: any) => {
        const taskData = {
            name: values.name,
            description: values.description || '',
            deadline: values.deadline ? values.deadline.format('YYYY-MM-DD') : '',
            priority: values.priority || 'medium',
            status: editingTask ? editingTask.status : ('todo' as TaskStatus),
            tags: values.tags
                ? values.tags
                    .split(',')
                    .map((t: string) => t.trim())
                    .filter(Boolean)
                : [],
        };
        onSave(taskData);
        form.resetFields();
    };

    return (
        <Modal
            title={editingTask ? 'Edit Task' : 'Create Task'}
            visible={visible}
            onCancel={onCancel}
            footer={null}
            destroyOnClose
        >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[{ required: true, message: 'Please enter task name' }]}
                >
                    <Input placeholder="Enter task name" />
                </Form.Item>

                <Form.Item name="description" label="Description">
                    <TextArea rows={3} placeholder="Enter task description" />
                </Form.Item>

                <Form.Item name="deadline" label="Deadline">
                    <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                </Form.Item>

                <Form.Item name="priority" label="Priority" initialValue="medium">
                    <Select>
                        <Select.Option value="low">Low</Select.Option>
                        <Select.Option value="medium">Medium</Select.Option>
                        <Select.Option value="high">High</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item name="tags" label="Tags">
                    <Input placeholder="Enter tags separated by commas" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                        {editingTask ? 'Update' : 'Create'}
                    </Button>
                    <Button onClick={onCancel}>Cancel</Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default TaskForm;