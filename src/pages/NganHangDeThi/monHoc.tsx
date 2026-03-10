import { Table, Button, Input } from 'antd';
import { useState, useEffect } from 'react';

type Subject = {
	code: string;
	name: string;
	credits: string;
};

export default function Subjects() {
	const [subjects, setSubjects] = useState<Subject[]>([]);
	const [code, setCode] = useState('');
	const [name, setName] = useState('');
	const [credits, setCredits] = useState('');
	const [editIndex, setEditIndex] = useState<number | null>(null);

	useEffect(() => {
		const data = localStorage.getItem('subjects');
		if (data) setSubjects(JSON.parse(data));
	}, []);

	const saveData = (data: Subject[]) => {
		setSubjects(data);
		localStorage.setItem('subjects', JSON.stringify(data));
	};

	const addSubject = () => {
		const newData = [...subjects, { code, name, credits }];
		saveData(newData);
		setCode('');
		setName('');
		setCredits('');
	};

	const deleteSubject = (index: number) => {
		const newData = subjects.filter((_, i) => i !== index);
		saveData(newData);
	};

	const editSubject = (index: number) => {
		const s = subjects[index];
		setCode(s.code);
		setName(s.name);
		setCredits(s.credits);
		setEditIndex(index);
	};

	const updateSubject = () => {
		if (editIndex === null) return;
		const newData = [...subjects];
		newData[editIndex] = { code, name, credits };
		saveData(newData);
		setEditIndex(null);
		setCode('');
		setName('');
		setCredits('');
	};

	const columns = [
		{ title: 'Mã môn', dataIndex: 'code' },
		{ title: 'Tên môn', dataIndex: 'name' },
		{ title: 'Tín chỉ', dataIndex: 'credits' },
		{
			title: 'Thao tác',
			render: (_: any, record: Subject, index: number) => (
				<>
					<Button type='primary' onClick={() => editSubject(index)} style={{ marginRight: 10 }}>
						Sửa
					</Button>
					<Button danger onClick={() => deleteSubject(index)}>
						Xóa
					</Button>
				</>
			),
		},
	];

	return (
		<div>
			<h2>Quản lý môn học</h2>

			<div style={{ marginBottom: 20 }}>
				<Input
					placeholder='Mã môn'
					value={code}
					onChange={(e) => setCode(e.target.value)}
					style={{ width: 150, marginRight: 10 }}
				/>
				<Input
					placeholder='Tên môn'
					value={name}
					onChange={(e) => setName(e.target.value)}
					style={{ width: 250, marginRight: 10 }}
				/>
				<Input
					placeholder='Tín chỉ'
					value={credits}
					onChange={(e) => setCredits(e.target.value)}
					style={{ width: 100, marginRight: 10 }}
				/>

				{editIndex === null ? (
					<Button type='primary' onClick={addSubject}>
						Thêm
					</Button>
				) : (
					<Button type='primary' onClick={updateSubject}>
						Cập nhật
					</Button>
				)}
			</div>

			<Table dataSource={subjects} columns={columns} rowKey={(r, i) => i!.toString()} pagination={{ pageSize: 5 }} />
		</div>
	);
}
