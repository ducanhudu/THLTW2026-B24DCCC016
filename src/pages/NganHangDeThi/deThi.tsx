import { useState, useEffect } from 'react';
import { Card, Select, InputNumber, Button, Table, Space, Typography, message } from 'antd';

const { Title } = Typography;
const { Option } = Select;

export default function Exams() {
	const [subjects, setSubjects] = useState<any[]>([]);
	const [questions, setQuestions] = useState<any[]>([]);
	const [exams, setExams] = useState<any[]>([]);

	const [subject, setSubject] = useState('');

	const [easy, setEasy] = useState(0);
	const [medium, setMedium] = useState(0);
	const [hard, setHard] = useState(0);
	const [veryHard, setVeryHard] = useState(0);

	useEffect(() => {
		const s = localStorage.getItem('subjects');
		if (s) setSubjects(JSON.parse(s));

		const q = localStorage.getItem('questions');
		if (q) setQuestions(JSON.parse(q));

		const e = localStorage.getItem('exams');
		if (e) setExams(JSON.parse(e));
	}, []);

	const saveExam = (data: any[]) => {
		setExams(data);
		localStorage.setItem('exams', JSON.stringify(data));
	};

	const generateExam = () => {
		if (!subject) {
			message.error('Vui lòng chọn môn học');
			return;
		}

		const subjectQuestions = questions.filter((q) => q.subject === subject);

		const easyList = subjectQuestions.filter((q) => q.difficulty === 'Dễ');
		const mediumList = subjectQuestions.filter((q) => q.difficulty === 'Trung bình');
		const hardList = subjectQuestions.filter((q) => q.difficulty === 'Khó');
		const veryHardList = subjectQuestions.filter((q) => q.difficulty === 'Rất khó');

		if (
			easyList.length < easy ||
			mediumList.length < medium ||
			hardList.length < hard ||
			veryHardList.length < veryHard
		) {
			message.error('Không đủ câu hỏi để tạo đề thi');
			return;
		}

		const randomPick = (arr: any[], num: number) => {
			const shuffled = [...arr].sort(() => 0.5 - Math.random());
			return shuffled.slice(0, num);
		};

		const examQuestions = [
			...randomPick(easyList, easy),
			...randomPick(mediumList, medium),
			...randomPick(hardList, hard),
			...randomPick(veryHardList, veryHard),
		];

		const newExam = {
			id: Date.now(),
			subject,
			easy,
			medium,
			hard,
			veryHard,
			questions: examQuestions,
		};

		const newData = [...exams, newExam];

		saveExam(newData);

		message.success('Tạo đề thi thành công');
	};

	const columns = [
		{
			title: 'Mã đề',
			dataIndex: 'id',
		},

		{
			title: 'Môn học',
			dataIndex: 'subject',
		},

		{
			title: 'Dễ',
			dataIndex: 'easy',
		},

		{
			title: 'Trung bình',
			dataIndex: 'medium',
		},

		{
			title: 'Khó',
			dataIndex: 'hard',
		},

		{
			title: 'Rất khó',
			dataIndex: 'veryHard',
		},

		{
			title: 'Tổng câu',
			render: (record: any) => record.questions.length,
		},
	];

	return (
		<div>
			<Title level={2}>Quản lý đề thi</Title>

			<Card title='Tạo đề thi' style={{ marginBottom: 30 }}>
				<Space wrap>
					<div>
						<div>Môn học</div>

						<Select style={{ width: 200 }} value={subject} onChange={setSubject}>
							{subjects.map((s) => (
								<Option key={s.code} value={s.name}>
									{s.name}
								</Option>
							))}
						</Select>
					</div>

					<div>
						<div>Số câu dễ</div>

						<InputNumber min={0} value={easy} onChange={(v) => setEasy(v || 0)} />
					</div>

					<div>
						<div>Số câu trung bình</div>

						<InputNumber min={0} value={medium} onChange={(v) => setMedium(v || 0)} />
					</div>

					<div>
						<div>Số câu khó</div>

						<InputNumber min={0} value={hard} onChange={(v) => setHard(v || 0)} />
					</div>

					<div>
						<div>Số câu rất khó</div>

						<InputNumber min={0} value={veryHard} onChange={(v) => setVeryHard(v || 0)} />
					</div>
				</Space>

				<div style={{ marginTop: 20 }}>
					<Button type='primary' onClick={generateExam}>
						Tạo đề thi
					</Button>
				</div>
			</Card>

			<Card title='Danh sách đề thi'>
				<Table columns={columns} dataSource={exams} rowKey='id' pagination={{ pageSize: 5 }} />
			</Card>
		</div>
	);
}
