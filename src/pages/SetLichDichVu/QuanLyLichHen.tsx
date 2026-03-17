import { useState, useEffect } from 'react';
import { Table, Button, Select, DatePicker, TimePicker, Tag, message } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;

export default function Bookings() {
	const [bookings, setBookings] = useState<any[]>([]);
	const [employees, setEmployees] = useState<any[]>([]);
	const [services, setServices] = useState<any[]>([]);

	const [empId, setEmpId] = useState<number | null>(null);
	const [serId, setSerId] = useState<number | null>(null);
	const [date, setDate] = useState<any>(null);
	const [time, setTime] = useState<any>(null);

	useEffect(() => {
		setEmployees(JSON.parse(localStorage.getItem('employees') || '[]'));
		setServices(JSON.parse(localStorage.getItem('services') || '[]'));
		setBookings(JSON.parse(localStorage.getItem('bookings') || '[]'));
	}, []);

	const save = (data: any[]) => {
		setBookings(data);
		localStorage.setItem('bookings', JSON.stringify(data));
	};

	const getDayKey = (d: any) => {
		const day = d.day();
		return ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][day];
	};

	const add = () => {
		if (!empId || !serId || !date || !time) {
			message.error('Thiếu thông tin');
			return;
		}

		const emp = employees.find((e) => e.id === empId);
		const ser = services.find((s) => s.id === serId);

		if (!emp || !ser) return;

		if (!ser.employees.includes(empId)) {
			message.error('Nhân viên không làm dịch vụ này');
			return;
		}

		if (emp.status !== 'active') {
			message.error('Nhân viên không hoạt động');
			return;
		}

		const dayKey = getDayKey(date);
		if (!emp.days.includes(dayKey)) {
			message.error('Nhân viên không làm ngày này');
			return;
		}

		const startTime = dayjs(date).hour(time.hour()).minute(time.minute()).second(0);

		const endTime = startTime.add(ser.duration, 'minute');

		const workStartRaw = dayjs(emp.workTime[0]);
		const workEndRaw = dayjs(emp.workTime[1]);

		const startWork = dayjs(date).hour(workStartRaw.hour()).minute(workStartRaw.minute());

		const endWork = dayjs(date).hour(workEndRaw.hour()).minute(workEndRaw.minute());

		if (startTime.isBefore(startWork) || endTime.isAfter(endWork)) {
			message.error('Ngoài giờ làm việc của nhân viên');
			return;
		}

		const sameDayBookings = bookings.filter(
			(b) => b.empId === empId && dayjs(b.start).format('YYYY-MM-DD') === date.format('YYYY-MM-DD'),
		);

		if (sameDayBookings.length >= emp.limit) {
			message.error('Nhân viên đã đạt giới hạn khách trong ngày');
			return;
		}

		const isOverlap = sameDayBookings.find((b) => {
			const bStart = dayjs(b.start);
			const bEnd = dayjs(b.end);

			return startTime.isBefore(bEnd) && endTime.isAfter(bStart);
		});

		if (isOverlap) {
			message.error('Trùng lịch với khách khác');
			return;
		}

		const newBooking = {
			id: Date.now(),
			empId,
			serId,
			start: startTime.toISOString(),
			end: endTime.toISOString(),
			status: 'Chờ duyệt',
		};

		save([...bookings, newBooking]);
	};

	const getEmpName = (id: number) => {
		return employees.find((e) => e.id === id)?.name || '';
	};

	const getSerName = (id: number) => {
		return services.find((s) => s.id === id)?.name || '';
	};

	const filteredServices = empId ? services.filter((s) => s.employees.includes(empId)) : services;

	const updateStatus = (id: number, status: string) => {
		const newData = bookings.map((b) => (b.id === id ? { ...b, status } : b));
		save(newData);
	};

	const columns = [
		{
			title: 'Nhân viên',
			render: (r: any) => getEmpName(r.empId),
		},
		{
			title: 'Dịch vụ',
			render: (r: any) => getSerName(r.serId),
		},
		{
			title: 'Bắt đầu',
			render: (r: any) => dayjs(r.start).format('DD/MM HH:mm'),
		},
		{
			title: 'Kết thúc',
			render: (r: any) => dayjs(r.end).format('DD/MM HH:mm'),
		},
		{
			title: 'Trạng thái',
			render: (r: any) => {
				let color = 'orange';
				if (r.status === 'Hoàn thành') color = 'green';
				if (r.status === 'Hủy') color = 'red';

				return <Tag color={color}>{r.status}</Tag>;
			},
		},
		{
			title: 'Hành động',
			render: (r: any) => (
				<>
					{r.status === 'Chờ duyệt' && (
						<>
							<Button type='primary' style={{ marginRight: 8 }} onClick={() => updateStatus(r.id, 'Xác nhận')}>
								Duyệt
							</Button>

							<Button danger onClick={() => updateStatus(r.id, 'Hủy')}>
								Hủy
							</Button>
						</>
					)}

					{r.status === 'Xác nhận' && <Button onClick={() => updateStatus(r.id, 'Hoàn thành')}>Hoàn thành</Button>}
				</>
			),
		},
	];

	return (
		<div>
			<h2>Quản lý lịch hẹn</h2>

			<div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
				<Select
					placeholder='Nhân viên'
					style={{ width: 150 }}
					onChange={(v) => {
						setEmpId(v);
						setSerId(null);
					}}
				>
					{employees.map((e) => (
						<Option key={e.id} value={e.id}>
							{e.name}
						</Option>
					))}
				</Select>

				<Select placeholder='Dịch vụ' style={{ width: 150 }} value={serId || undefined} onChange={setSerId}>
					{filteredServices.map((s) => (
						<Option key={s.id} value={s.id}>
							{s.name}
						</Option>
					))}
				</Select>

				<DatePicker onChange={setDate} />

				<TimePicker format='HH:mm' onChange={setTime} />

				<Button type='primary' onClick={add}>
					Đặt lịch
				</Button>
			</div>

			<Table dataSource={bookings} rowKey='id' columns={columns} style={{ marginTop: 20 }} />
		</div>
	);
}
