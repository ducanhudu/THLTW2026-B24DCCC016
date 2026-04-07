import React, { useState, useEffect, useMemo } from 'react';
import {
	Card,
	Typography,
	Row,
	Col,
	Statistic,
	Timeline,
	Button,
	Modal,
	Form,
	Select,
	InputNumber,
	List,
	Popconfirm,
	message,
	Empty,
} from 'antd';
import { PlusOutlined, DeleteOutlined, FieldTimeOutlined, DollarCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

interface Destination {
	id: string;
	name: string;
	type: string;
	price: number;
}

interface TripItem {
	id: string;
	destinationId: string;
	name: string;
	price: number;
	day: number;
}

const DESTINATIONS_KEY = 'travel_destinations';
const ITINERARY_KEY = 'travel_itinerary';

const TripPlanner: React.FC = () => {
	const [itinerary, setItinerary] = useState<TripItem[]>([]);
	const [availableDestinations, setAvailableDestinations] = useState<Destination[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [form] = Form.useForm();

	useEffect(() => {
		const savedDestinations = localStorage.getItem(DESTINATIONS_KEY);
		if (savedDestinations) {
			setAvailableDestinations(JSON.parse(savedDestinations));
		}

		const savedItinerary = localStorage.getItem(ITINERARY_KEY);
		if (savedItinerary) {
			setItinerary(JSON.parse(savedItinerary));
		}
	}, []);

	useEffect(() => {
		localStorage.setItem(ITINERARY_KEY, JSON.stringify(itinerary));
	}, [itinerary]);

	const handleAddItem = (values: { destinationId: string; day: number }) => {
		const destination = availableDestinations.find((d) => d.id === values.destinationId);
		if (!destination) return;

		const newItem: TripItem = {
			id: Date.now().toString(),
			destinationId: destination.id,
			name: destination.name,
			price: destination.price,
			day: values.day,
		};

		setItinerary((prev) => [...prev, newItem].sort((a, b) => a.day - b.day));
		setIsModalOpen(false);
		form.resetFields();
		message.success(`Đã thêm ${destination.name} vào ngày ${values.day}`);
	};

	const removeItem = (id: string) => {
		setItinerary((prev) => prev.filter((item) => item.id !== id));
		message.success('Đã xóa điểm đến khỏi lịch trình');
	};

	const totals = useMemo(() => {
		const totalCost = itinerary.reduce((sum, item) => sum + item.price, 0);
		const dayNumbers = itinerary.map((item) => item.day);
		const totalDays = dayNumbers.length > 0 ? Math.max(...dayNumbers) : 0;
		return { totalCost, totalDays };
	}, [itinerary]);

	const groupedSchedule = useMemo(() => {
		const groups: Record<number, TripItem[]> = {};
		itinerary.forEach((item) => {
			if (!groups[item.day]) groups[item.day] = [];
			groups[item.day].push(item);
		});
		return Object.entries(groups).sort(([dayA], [dayB]) => Number(dayA) - Number(dayB));
	}, [itinerary]);

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
	};

	return (
		<div style={{ padding: '0 8px' }}>
			<Row justify='space-between' align='middle' style={{ marginBottom: 24 }}>
				<Col>
					<Title level={3} style={{ margin: 0 }}>
						Lịch trình chuyến đi
					</Title>
				</Col>
				<Col>
					<Button
						type='primary'
						icon={<PlusOutlined />}
						onClick={() => setIsModalOpen(true)}
						disabled={availableDestinations.length === 0}
					>
						Thêm điểm đến
					</Button>
				</Col>
			</Row>

			<Card bodyStyle={{ padding: '20px' }} style={{ marginBottom: 24 }}>
				<Row gutter={16}>
					<Col span={12}>
						<Statistic
							title='Tổng chi phí dự kiến'
							value={totals.totalCost}
							prefix={<DollarCircleOutlined />}
							suffix='VND'
							valueStyle={{ color: '#cf1322' }}
						/>
					</Col>
					<Col span={12}>
						<Statistic title='Tổng số ngày' value={totals.totalDays} prefix={<FieldTimeOutlined />} suffix='Ngày' />
					</Col>
				</Row>
			</Card>

			<Card title='Chi tiết hành trình' bodyStyle={{ padding: '24px' }}>
				{groupedSchedule.length > 0 ? (
					<Timeline mode='left'>
						{groupedSchedule.map(([day, items]) => (
							<Timeline.Item key={day} label={<Text strong>Ngày {day}</Text>}>
								<List
									size='small'
									dataSource={items}
									renderItem={(item, index) => (
										<List.Item key={index}>
											actions=
											{[
												<Popconfirm
													title='Bạn có chắc chắn muốn xóa?'
													onConfirm={() => removeItem(item.id)}
													okText='Có'
													cancelText='Không'
												>
													<Button type='text' danger icon={<DeleteOutlined />} size='small' />
												</Popconfirm>,
											]}
											<List.Item.Meta
												title={item.name}
												description={<Text type='secondary'>{formatPrice(item.price)}</Text>}
											/>
										</List.Item>
									)}
								/>
							</Timeline.Item>
						))}
					</Timeline>
				) : (
					<Empty description='Chưa có lịch trình. Hãy bắt đầu thêm điểm đến!' />
				)}
			</Card>

			<Modal
				title='Thêm điểm đến vào lịch trình'
				visible={isModalOpen}
				onCancel={() => setIsModalOpen(false)}
				onOk={() => form.submit()}
				okText='Thêm'
				cancelText='Hủy'
			>
				<Form form={form} layout='vertical' onFinish={handleAddItem} initialValues={{ day: 1 }}>
					<Form.Item
						name='destinationId'
						label='Chọn điểm đến'
						rules={[{ required: true, message: 'Vui lòng chọn điểm đến' }]}
					>
						<Select placeholder='Chọn một điểm đến để khám phá'>
							{availableDestinations.map((d) => (
								<Option key={d.id} value={d.id}>
									{d.name} ({formatPrice(d.price)})
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item
						name='day'
						label='Ngày thứ mấy trong hành trình'
						rules={[{ required: true, message: 'Vui lòng nhập ngày' }]}
					>
						<InputNumber min={1} style={{ width: '100%' }} />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default TripPlanner;
