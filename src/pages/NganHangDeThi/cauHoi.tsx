import { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Space, Typography, Card, Popconfirm } from 'antd';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function Questions() {
	const [questions, setQuestions] = useState<any[]>([]);
	const [filtered, setFiltered] = useState<any[]>([]);

	const [subjects, setSubjects] = useState<any[]>([]);
	const [blocks, setBlocks] = useState<any[]>([]);

	const [id, setId] = useState('');
	const [subject, setSubject] = useState('');
	const [block, setBlock] = useState('');
	const [difficulty, setDifficulty] = useState('');
	const [content, setContent] = useState('');

	const [editingIndex, setEditingIndex] = useState<number | null>(null);

	const [fSubject, setFSubject] = useState('');
	const [fBlock, setFBlock] = useState('');
	const [fDifficulty, setFDifficulty] = useState('');

	useEffect(() => {
		const qData = localStorage.getItem('questions');
		if (qData) {
			const parsed = JSON.parse(qData);
			setQuestions(parsed);
			setFiltered(parsed);
		}

		const sData = localStorage.getItem('subjects');
		if (sData) setSubjects(JSON.parse(sData));

		const bData = localStorage.getItem('khoiKienThuc');
		if (bData) setBlocks(JSON.parse(bData));
	}, []);

	const saveData = (data: any[]) => {
		setQuestions(data);
		setFiltered(data);
		localStorage.setItem('questions', JSON.stringify(data));
	};

	const addQuestion = () => {
		if (!id || !subject || !content) {
			alert('Vui lòng nhập đủ thông tin');
			return;
		}

		const newQuestion = { id, subject, block, difficulty, content };

		let newData;

		if (editingIndex !== null) {
			newData = [...questions];
			newData[editingIndex] = newQuestion;
			setEditingIndex(null);
		} else {
			newData = [...questions, newQuestion];
		}

		saveData(newData);

		setId('');
		setSubject('');
		setBlock('');
		setDifficulty('');
		setContent('');
	};

	const deleteQuestion = (index: number) => {
		const newData = questions.filter((_, i) => i !== index);

		saveData(newData);
	};

	const editQuestion = (record: any, index: number) => {
		setId(record.id);
		setSubject(record.subject);
		setBlock(record.block);
		setDifficulty(record.difficulty);
		setContent(record.content);

		setEditingIndex(index);
	};

	const search = () => {
		let result = questions;

		if (fSubject) result = result.filter((q) => q.subject === fSubject);
		if (fBlock) result = result.filter((q) => q.block === fBlock);
		if (fDifficulty) result = result.filter((q) => q.difficulty === fDifficulty);

		setFiltered(result);
	};

	const resetFilter = () => {
		setFiltered(questions);
		setFSubject('');
		setFBlock('');
		setFDifficulty('');
	};

	const columns = [
		{
			title: 'Mã câu hỏi',
			dataIndex: 'id',
		},
		{
			title: 'Môn học',
			dataIndex: 'subject',
		},
		{
			title: 'Khối kiến thức',
			dataIndex: 'block',
		},
		{
			title: 'Độ khó',
			dataIndex: 'difficulty',
		},
		{
			title: 'Nội dung',
			dataIndex: 'content',
		},
		{
			title: 'Thao tác',
			render: (_: any, record: any, index: number) => (
				<>
					<Button type='link' onClick={() => editQuestion(record, index)}>
						Sửa
					</Button>

					<Popconfirm title='Xóa câu hỏi?' onConfirm={() => deleteQuestion(index)}>
						<Button type='link' danger>
							Xóa
						</Button>
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<div>
			<Title level={2}>Quản lý câu hỏi</Title>

			<Card title='Thêm / Sửa câu hỏi' style={{ marginBottom: 30 }}>
				<Space wrap style={{ marginBottom: 15 }}>
					<div>
						<div>Mã câu hỏi</div>
						<Input style={{ width: 200 }} value={id} onChange={(e) => setId(e.target.value)} />
					</div>

					<div>
						<div>Môn học</div>
						<Select style={{ width: 180 }} value={subject} onChange={setSubject}>
							{subjects.map((s) => (
								<Option key={s.code} value={s.name}>
									{s.name}
								</Option>
							))}
						</Select>
					</div>

					<div>
						<div>Khối kiến thức</div>
						<Select style={{ width: 180 }} value={block} onChange={setBlock}>
							{blocks.map((b) => (
								<Option key={b.name} value={b.name}>
									{b.name}
								</Option>
							))}
						</Select>
					</div>

					<div>
						<div>Độ khó</div>
						<Select style={{ width: 180 }} value={difficulty} onChange={setDifficulty}>
							<Option value='Dễ'>Dễ</Option>
							<Option value='Trung bình'>Trung bình</Option>
							<Option value='Khó'>Khó</Option>
							<Option value='Rất khó'>Rất khó</Option>
						</Select>
					</div>
				</Space>

				<div style={{ marginBottom: 15 }}>
					<div>Nội dung câu hỏi</div>

					<TextArea rows={3} value={content} onChange={(e) => setContent(e.target.value)} />
				</div>

				<Button type='primary' onClick={addQuestion}>
					{editingIndex !== null ? 'Cập nhật câu hỏi' : 'Thêm câu hỏi'}
				</Button>
			</Card>

			<Card title='Tìm kiếm câu hỏi' style={{ marginBottom: 30 }}>
				<Space wrap>
					<div>
						<div>Môn học</div>
						<Select style={{ width: 180 }} value={fSubject} onChange={setFSubject} allowClear>
							{subjects.map((s) => (
								<Option key={s.code} value={s.name}>
									{s.name}
								</Option>
							))}
						</Select>
					</div>

					<div>
						<div>Khối kiến thức</div>
						<Select style={{ width: 180 }} value={fBlock} onChange={setFBlock} allowClear>
							{blocks.map((b) => (
								<Option key={b.name} value={b.name}>
									{b.name}
								</Option>
							))}
						</Select>
					</div>

					<div>
						<div>Độ khó</div>
						<Select style={{ width: 180 }} value={fDifficulty} onChange={setFDifficulty} allowClear>
							<Option value='Dễ'>Dễ</Option>
							<Option value='Trung bình'>Trung bình</Option>
							<Option value='Khó'>Khó</Option>
							<Option value='Rất khó'>Rất khó</Option>
						</Select>
					</div>

					<Button type='primary' onClick={search}>
						Tìm
					</Button>

					<Button onClick={resetFilter}>Reset</Button>
				</Space>
			</Card>

			<Card title='Danh sách câu hỏi'>
				<Table columns={columns} dataSource={filtered} rowKey='id' pagination={{ pageSize: 5 }} />
			</Card>
		</div>
	);
}
