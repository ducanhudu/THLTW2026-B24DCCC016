import { Modal, Form, Input } from 'antd';

const RejectModal = ({ visible, onCancel, onConfirm }: any) => {
	const [form] = Form.useForm();

	const handleOk = async () => {
		try {
			const values = await form.validateFields();
			onConfirm(values.reason);
			form.resetFields();
		} catch (info) {}
	};

	return (
		<Modal
			title='Lý do từ chối đơn'
			visible={visible}
			onCancel={onCancel}
			onOk={handleOk}
			okText='Từ chối'
			okButtonProps={{ danger: true }}
		>
			<Form form={form} layout='vertical'>
				<Form.Item label='Lý do' name='reason' rules={[{ required: true, message: 'Vui lòng nhập lý do từ chối' }]}>
					<Input.TextArea rows={4} placeholder='Nhập lý do...' />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default RejectModal;
