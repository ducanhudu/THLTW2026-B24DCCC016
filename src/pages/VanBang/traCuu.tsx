import { Card, Form, Input, Button, Table, Modal, message } from 'antd';
import { useState } from 'react';

const TraCuu = ({ vanBangList = [], quyetDinhList = [] }: any) => {
	const [form] = Form.useForm();
	const [result, setResult] = useState<any[]>([]);
	const [detail, setDetail] = useState<any>(null);

	const handleSearch = (values: any) => {
		const filledFields = Object.values(values).filter((v) => v);

		if (filledFields.length < 2) {
			message.error('Nhập ít nhất 2 điều kiện');
			return;
		}

		const filtered = vanBangList.filter((item: any) => {
			return (
				(!values.soHieu || item.soHieu.includes(values.soHieu)) &&
				(!values.soVaoSo || item.soVaoSo == values.soVaoSo) &&
				(!values.maSV || item.maSV.includes(values.maSV)) &&
				(!values.hoTen || item.hoTen.toLowerCase().includes(values.hoTen.toLowerCase())) &&
				(!values.ngaySinh || item.ngaySinh?.includes(values.ngaySinh))
			);
		});

		setResult(filtered);

		const updatedQD = [...quyetDinhList];
		filtered.forEach((vb: any) => {
			const qd = updatedQD.find((q: any) => q.soQD === vb.soQD);
			if (qd) {
				qd.luotTraCuu = (qd.luotTraCuu || 0) + 1;
			}
		});

		localStorage.setItem('quyetDinh', JSON.stringify(updatedQD));
	};

	const columns = [
		{ title: 'Số hiệu', dataIndex: 'soHieu' },
		{ title: 'Họ tên', dataIndex: 'hoTen' },
		{ title: 'MSV', dataIndex: 'maSV' },
		{
			title: 'Hành động',
			render: (_: any, record: any) => <Button onClick={() => setDetail(record)}>Xem</Button>,
		},
	];

	return (
		<Card title='Tra cứu văn bằng'>
			<Form form={form} layout='inline' onFinish={handleSearch}>
				<Form.Item name='soHieu'>
					<Input placeholder='Số hiệu' />
				</Form.Item>

				<Form.Item name='soVaoSo'>
					<Input placeholder='Số vào sổ' />
				</Form.Item>

				<Form.Item name='maSV'>
					<Input placeholder='Mã SV' />
				</Form.Item>

				<Form.Item name='hoTen'>
					<Input placeholder='Họ tên' />
				</Form.Item>

				<Form.Item name='ngaySinh'>
					<Input placeholder='Ngày sinh' />
				</Form.Item>

				<Button type='primary' htmlType='submit'>
					Tra cứu
				</Button>
			</Form>

			<Table style={{ marginTop: 20 }} dataSource={result} columns={columns} rowKey='soHieu' />

			<Modal title='Chi tiết văn bằng' visible={!!detail} onCancel={() => setDetail(null)} footer={null}>
				{detail && (
					<div>
						<p>
							<b>Số vào sổ:</b> {detail.soVaoSo}
						</p>
						<p>
							<b>Số hiệu:</b> {detail.soHieu}
						</p>
						<p>
							<b>MSV:</b> {detail.maSV}
						</p>
						<p>
							<b>Họ tên:</b> {detail.hoTen}
						</p>
						<p>
							<b>Ngày sinh:</b> {detail.ngaySinh}
						</p>
						<p>
							<b>Số QĐ:</b> {detail.soQD}
						</p>
					</div>
				)}
			</Modal>
		</Card>
	);
};

export default TraCuu;
