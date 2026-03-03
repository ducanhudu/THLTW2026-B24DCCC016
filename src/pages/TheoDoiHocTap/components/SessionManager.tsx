import { Button, Input, Table, Space, DatePicker, Select, message } from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const { Option } = Select;
const KEY = 'studyData';

const SessionManager = () => {
	const [subjects, setSubjects] = useState<any[]>([]);
	const [sessions, setSessions] = useState<any[]>([]);
	const [subjectId, setSubjectId] = useState<number | null>(null);
	const [hours, setHours] = useState('');
	const [note, setNote] = useState('');
	const [date, setDate] = useState<any>(null);

	useEffect(() => {
		const raw = localStorage.getItem(KEY);
		if (raw) {
			const data = JSON.parse(raw);
			setSubjects(data.subjects || []);
			setSessions(data.sessions || []);
		}
	}, []);

	const save = (newSessions: any[]) => {
		const raw = localStorage.getItem(KEY);
		const data = raw ? JSON.parse(raw) : {};
		data.sessions = newSessions;
		localStorage.setItem(KEY, JSON.stringify(data));
		setSessions(newSessions);
	};

	const addSession = () => {
		if (!subjectId || !hours || !date) {
			message.warning('Hãy điền đủ thông tin');
			return;
		}

		const subject = subjects.find((s) => s.id === subjectId);

		const newSession = {
			id: Date.now(),
			subjectId,
			subjectName: subject?.name,
			hours: Number(hours),
			note,
			date: date.format('YYYY-MM-DD'),
		};

		const newSessions = [...sessions, newSession];
		save(newSessions);

		setHours('');
		setNote('');
		setDate(null);

		message.success('Đã thêm nhật ký');
	};

	const deleteSession = (id: number) => {
		const newSessions = sessions.filter((s) => s.id !== id);
		save(newSessions);
		message.success('Đã xóa');
	};

	const columns = [
		{
			title: 'Môn',
			dataIndex: 'subjectName',
		},
		{
			title: 'Ngày',
			dataIndex: 'date',
		},
		{
			title: 'Số giờ',
			dataIndex: 'hours',
		},
		{
			title: 'Ghi chú',
			dataIndex: 'note',
		},
		{
			title: 'Thao tác',
			render: (_: any, record: any) => (
				<Button danger onClick={() => deleteSession(record.id)}>
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

				<DatePicker value={date} onChange={(value) => setDate(value)} />

				<Input
					placeholder='Số giờ'
					type='number'
					value={hours}
					onChange={(e) => setHours(e.target.value)}
					style={{ width: 100 }}
				/>

				<Input placeholder='Ghi chú' value={note} onChange={(e) => setNote(e.target.value)} />

				<Button type='primary' onClick={addSession}>
					Thêm
				</Button>
			</Space>

			<Table rowKey='id' columns={columns} dataSource={sessions} pagination={false} />
		</>
	);
};

export default SessionManager;
