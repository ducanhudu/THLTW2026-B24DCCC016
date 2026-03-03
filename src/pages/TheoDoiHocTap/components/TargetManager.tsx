import { Button, Input, Table, Space, Select, Progress, message } from 'antd';
import { useEffect, useState } from 'react';

const { Option } = Select;
const KEY = 'studyData';

const TargetManager = () => {
	const [subjects, setSubjects] = useState<any[]>([]);
	const [sessions, setSessions] = useState<any[]>([]);
	const [goals, setGoals] = useState<any[]>([]);
	const [subjectId, setSubjectId] = useState<number | null>(null);
	const [targetHours, setTargetHours] = useState('');

	useEffect(() => {
		const raw = localStorage.getItem(KEY);
		if (raw) {
			const data = JSON.parse(raw);
			setSubjects(data.subjects || []);
			setSessions(data.sessions || []);
			setGoals(data.goals || []);
		}
	}, []);

	const save = (newGoals: any[]) => {
		const raw = localStorage.getItem(KEY);
		const data = raw ? JSON.parse(raw) : {};
		data.goals = newGoals;
		localStorage.setItem(KEY, JSON.stringify(data));
		setGoals(newGoals);
	};

	const addGoal = () => {
		if (!subjectId || !targetHours) {
			message.warning('Hãy nhập đủ thông tin');
			return;
		}

		const subject = subjects.find((s) => s.id === subjectId);

		const newGoal = {
			id: Date.now(),
			subjectId,
			subjectName: subject?.name,
			targetHours: Number(targetHours),
		};

		const newGoals = [...goals, newGoal];
		save(newGoals);

		setTargetHours('');
		message.success('Đã thêm mục tiêu');
	};

	const deleteGoal = (id: number) => {
		const newGoals = goals.filter((g) => g.id !== id);
		save(newGoals);
		message.success('Đã xóa');
	};

	const calculateProgress = (goal: any) => {
		const totalHours = sessions.filter((s) => s.subjectId === goal.subjectId).reduce((sum, s) => sum + s.hours, 0);

		const percent = (totalHours / goal.targetHours) * 100;
		return {
			totalHours,
			percent: percent > 100 ? 100 : percent,
		};
	};

	const columns = [
		{
			title: 'Môn',
			dataIndex: 'subjectName',
		},
		{
			title: 'Mục tiêu (giờ)',
			dataIndex: 'targetHours',
		},
		{
			title: 'Đã học',
			render: (_: any, record: any) => calculateProgress(record).totalHours + ' giờ',
		},
		{
			title: 'Tiến độ',
			render: (_: any, record: any) => {
				const { percent } = calculateProgress(record);
				return <Progress percent={Math.round(percent)} />;
			},
		},
		{
			title: 'Thao tác',
			render: (_: any, record: any) => (
				<Button danger onClick={() => deleteGoal(record.id)}>
					Xóa
				</Button>
			),
		},
	];

	return (
		<>
			<Space style={{ marginBottom: 16 }} wrap>
				<Select placeholder='Chọn môn' style={{ width: 150 }} onChange={(value) => setSubjectId(value)}>
					{subjects.map((s) => (
						<Option key={s.id} value={s.id}>
							{s.name}
						</Option>
					))}
				</Select>

				<Input
					placeholder='Mục tiêu giờ'
					type='number'
					value={targetHours}
					onChange={(e) => setTargetHours(e.target.value)}
					style={{ width: 150 }}
				/>

				<Button type='primary' onClick={addGoal}>
					Thêm Mục Tiêu
				</Button>
			</Space>

			<Table rowKey='id' columns={columns} dataSource={goals} pagination={false} />
		</>
	);
};

export default TargetManager;
