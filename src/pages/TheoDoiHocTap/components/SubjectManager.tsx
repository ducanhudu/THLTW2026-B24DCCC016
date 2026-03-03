import { Button, Input, Table, Space, Modal, Form, message } from 'antd';
import { useState, useEffect } from 'react';

const KEY = 'studyData';

const defaultSubjects = ['Toán', 'Văn', 'Anh', 'Khoa học', 'Công nghệ'];

const SubjectManager = () => {
	const [subjects, setSubjects] = useState<any[]>([]);
	const [name, setName] = useState('');
	const [editingSubject, setEditingSubject] = useState<any>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		const raw = localStorage.getItem(KEY);
		if (!raw) {
			const initialData = {
				subjects: defaultSubjects.map((s) => ({
					id: Date.now() + Math.random(),
					name: s,
				})),
				sessions: [],
				goals: [],
			};
			localStorage.setItem(KEY, JSON.stringify(initialData));
			setSubjects(initialData.subjects);
		} else {
			const data = JSON.parse(raw);
			setSubjects(data.subjects || []);
		}
	}, []);

	const save = (newSubjects: any[]) => {
		const raw = localStorage.getItem(KEY);
		const data = raw ? JSON.parse(raw) : {};
		data.subjects = newSubjects;
		localStorage.setItem(KEY, JSON.stringify(data));
		setSubjects(newSubjects);
	};

	const addSubject = () => {
		if (!name.trim()) {
			message.warning('Nhập tên môn');
			return;
		}

		const newSubjects = [...subjects, { id: Date.now(), name }];

		save(newSubjects);
		setName('');
		message.success('Thêm môn thành công');
	};

	const deleteSubject = (id: number) => {
		const newSubjects = subjects.filter((s) => s.id !== id);
		save(newSubjects);
		message.success('Đã xóa');
	};

	const openEdit = (record: any) => {
		setEditingSubject(record);
		setIsModalOpen(true);
	};

	const handleEdit = () => {
		const newSubjects = subjects.map((s) => (s.id === editingSubject.id ? editingSubject : s));
		save(newSubjects);
		setIsModalOpen(false);
		message.success('Đã cập nhật');
	};

	const columns = [
		{
			title: 'Tên Môn Học',
			dataIndex: 'name',
		},
		{
			title: 'Thao tác',
			render: (_: any, record: any) => (
				<Space>
					<Button onClick={() => openEdit(record)}>Sửa</Button>
					<Button danger onClick={() => deleteSubject(record.id)}>
						Xóa
					</Button>
				</Space>
			),
		},
	];

	return (
		<>
			<Space style={{ marginBottom: 16 }}>
				<Input placeholder='Nhập tên môn học' value={name} onChange={(e) => setName(e.target.value)} />
				<Button type='primary' onClick={addSubject}>
					Thêm Môn
				</Button>
			</Space>

			<Table rowKey='id' columns={columns} dataSource={subjects} pagination={false} />

			<Modal title='Chỉnh sửa môn học' open={isModalOpen} onOk={handleEdit} onCancel={() => setIsModalOpen(false)}>
				<Input
					value={editingSubject?.name}
					onChange={(e) =>
						setEditingSubject({
							...editingSubject,
							name: e.target.value,
						})
					}
				/>
			</Modal>
		</>
	);
};

export default SubjectManager;
