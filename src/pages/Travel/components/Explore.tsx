import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Input, Select, Rate, Tag, Space, Empty } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

interface Destination {
	id: string;
	name: string;
	type: 'beach' | 'mountain' | 'city';
	image: string;
	rating: number;
	price: number;
}

const MOCK_DATA: Destination[] = [
	{
		id: '1',
		name: 'Vịnh Hạ Long',
		type: 'beach',
		image:
			'https://minio.vnptquangninh.vn/halongbay/images/1730779805B%E1%BB%95%20sung%20tuy%E1%BA%BFn%20tham%20quan-%20%E1%BA%A3nh%20Duy.jpg',
		rating: 5,
		price: 3500000,
	},
	{
		id: '2',
		name: 'Sa Pa',
		type: 'mountain',
		image:
			'https://s3-ap-southeast-1.amazonaws.com/cntatr-assets-ap-southeast-1-250226768838-55a62c9399d4d8a6/2025/05/sapa-co-gi-choi-10-1024x683.jpg?tr=q-70,c-at_max,w-1000,h-600',
		rating: 4.5,
		price: 2200000,
	},
	{
		id: '3',
		name: 'Hà Nội - Phố Cổ',
		type: 'city',
		image: 'https://images.unsplash.com/photo-1555921015-5532091f6026?auto=format&fit=crop&w=800&q=80',
		rating: 4,
		price: 1500000,
	},
	{
		id: '4',
		name: 'Phan Thiết - Mũi Né',
		type: 'beach',
		image: 'https://images.vietnamtourism.gov.vn/vn//images/Muine2.jpg',
		rating: 4.8,
		price: 2800000,
	},
	{
		id: '5',
		name: 'Đà Lạt',
		type: 'mountain',
		image: 'https://images.unsplash.com/photo-1582972236019-ea4af5ffe587?auto=format&fit=crop&w=800&q=80',
		rating: 4.7,
		price: 1800000,
	},
	{
		id: '6',
		name: 'TP. Hồ Chí Minh',
		type: 'city',
		image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80',
		rating: 4.2,
		price: 2000000,
	},
];

const LOCAL_STORAGE_KEY = 'travel_destinations';

const Explore: React.FC = () => {
	const [destinations, setDestinations] = useState<Destination[]>([]);
	const [filteredData, setFilteredData] = useState<Destination[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [filterType, setFilterType] = useState<string>('all');
	const [sortValue, setSortValue] = useState<string>('none');

	useEffect(() => {
		const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
		if (savedData) {
			setDestinations(JSON.parse(savedData));
		} else {
			setDestinations(MOCK_DATA);
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(MOCK_DATA));
		}
	}, []);

	useEffect(() => {
		let result = [...destinations];

		if (searchTerm) {
			result = result.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
		}

		if (filterType !== 'all') {
			result = result.filter((item) => item.type === filterType);
		}
		if (sortValue === 'priceAsc') {
			result.sort((a, b) => a.price - b.price);
		} else if (sortValue === 'priceDesc') {
			result.sort((a, b) => b.price - a.price);
		} else if (sortValue === 'ratingDesc') {
			result.sort((a, b) => b.rating - a.rating);
		}

		setFilteredData(result);
	}, [destinations, searchTerm, filterType, sortValue]);

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
	};

	const getTypeLabel = (type: string) => {
		switch (type) {
			case 'beach':
				return <Tag color='blue'>Biển</Tag>;
			case 'mountain':
				return <Tag color='green'>Núi</Tag>;
			case 'city':
				return <Tag color='orange'>Thành phố</Tag>;
			default:
				return null;
		}
	};

	return (
		<div style={{ padding: '0 8px' }}>
			<Title level={3} style={{ marginBottom: 24 }}>
				Khám phá các điểm đến
			</Title>

			<Card bodyStyle={{ padding: '16px' }} style={{ marginBottom: 24 }}>
				<Row gutter={[16, 16]} align='middle'>
					<Col xs={24} md={8}>
						<Input
							prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
							placeholder='Tìm kiếm điểm đến...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							allowClear
						/>
					</Col>
					<Col xs={12} md={8}>
						<Select
							style={{ width: '100%' }}
							placeholder='Loại hình'
							value={filterType}
							onChange={(value) => setFilterType(value)}
						>
							<Option value='all'>Tất cả loại hình</Option>
							<Option value='beach'>Biển</Option>
							<Option value='mountain'>Núi</Option>
							<Option value='city'>Thành phố</Option>
						</Select>
					</Col>
					<Col xs={12} md={8}>
						<Select
							style={{ width: '100%' }}
							placeholder='Sắp xếp theo'
							value={sortValue}
							onChange={(value) => setSortValue(value)}
						>
							<Option value='none'>Mặc định</Option>
							<Option value='priceAsc'>Giá tăng dần</Option>
							<Option value='priceDesc'>Giá giảm dần</Option>
							<Option value='ratingDesc'>Đánh giá cao nhất</Option>
						</Select>
					</Col>
				</Row>
			</Card>

			{filteredData.length > 0 ? (
				<Row gutter={[16, 16]}>
					{filteredData.map((item) => (
						<Col key={item.id} xs={24} sm={12} md={8} lg={6}>
							<Card
								hoverable
								cover={
									<div style={{ height: 200, overflow: 'hidden' }}>
										<img
											alt={item.name}
											src={item.image}
											style={{ width: '100%', height: '100%', objectFit: 'cover' }}
										/>
									</div>
								}
								bodyStyle={{ padding: '16px' }}
							>
								<div style={{ marginBottom: 8 }}>{getTypeLabel(item.type)}</div>
								<Title level={5} style={{ marginBottom: 8 }}>
									{item.name}
								</Title>
								<Space direction='vertical' size={4} style={{ width: '100%' }}>
									<Rate disabled defaultValue={item.rating} allowHalf style={{ fontSize: 14 }} />
									<Text type='secondary' style={{ fontSize: 13 }}>
										Chỉ từ:{' '}
										<Text strong style={{ color: '#f5222d', fontSize: 16 }}>
											{formatPrice(item.price)}
										</Text>
									</Text>
								</Space>
							</Card>
						</Col>
					))}
				</Row>
			) : (
				<Empty description='Không tìm thấy điểm đến phù hợp' style={{ marginTop: 64 }} />
			)}
		</div>
	);
};

export default Explore;
