import { Modal, Form, Select, Alert } from 'antd';

const ChangeClubModal = ({ visible, onCancel, onConfirm, selectedCount, clubs }: any) => {
	const [form] = Form.useForm();

	const handleOk = async () => {
		try {
			const values = await form.validateFields();
			onConfirm(values.clubName);
			form.resetFields();
		} catch (info) {}
	};

	return (
		<Modal title='Thay đổi Câu lạc bộ' visible={visible} onCancel={onCancel} onOk={handleOk} okText='Xác nhận chuyển'>
			<Alert
				message={`Bạn đang thay đổi câu lạc bộ cho ${selectedCount} thành viên đã chọn.`}
				type='info'
				showIcon={false}
				style={{ marginBottom: 16 }}
			/>
			<Form form={form} layout='vertical'>
				<Form.Item
					label='Câu lạc bộ mới'
					name='clubName'
					rules={[{ required: true, message: 'Vui lòng chọn câu lạc bộ mới' }]}
				>
					<Select placeholder='Chọn câu lạc bộ muốn chuyển đến'>
						{clubs.map((club: any) => (
							<Select.Option key={club.id} value={club.name}>
								{club.name}
							</Select.Option>
						))}
					</Select>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default ChangeClubModal;
