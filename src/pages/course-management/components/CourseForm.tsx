import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select } from 'antd';
import type { Course } from '../types';
import { CourseStatus } from '../types';

const { TextArea } = Input;

interface CourseFormProps {
	visible: boolean;
	onCancel: () => void;
	onSave: (values: any) => void;
	initialValues?: Course | null;
	existingCourses: Course[];
}

const CourseForm: React.FC<CourseFormProps> = ({ visible, onCancel, onSave, initialValues, existingCourses }) => {
	const [form] = Form.useForm();

	useEffect(() => {
		if (visible) {
			if (initialValues) {
				form.setFieldsValue(initialValues);
			} else {
				form.resetFields();
			}
		}
	}, [visible, initialValues, form]);

	const handleSubmit = () => {
		form.validateFields().then((values) => {
			onSave(values);
		});
	};

	return (
		<Modal
			title={initialValues ? 'Cập nhật khóa học' : 'Thêm khóa học mới'}
			visible={visible}
			onCancel={onCancel}
			onOk={handleSubmit}
			okText={initialValues ? 'Cập nhật' : 'Thêm mới'}
			cancelText='Hủy'
			width={650}
		>
			<Form form={form} layout='vertical'>
				<Form.Item
					name='name'
					label='Tên khóa học'
					rules={[
						{ required: true, message: 'Vui lòng nhập tên khóa học' },
						{ max: 100, message: 'Tên khóa học tối đa 100 ký tự' },
						{
							validator: (_, value) => {
								if (value && existingCourses.some((c) => c.name === value && c.id !== initialValues?.id)) {
									return Promise.reject(new Error('Tên khóa học đã tồn tại'));
								}
								return Promise.resolve();
							},
						},
					]}
				>
					<Input placeholder='Nhập tên khóa học' />
				</Form.Item>

				<Form.Item name='lecturer' label='Giảng viên' rules={[{ required: true, message: 'Vui lòng chọn giảng viên' }]}>
					<Select placeholder='Chọn giảng viên'>
						<Select.Option value='Nguyễn Văn A'>Nguyễn Văn A</Select.Option>
						<Select.Option value='Trần Thị B'>Trần Thị B</Select.Option>
						<Select.Option value='Lê Văn C'>Lê Văn C</Select.Option>
						<Select.Option value='Phạm Thị D'>Phạm Thị D</Select.Option>
					</Select>
				</Form.Item>

				<Form.Item
					name='studentCount'
					label='Số lượng học viên'
					rules={[{ required: true, message: 'Vui lòng nhập số lượng học viên' }]}
				>
					<InputNumber min={0} style={{ width: '100%' }} placeholder='Nhập số lượng học viên' />
				</Form.Item>

				<Form.Item name='description' label='Mô tả khóa học'>
					<TextArea rows={4} placeholder='Nhập mô tả khóa học' />
				</Form.Item>

				<Form.Item name='status' label='Trạng thái' rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
					<Select placeholder='Chọn trạng thái'>
						<Select.Option value={CourseStatus.OPEN}>Đang mở</Select.Option>
						<Select.Option value={CourseStatus.CLOSED}>Đã kết thúc</Select.Option>
						<Select.Option value={CourseStatus.PAUSED}>Tạm dừng</Select.Option>
					</Select>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default CourseForm;
