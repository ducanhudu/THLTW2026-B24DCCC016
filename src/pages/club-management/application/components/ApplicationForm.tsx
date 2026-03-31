import { Modal, Form, Input, Select } from 'antd';
import { useEffect } from 'react';

const ApplicationForm = ({ visible, onCancel, onSave, initialValues, clubs }: any) => {
	const [form] = Form.useForm();

	useEffect(() => {
		if (visible) {
			if (initialValues) {
				form.setFieldsValue(initialValues);
			} else {
				form.resetFields();
			}
		}
	}, [visible, initialValues]);

	const handleOk = async () => {
		try {
			const values = await form.validateFields();
			onSave(values);
		} catch (info) {}
	};

	return (
		<Modal
			title={initialValues ? 'Chỉnh sửa đơn đăng ký' : 'Thêm mới đơn đăng ký'}
			visible={visible}
			onCancel={onCancel}
			onOk={handleOk}
			width={700}
		>
			<Form form={form} layout='vertical'>
				<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
					<Form.Item label='Họ tên' name='fullName' rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
						<Input />
					</Form.Item>
					<Form.Item label='Email' name='email' rules={[{ required: true, message: 'Vui lòng nhập email' }]}>
						<Input />
					</Form.Item>
				</div>
				<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
					<Form.Item label='Số điện thoại' name='phone'>
						<Input />
					</Form.Item>
					<Form.Item label='Giới tính' name='gender'>
						<Select>
							<Select.Option value='Nam'>Nam</Select.Option>
							<Select.Option value='Nữ'>Nữ</Select.Option>
							<Select.Option value='Khác'>Khác</Select.Option>
						</Select>
					</Form.Item>
				</div>
				<Form.Item label='Địa chỉ' name='address'>
					<Input />
				</Form.Item>
				<Form.Item label='Sở trường' name='specialty'>
					<Input />
				</Form.Item>
				<Form.Item label='Câu lạc bộ' name='clubName' rules={[{ required: true, message: 'Vui lòng chọn câu lạc bộ' }]}>
					<Select>
						{clubs.map((club: any) => (
							<Select.Option key={club.id} value={club.name}>
								{club.name}
							</Select.Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item label='Lý do đăng ký' name='reason'>
					<Input.TextArea rows={3} />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default ApplicationForm;
