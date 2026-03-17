import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag } from 'antd';

export default function Reports() {
	const [bookings, setBookings] = useState<any[]>([]);
	const [services, setServices] = useState<any[]>([]);
	const [employees, setEmployees] = useState<any[]>([]);
	const [reviews, setReviews] = useState<any[]>([]);

	useEffect(() => {
		setBookings(JSON.parse(localStorage.getItem('bookings') || '[]'));
		setServices(JSON.parse(localStorage.getItem('services') || '[]'));
		setEmployees(JSON.parse(localStorage.getItem('employees') || '[]'));
		setReviews(JSON.parse(localStorage.getItem('reviews') || '[]'));
	}, []);

	const revenue = bookings
		.filter((b) => b.status === 'Hoàn thành')
		.reduce((sum, b) => {
			const service = services.find((s) => s.id === b.serId);
			return sum + (service?.price || 0);
		}, 0);

	const totalBookings = bookings.length;

	const avgRating =
		reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0;

	const empStats = employees.map((emp) => {
		const empBookings = bookings.filter((b) => b.empId === emp.id && b.status === 'Hoàn thành');

		const total = empBookings.length;

		const ratingList = reviews
			.filter((r) => {
				const b = bookings.find((item) => item.id === r.bookingId);
				return b?.empId === emp.id;
			})
			.map((r) => r.rating);

		const avg =
			ratingList.length > 0 ? (ratingList.reduce((acc, val) => acc + val, 0) / ratingList.length).toFixed(1) : 0;

		return {
			name: emp.name,
			total,
			avg,
		};
	});

	const serviceStats = services.map((s) => {
		const count = bookings.filter((b) => b.serId === s.id && b.status === 'Hoàn thành').length;

		return {
			name: s.name,
			count,
		};
	});

	const empColumns = [
		{ title: 'Nhân viên', dataIndex: 'name' },
		{ title: 'Số lịch', dataIndex: 'total' },
		{
			title: 'Rating',
			render: (r: any) => <Tag color='blue'>{r.avg}</Tag>,
		},
	];

	const serviceColumns = [
		{ title: 'Dịch vụ', dataIndex: 'name' },
		{
			title: 'Số lượt',
			dataIndex: 'count',
		},
	];

	return (
		<div>
			<h2>Thống kê</h2>

			<Row gutter={16}>
				<Col span={8}>
					<Card>
						<Statistic title='Doanh thu' value={revenue} suffix='VND' />
					</Card>
				</Col>

				<Col span={8}>
					<Card>
						<Statistic title='Tổng lịch' value={totalBookings} />
					</Card>
				</Col>

				<Col span={8}>
					<Card>
						<Statistic title='Rating TB' value={avgRating} />
					</Card>
				</Col>
			</Row>

			<h3 style={{ marginTop: 30 }}>Top nhân viên</h3>
			<Table dataSource={empStats} rowKey='name' columns={empColumns} pagination={false} />

			<h3 style={{ marginTop: 30 }}>Top dịch vụ</h3>
			<Table dataSource={serviceStats} rowKey='name' columns={serviceColumns} pagination={false} />
		</div>
	);
}
