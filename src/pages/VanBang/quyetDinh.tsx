import { Card, Button, Table, Modal, Form, Input, InputNumber, DatePicker, message } from 'antd';
import { useState } from 'react';
import dayjs from 'dayjs';

const QuyetDinh = ({ list, setList }: any) => {
	const [open, setOpen] = useState(false);
	const [form] = Form.useForm();

	const handleSubmit = (values: any) => {
		const { soQD, ngayBanHanh, trichYeu, nam } = values;

		const isDuplicate = list.find(
			(i: any) => i.soQD.trim().toLowerCase() === soQD.trim().toLowerCase() && i.nam === nam,
		);

		if (isDuplicate) {
			message.error('Số quyết định đã tồn tại trong năm');
			return;
		}

		const newItem = {
			soQD,
			ngayBanHanh: dayjs(ngayBanHanh).format('DD/MM/YYYY'),
			trichYeu,
			nam,
		};

		setList((prev: any) => [...prev, newItem]);

		message.success('Thêm thành công');
		setOpen(false);
		form.resetFields();
	};

	const columns = [
		{ title: 'Số QĐ', dataIndex: 'soQD' },
		{ title: 'Ngày ban hành', dataIndex: 'ngayBanHanh' },
		{ title: 'Trích yếu', dataIndex: 'trichYeu' },
		{ title: 'Năm', dataIndex: 'nam' },
	];

	return (
		<Card
			title='Quyết định tốt nghiệp'
			extra={
				<Button type='primary' onClick={() => setOpen(true)}>
					Thêm mới
				</Button>
			}
		>
			<Table dataSource={list} columns={columns} rowKey='soQD' bordered />

			<Modal
				title='Thêm quyết định'
				visible={open}
				onCancel={() => {
					setOpen(false);
					form.resetFields();
				}}
				onOk={() => form.submit()}
			>
				<Form form={form} layout='vertical' onFinish={handleSubmit}>
					<Form.Item label='Số quyết định' name='soQD' rules={[{ required: true, message: 'Nhập số quyết định' }]}>
						<Input />
					</Form.Item>

					<Form.Item label='Ngày ban hành' name='ngayBanHanh' rules={[{ required: true, message: 'Chọn ngày' }]}>
						<DatePicker style={{ width: '100%' }} />
					</Form.Item>

					<Form.Item label='Trích yếu' name='trichYeu' rules={[{ required: true, message: 'Nhập trích yếu' }]}>
						<Input.TextArea />
					</Form.Item>

					<Form.Item label='Năm' name='nam' rules={[{ required: true, message: 'Nhập năm' }]}>
						<InputNumber style={{ width: '100%' }} />
					</Form.Item>
				</Form>
			</Modal>
		</Card>
	);
};

export default QuyetDinh;
