import { useState, useEffect } from 'react';
import { Table, Select, Input, Button, Rate, message, Space, Card } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

export default function Reviews() {
	const [reviews, setReviews] = useState<any[]>([]);
	const [bookings, setBookings] = useState<any[]>([]);
	const [employees, setEmployees] = useState<any[]>([]);
	const [services, setServices] = useState<any[]>([]);

	const [bookingId, setBookingId] = useState<number | null>(null);
	const [rating, setRating] = useState<number>(5);
	const [content, setContent] = useState('');

	useEffect(() => {
		setReviews(JSON.parse(localStorage.getItem('reviews') || '[]'));
		setBookings(JSON.parse(localStorage.getItem('bookings') || '[]'));
		setEmployees(JSON.parse(localStorage.getItem('employees') || '[]'));
		setServices(JSON.parse(localStorage.getItem('services') || '[]'));
	}, []);

	const save = (data: any[]) => {
		setReviews(data);
		localStorage.setItem('reviews', JSON.stringify(data));
	};

	const getEmpName = (id: number) => employees.find((e) => e.id === id)?.name || '';

	const getSerName = (id: number) => services.find((s) => s.id === id)?.name || '';

	// ✅ CHỈ LẤY LỊCH HOÀN THÀNH VÀ CHƯA ĐÁNH GIÁ
	const validBookings = bookings.filter((b) => {
		const isDone = b.status === 'Hoàn thành';
		const isReviewed = reviews.some((r) => r.bookingId === b.id);
		return isDone && !isReviewed;
	});

	const handleSubmit = () => {
		if (!bookingId || !content) {
			message.warning('Thiếu thông tin');
			return;
		}

		const newReview = {
			id: Date.now(),
			bookingId,
			rating,
			content,
			createdAt: new Date().toISOString(),
		};

		save([...reviews, newReview]);

		setBookingId(null);
		setRating(5);
		setContent('');

		message.success('Đánh giá thành công!');
	};

	const columns = [
		{
			title: 'Nhân viên',
			render: (r: any) => {
				const b = bookings.find((item) => item.id === r.bookingId);
				return getEmpName(b?.empId);
			},
		},
		{
			title: 'Dịch vụ',
			render: (r: any) => {
				const b = bookings.find((item) => item.id === r.bookingId);
				return getSerName(b?.serId);
			},
		},
		{
			title: 'Số sao',
			render: (r: any) => <Rate disabled value={r.rating} />,
		},
		{
			title: 'Nội dung',
			dataIndex: 'content',
		},
		{
			title: 'Ngày',
			render: (r: any) => dayjs(r.createdAt).format('DD/MM/YYYY HH:mm'),
		},
	];

	return (
		<div>
			<h2>Đánh giá</h2>

			<Card style={{ marginBottom: 20 }}>
				<Space wrap size='large'>
					<Select placeholder='Chọn lịch' style={{ width: 260 }} value={bookingId || undefined} onChange={setBookingId}>
						{validBookings.map((b) => (
							<Option key={b.id} value={b.id}>
								{getEmpName(b.empId)} - {getSerName(b.serId)} - {dayjs(b.start).format('DD/MM HH:mm')}
							</Option>
						))}
					</Select>

					<div>
						<div style={{ fontSize: 12, marginBottom: 4 }}>Đánh giá</div>
						<Rate value={rating} onChange={setRating} />
					</div>

					<TextArea
						placeholder='Nhập đánh giá'
						value={content}
						onChange={(e) => setContent(e.target.value)}
						autoSize={{ minRows: 1, maxRows: 3 }}
						style={{ width: 260 }}
					/>

					<Button type='primary' onClick={handleSubmit}>
						Gửi
					</Button>
				</Space>
			</Card>

			<Table dataSource={reviews} rowKey='id' columns={columns} />
		</div>
	);
}
