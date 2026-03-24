import { Card, Table, Modal, Button } from 'antd';
import { useState } from 'react';

const SoVanBang = ({ vanBangList = [] }: any) => {
	const [detail, setDetail] = useState<any[]>([]);
	const [open, setOpen] = useState(false);
	const [year, setYear] = useState<number | null>(null);
	const grouped = Object.values(
		vanBangList.reduce((acc: any, item: any) => {
			if (!acc[item.nam]) {
				acc[item.nam] = {
					nam: item.nam,
					soLuong: 0,
				};
			}
			acc[item.nam].soLuong++;
			return acc;
		}, {}),
	);

	const handleView = (nam: number) => {
		const data = vanBangList.filter((i: any) => i.nam === nam);
		setDetail(data);
		setYear(nam);
		setOpen(true);
	};

	const columns = [
		{ title: 'Năm', dataIndex: 'nam' },
		{ title: 'Số lượng văn bằng', dataIndex: 'soLuong' },
		{
			title: 'Hành động',
			render: (_: any, record: any) => <Button onClick={() => handleView(record.nam)}>Xem chi tiết</Button>,
		},
	];

	const detailColumns = [
		{ title: 'Số vào sổ', dataIndex: 'soVaoSo' },
		{ title: 'Họ tên', dataIndex: 'hoTen' },
		{ title: 'Số hiệu', dataIndex: 'soHieu' },
	];

	return (
		<Card title='Sổ văn bằng'>
			<Table dataSource={grouped} columns={columns} rowKey='nam' bordered />

			<Modal title={`Chi tiết năm ${year}`} visible={open} onCancel={() => setOpen(false)} footer={null}>
				<Table dataSource={detail} columns={detailColumns} rowKey='soHieu' />
			</Modal>
		</Card>
	);
};

export default SoVanBang;
