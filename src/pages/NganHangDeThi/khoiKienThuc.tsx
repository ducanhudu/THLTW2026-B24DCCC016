import { Table, Button, Input } from 'antd';
import { useState, useEffect } from 'react';

type Block = {
	name: string;
	description: string;
};

export default function Knowledge() {
	const [blocks, setBlocks] = useState<Block[]>([]);
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [editIndex, setEditIndex] = useState<number | null>(null);

	useEffect(() => {
		const data = localStorage.getItem('khoiKienThuc');
		if (data) {
			setBlocks(JSON.parse(data));
		}
	}, []);

	const saveData = (data: Block[]) => {
		setBlocks(data);
		localStorage.setItem('khoiKienThuc', JSON.stringify(data));
	};

	const addBlock = () => {
		if (!name) return;

		const newData = [...blocks, { name, description }];
		saveData(newData);

		setName('');
		setDescription('');
	};

	const deleteBlock = (index: number) => {
		const newData = blocks.filter((_, i) => i !== index);
		saveData(newData);
	};

	const editBlock = (index: number) => {
		const block = blocks[index];
		setName(block.name);
		setDescription(block.description);
		setEditIndex(index);
	};

	const updateBlock = () => {
		if (editIndex === null) return;

		const newData = [...blocks];
		newData[editIndex] = { name, description };

		saveData(newData);

		setEditIndex(null);
		setName('');
		setDescription('');
	};

	const columns = [
		{
			title: 'Tên khối',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Mô tả',
			dataIndex: 'description',
			key: 'description',
		},
		{
			title: 'Thao tác',
			key: 'action',
			render: (_: any, record: Block, index: number) => (
				<>
					<Button type='primary' onClick={() => editBlock(index)} style={{ marginRight: 10 }}>
						Sửa
					</Button>

					<Button danger onClick={() => deleteBlock(index)}>
						Xóa
					</Button>
				</>
			),
		},
	];

	return (
		<div>
			<h2>Quản lý khối kiến thức</h2>

			<div style={{ marginBottom: 20 }}>
				<Input
					placeholder='Tên khối kiến thức'
					value={name}
					onChange={(e) => setName(e.target.value)}
					style={{ width: 200, marginRight: 10 }}
				/>

				<Input
					placeholder='Mô tả'
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					style={{ width: 300, marginRight: 10 }}
				/>

				{editIndex === null ? (
					<Button type='primary' onClick={addBlock}>
						Thêm
					</Button>
				) : (
					<Button type='primary' onClick={updateBlock}>
						Cập nhật
					</Button>
				)}
			</div>

			<Table dataSource={blocks} columns={columns} rowKey={(record, index) => index!.toString()} pagination={false} />
		</div>
	);
}
