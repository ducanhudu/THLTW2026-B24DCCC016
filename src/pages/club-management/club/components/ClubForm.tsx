import { Modal, Form, Input, DatePicker, Select, Upload, Button } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';

const ClubForm = ({ visible, onCancel, onSave, initialValues }: any) => {
	const [form] = Form.useForm();
	const [avatarBase64, setAvatarBase64] = useState<string>('');

	useEffect(() => {
		if (visible) {
			if (initialValues) {
				form.setFieldsValue({
					...initialValues,
					foundedDate: initialValues.foundedDate ? moment(initialValues.foundedDate) : null,
				});
				setAvatarBase64(initialValues.avatar || '');
			} else {
				form.resetFields();
				setAvatarBase64('');
			}
		}
	}, [visible, initialValues]);

	const getBase64 = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = (error) => reject(error);
		});
	};

	const handleUpload = async (info: any) => {
		const file = info.file;
		if (file) {
			const base64 = await getBase64(file);
			setAvatarBase64(base64);
			form.setFieldsValue({ avatar: base64 });
		}
	};

	const handleOk = async () => {
		try {
			const values = await form.validateFields();
			onSave({
				...values,
				avatar: avatarBase64,
				foundedDate: values.foundedDate ? values.foundedDate.format('YYYY-MM-DD') : '',
			});
		} catch (info) {}
	};

	return (
		<Modal
			title={initialValues ? 'Chỉnh sửa Câu lạc bộ' : 'Thêm mới Câu lạc bộ'}
			visible={visible}
			onCancel={onCancel}
			onOk={handleOk}
			width={600}
		>
			<Form form={form} layout='vertical'>
				<Form.Item label='Ảnh đại diện' name='avatar'>
					<div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
						{avatarBase64 && (
							<img
								src={avatarBase64}
								alt='avatar'
								style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '4px' }}
							/>
						)}
						<Upload beforeUpload={() => false} showUploadList={false} onChange={handleUpload} accept='image/*'>
							<Button>Chọn ảnh từ máy</Button>
						</Upload>
					</div>
				</Form.Item>
				<Form.Item label='Tên câu lạc bộ' name='name' rules={[{ required: true, message: 'Vui lòng nhập tên CLB' }]}>
					<Input />
				</Form.Item>
				<Form.Item label='Ngày thành lập' name='foundedDate'>
					<DatePicker style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item label='Mô tả (HTML)' name='description'>
					<Input.TextArea rows={4} placeholder='<p>Mô tả CLB...</p>' />
				</Form.Item>
				<Form.Item label='Chủ nhiệm CLB' name='leader'>
					<Input />
				</Form.Item>
				<Form.Item label='Hoạt động' name='status'>
					<Select>
						<Select.Option value='Có'>Có</Select.Option>
						<Select.Option value='Không'>Không</Select.Option>
					</Select>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default ClubForm;
