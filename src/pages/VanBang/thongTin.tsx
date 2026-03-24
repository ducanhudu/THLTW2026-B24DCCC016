import { Card, Button, Table, Modal, Form, Input, Select, DatePicker, InputNumber, message } from 'antd';
import { useState } from 'react';
import dayjs from 'dayjs';

const ThongTinVanBang = ({ list = [], setList, quyetDinhList = [], mauBieu = [] }: any) => {
	const [open, setOpen] = useState(false);
	const [form] = Form.useForm();

	const getNextSo = (nam: number) => {
		const listTheoNam = list.filter((item: any) => item.nam === nam);
		if (listTheoNam.length === 0) return 1;
		const maxSo = Math.max(...listTheoNam.map((i: any) => i.soVaoSo));
		return maxSo + 1;
	};

	const handleSubmit = (values: any) => {
		const { soQD, soHieu } = values;

		const quyetDinh = quyetDinhList.find((q: any) => q.soQD === soQD);

		if (!quyetDinh) {
			message.error('Chọn quyết định');
			return;
		}

		const nam = quyetDinh.nam;

		const isDuplicate = list.find(
			(i: any) => i.soHieu.trim().toLowerCase() === soHieu.trim().toLowerCase() && i.nam === nam,
		);

		if (isDuplicate) {
			message.error('Số hiệu đã tồn tại trong năm');
			return;
		}

		const newSo = getNextSo(nam);

		const newItem = {
			...values,
			soVaoSo: newSo,
			nam,
			ngaySinh: values.ngaySinh ? dayjs(values.ngaySinh).format('DD/MM/YYYY') : '',
		};

		setList((prev: any) => [...prev, newItem]);

		message.success('Thêm thành công');
		setOpen(false);
		form.resetFields();
	};

	const columns = [
		{ title: 'Số vào sổ', dataIndex: 'soVaoSo' },
		{ title: 'Số hiệu', dataIndex: 'soHieu' },
		{ title: 'Mã SV', dataIndex: 'maSV' },
		{ title: 'Họ tên', dataIndex: 'hoTen' },
		{ title: 'Ngày sinh', dataIndex: 'ngaySinh' },
		{ title: 'Số QĐ', dataIndex: 'soQD' },
	];

	return (
		<Card
			title='Thông tin văn bằng'
			extra={
				<Button type='primary' onClick={() => setOpen(true)} disabled={!quyetDinhList?.length}>
					Thêm mới
				</Button>
			}
		>
			<Table dataSource={list} columns={columns} rowKey='soHieu' bordered />

			<Modal
				title='Thêm văn bằng'
				visible={open}
				forceRender
				onCancel={() => {
					setOpen(false);
					form.resetFields();
				}}
				onOk={() => form.submit()}
			>
				<Form form={form} layout='vertical' onFinish={handleSubmit}>
					<Form.Item label='Số hiệu' name='soHieu' rules={[{ required: true }]}>
						<Input />
					</Form.Item>

					<Form.Item label='Mã sinh viên' name='maSV' rules={[{ required: true }]}>
						<Input />
					</Form.Item>

					<Form.Item label='Họ tên' name='hoTen' rules={[{ required: true }]}>
						<Input />
					</Form.Item>

					<Form.Item label='Ngày sinh' name='ngaySinh'>
						<DatePicker style={{ width: '100%' }} />
					</Form.Item>

					<Form.Item label='Quyết định' name='soQD' rules={[{ required: true }]}>
						<Select
							options={quyetDinhList.map((qd: any) => ({
								label: `${qd.soQD} - ${qd.nam}`,
								value: qd.soQD,
							}))}
						/>
					</Form.Item>

					{/* 🔥 FIELD ĐỘNG */}
					{mauBieu.map((field: any) => (
						<Form.Item key={field.name} label={field.label} name={field.name}>
							{field.type === 'number' ? <InputNumber style={{ width: '100%' }} /> : <Input />}
						</Form.Item>
					))}
				</Form>
			</Modal>
		</Card>
	);
};

export default ThongTinVanBang;
