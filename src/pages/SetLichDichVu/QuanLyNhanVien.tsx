import { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Space, Tag, InputNumber, TimePicker } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

const { Option } = Select;

type Employee = {
	id: number;
	name: string;
	limit: number;
	workTime: [string, string];
	days: string[];
	status: string;
};

export default function Employees() {
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [name, setName] = useState('');
	const [limit, setLimit] = useState<number | null>(null);
	const [workTime, setWorkTime] = useState<[Dayjs | null, Dayjs | null] | null>(null);
	const [days, setDays] = useState<string[]>([]);
	const [status, setStatus] = useState('active');
	const [editId, setEditId] = useState<number | null>(null);

	useEffect(() => {
		const data = localStorage.getItem('employees');
		if (data) setEmployees(JSON.parse(data));
	}, []);

	const save = (data: Employee[]) => {
		setEmployees(data);
		localStorage.setItem('employees', JSON.stringify(data));
	};

	const resetForm = () => {
		setName('');
		setLimit(null);
		setWorkTime(null);
		setDays([]);
		setStatus('active');
		setEditId(null);
	};

	const handleSubmit = () => {
		if (!name || !limit || !workTime || !workTime[0] || !workTime[1] || days.length === 0) return;

		const newEmp: Employee = {
			id: editId || Date.now(),
			name,
			limit,
			workTime: [workTime[0].toISOString(), workTime[1].toISOString()],
			days,
			status,
		};

		const newData = editId ? employees.map((emp) => (emp.id === editId ? newEmp : emp)) : [...employees, newEmp];

		save(newData);
		resetForm();
	};

	const handleEdit = (emp: Employee) => {
		setName(emp.name);
		setLimit(emp.limit);
		setDays(emp.days);
		setStatus(emp.status);
		setEditId(emp.id);

		if (emp.workTime?.length === 2) {
			const start = dayjs(emp.workTime[0]);
			const end = dayjs(emp.workTime[1]);

			if (start.isValid() && end.isValid()) {
				setWorkTime([start, end]);
			} else {
				setWorkTime(null);
			}
		} else {
			setWorkTime(null);
		}
	};

	const handleDelete = (id: number) => {
		save(employees.filter((emp) => emp.id !== id));
	};

	const columns = [
		{ title: 'Tên', dataIndex: 'name' },
		{ title: 'Giới hạn/ngày', render: (record: Employee) => `${record.limit} khách` },
		{
			title: 'Giờ làm',
			render: (record: Employee) => {
				if (!record.workTime) return '';
				const start = dayjs(record.workTime[0]).format('HH:mm');
				const end = dayjs(record.workTime[1]).format('HH:mm');
				return `${start} - ${end}`;
			},
		},
		{
			title: 'Ngày làm',
			render: (record: Employee) => record.days.map((day) => <Tag key={day}>{day}</Tag>),
		},
		{
			title: 'Trạng thái',
			render: (record: Employee) =>
				record.status === 'active' ? <Tag color='green'>Đang làm</Tag> : <Tag color='red'>Nghỉ</Tag>,
		},
		{
			title: 'Action',
			render: (record: Employee) => (
				<>
					<Button onClick={() => handleEdit(record)} style={{ marginRight: 10 }}>
						Sửa
					</Button>
					<Button danger onClick={() => handleDelete(record.id)}>
						Xóa
					</Button>
				</>
			),
		},
	];

	return (
		<div>
			<h2>Quản lý nhân viên</h2>

			<Space wrap>
				<Input
					placeholder='Tên nhân viên'
					value={name}
					onChange={(e) => setName(e.target.value)}
					style={{ width: 180 }}
				/>

				<InputNumber placeholder='Số khách' value={limit} onChange={(v) => setLimit(v)} addonAfter='khách' />

				<TimePicker.RangePicker format='HH:mm' value={workTime} onChange={(value) => setWorkTime(value)} />

				<Select mode='multiple' placeholder='Ngày làm' style={{ width: 200 }} value={days} onChange={setDays}>
					<Option value='T2'>T2</Option>
					<Option value='T3'>T3</Option>
					<Option value='T4'>T4</Option>
					<Option value='T5'>T5</Option>
					<Option value='T6'>T6</Option>
					<Option value='T7'>T7</Option>
					<Option value='CN'>CN</Option>
				</Select>

				<Select value={status} onChange={setStatus}>
					<Option value='active'>Đang làm</Option>
					<Option value='off'>Nghỉ</Option>
				</Select>

				<Button type='primary' onClick={handleSubmit}>
					{editId ? 'Cập nhật' : 'Thêm'}
				</Button>
			</Space>

			<Table dataSource={employees} rowKey='id' columns={columns} style={{ marginTop: 20 }} />
		</div>
	);
}
