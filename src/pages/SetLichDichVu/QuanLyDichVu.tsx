import { useState, useEffect } from 'react';
import { Table, Button, Input, InputNumber, Select, Space, Tag } from 'antd';

const { Option } = Select;

export default function Services() {
	const [services, setServices] = useState<any[]>([]);
	const [employees, setEmployees] = useState<any[]>([]);

	const [name, setName] = useState('');
	const [price, setPrice] = useState<number | null>(null);
	const [duration, setDuration] = useState<number | null>(null);
	const [empIds, setEmpIds] = useState<number[]>([]);
	const [status, setStatus] = useState('active');

	const [editId, setEditId] = useState<number | null>(null);

	useEffect(() => {
		const s = localStorage.getItem('services');
		if (s) setServices(JSON.parse(s));

		const e = localStorage.getItem('employees');
		if (e) setEmployees(JSON.parse(e));
	}, []);

	const save = (data: any[]) => {
		setServices(data);
		localStorage.setItem('services', JSON.stringify(data));
	};

	const reset = () => {
		setName('');
		setPrice(null);
		setDuration(null);
		setEmpIds([]);
		setStatus('active');
		setEditId(null);
	};

	const handleSubmit = () => {
		if (!name || !price || !duration || empIds.length === 0) return;

		const newService = {
			id: editId || Date.now(),
			name,
			price,
			duration,
			employees: empIds,
			status,
		};

		const newData = editId ? services.map((s) => (s.id === editId ? newService : s)) : [...services, newService];

		save(newData);
		reset();
	};

	const handleEdit = (s: any) => {
		setName(s.name);
		setPrice(s.price);
		setDuration(s.duration);
		setEmpIds(s.employees || []);
		setStatus(s.status);
		setEditId(s.id);
	};

	const handleDelete = (id: number) => {
		save(services.filter((s) => s.id !== id));
	};

	const getEmployeeNames = (ids: number[]) => {
		return ids.map((id) => {
			const emp = employees.find((e) => e.id === id);
			return emp?.name || '';
		});
	};

	const columns = [
		{ title: 'Tên dịch vụ', dataIndex: 'name' },
		{ title: 'Giá', render: (r: any) => `${r.price} VND` },
		{ title: 'Thời lượng', render: (r: any) => `${r.duration} phút` },
		{
			title: 'Nhân viên',
			render: (r: any) => getEmployeeNames(r.employees).map((n: string) => <Tag key={n}>{n}</Tag>),
		},
		{
			title: 'Trạng thái',
			render: (r: any) =>
				r.status === 'active' ? <Tag color='green'>Hoạt động</Tag> : <Tag color='red'>Tạm dừng</Tag>,
		},
		{
			title: 'Action',
			render: (r: any) => (
				<>
					<Button onClick={() => handleEdit(r)} style={{ marginRight: 10 }}>
						Sửa
					</Button>
					<Button danger onClick={() => handleDelete(r.id)}>
						Xóa
					</Button>
				</>
			),
		},
	];

	return (
		<div>
			<h2>Quản lý dịch vụ</h2>

			<Space wrap>
				<Input placeholder='Tên dịch vụ' value={name} onChange={(e) => setName(e.target.value)} />

				<InputNumber placeholder='Giá' value={price} onChange={setPrice} addonAfter='VND' />

				<InputNumber placeholder='Thời lượng' value={duration} onChange={setDuration} addonAfter='phút' />

				<Select mode='multiple' placeholder='Chọn nhân viên' style={{ width: 200 }} value={empIds} onChange={setEmpIds}>
					{employees.map((e) => (
						<Option key={e.id} value={e.id}>
							{e.name}
						</Option>
					))}
				</Select>

				<Select value={status} onChange={setStatus}>
					<Option value='active'>Hoạt động</Option>
					<Option value='off'>Tạm dừng</Option>
				</Select>

				<Button type='primary' onClick={handleSubmit}>
					{editId ? 'Cập nhật' : 'Thêm'}
				</Button>
			</Space>

			<Table dataSource={services} rowKey='id' columns={columns} style={{ marginTop: 20 }} />
		</div>
	);
}
