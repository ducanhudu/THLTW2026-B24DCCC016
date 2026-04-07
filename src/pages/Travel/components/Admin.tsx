import React, { useState, useEffect } from 'react';
import {
	Table,
	Card,
	Button,
	Modal,
	Form,
	Input,
	InputNumber,
	Select,
	Rate,
	Space,
	Popconfirm,
	message,
	Typography,
	Tag,
	Image,
	Row,
	Col,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface Destination {
	id: string;
	name: string;
	description: string;
	image: string;
	type: 'beach' | 'mountain' | 'city';
	rating: number;
	diningCost: number;
	accommodationCost: number;
	transportCost: number;
	price: number;
}

const LOCAL_STORAGE_KEY = 'travel_destinations';

const MOCK_DATA: Destination[] = [
	{
		id: '1',
		name: 'Vịnh Hạ Long',
		description: 'Kỳ quan thiên nhiên thế giới với hàng ngàn đảo đá vôi kỳ vĩ.',
		type: 'beach',
		image: 'https://vcdn1-dulich.vnecdn.net/2022/06/01/vinh-Ha-Long-VNE-5421-1654064071.jpg',
		rating: 5,
		diningCost: 1000000,
		accommodationCost: 2000000,
		transportCost: 500000,
		price: 3500000,
	},
	{
		id: '2',
		name: 'Sa Pa',
		description: 'Thị trấn trong sương với những ruộng bậc thang tuyệt đẹp.',
		type: 'mountain',
		image: 'https://vcdn1-dulich.vnecdn.net/2022/05/11/Sapa-VNE-8926-1652254443.jpg',
		rating: 4.5,
		diningCost: 700000,
		accommodationCost: 1200000,
		transportCost: 300000,
		price: 2200000,
	},
];

const Admin: React.FC = () => {
	const [destinations, setDestinations] = useState<Destination[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<Destination | null>(null);
	const [form] = Form.useForm();

	useEffect(() => {
		const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
		if (savedData) {
			setDestinations(JSON.parse(savedData));
		} else {
			setDestinations(MOCK_DATA);
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(MOCK_DATA));
		}
	}, []);

	const saveToStorage = (data: Destination[]) => {
		setDestinations(data);
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
	};

	const handleOpenModal = (item?: Destination) => {
		if (item) {
			setEditingItem(item);
			form.setFieldsValue(item);
		} else {
			setEditingItem(null);
			form.resetFields();
		}
		setIsModalOpen(true);
	};

	const handleDelete = (id: string) => {
		const newData = destinations.filter((item) => item.id !== id);
		saveToStorage(newData);
		message.success('Đã xóa điểm đến thành công');
	};

	const parseSafeNumber = (value: any): number => {
		if (typeof value === 'number') return value;
		if (typeof value === 'string') {
			const cleaned = value.replace(/\D/g, '');
			return cleaned ? parseInt(cleaned, 10) : 0;
		}
		return 0;
	};

	const handleSave = (values: any) => {
		const dCost = parseSafeNumber(values.diningCost);
		const aCost = parseSafeNumber(values.accommodationCost);
		const tCost = parseSafeNumber(values.transportCost);

		const totalPrice = dCost + aCost + tCost;

		const newItem: Destination = {
			...values,
			id: editingItem ? editingItem.id : Date.now().toString(),
			diningCost: dCost,
			accommodationCost: aCost,
			transportCost: tCost,
			price: totalPrice,
		};

		let newData;
		if (editingItem) {
			newData = destinations.map((item) => (item.id === editingItem.id ? newItem : item));
			message.success('Đã cập nhật điểm đến thành công');
		} else {
			newData = [...destinations, newItem];
			message.success('Đã thêm điểm đến mới thành công');
		}

		saveToStorage(newData);
		setIsModalOpen(false);
	};

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
	};

	const columns = [
		{
			title: 'Ảnh',
			dataIndex: 'image',
			key: 'image',
			width: 100,
			render: (url: string) => (
				<Image src={url} width={80} height={50} style={{ objectFit: 'cover', borderRadius: 4 }} />
			),
		},
		{
			title: 'Tên điểm đến',
			dataIndex: 'name',
			key: 'name',
			render: (text: string) => <Text strong>{text}</Text>,
		},
		{
			title: 'Loại hình',
			dataIndex: 'type',
			key: 'type',
			render: (type: string) => {
				const color = type === 'beach' ? 'blue' : type === 'mountain' ? 'green' : 'orange';
				const label = type === 'beach' ? 'Biển' : type === 'mountain' ? 'Núi' : 'Thành phố';
				return <Tag color={color}>{label}</Tag>;
			},
		},
		{
			title: 'Đánh giá',
			dataIndex: 'rating',
			key: 'rating',
			render: (val: number) => <Rate disabled defaultValue={val} allowHalf style={{ fontSize: 12 }} />,
		},
		{
			title: 'Tổng chi phí',
			dataIndex: 'price',
			key: 'price',
			render: (val: number) => (
				<Text type='danger' strong>
					{formatPrice(val)}
				</Text>
			),
		},
		{
			title: 'Thao tác',
			key: 'actions',
			width: 150,
			render: (_: any, record: Destination) => (
				<Space>
					<Button type='primary' ghost icon={<EditOutlined />} size='small' onClick={() => handleOpenModal(record)} />
					<Popconfirm
						title='Bạn có chắc chắn muốn xóa điểm đến này?'
						onConfirm={() => handleDelete(record.id)}
						okText='Xóa'
						cancelText='Hủy'
						okButtonProps={{ danger: true }}
					>
						<Button type='primary' danger ghost icon={<DeleteOutlined />} size='small' />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div style={{ padding: '0 8px' }}>
			<Card
				title={
					<Title level={3} style={{ margin: '8px 0' }}>
						Quản trị điểm đến du lịch
					</Title>
				}
				extra={
					<Button type='primary' icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
						Thêm điểm đến
					</Button>
				}
			>
				<Table dataSource={destinations} columns={columns} rowKey='id' pagination={{ pageSize: 5 }} />
			</Card>

			<Modal
				title={editingItem ? 'Cập nhật điểm đến' : 'Thêm điểm đến mới'}
				visible={isModalOpen}
				onCancel={() => setIsModalOpen(false)}
				onOk={() => form.submit()}
				width={720}
				okText={editingItem ? 'Cập nhật' : 'Thêm mới'}
				cancelText='Hủy'
			>
				<Form
					form={form}
					layout='vertical'
					onFinish={handleSave}
					initialValues={{ rating: 5, type: 'beach', diningCost: 0, accommodationCost: 0, transportCost: 0 }}
				>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name='name' label='Tên điểm đến' rules={[{ required: true, message: 'Nhập tên điểm đến' }]}>
								<Input placeholder='Vịnh Hạ Long, Đà Lạt...' />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='type' label='Loại hình' rules={[{ required: true }]}>
								<Select>
									<Option value='beach'>Biển</Option>
									<Option value='mountain'>Núi</Option>
									<Option value='city'>Thành phố</Option>
								</Select>
							</Form.Item>
						</Col>
					</Row>

					<Form.Item name='image' label='URL Hình ảnh' rules={[{ required: true, message: 'Nhập URL hình ảnh' }]}>
						<Input placeholder='https://...' />
					</Form.Item>

					<Form.Item name='description' label='Mô tả'>
						<TextArea rows={3} placeholder='Mô tả ngắn về điểm đến...' />
					</Form.Item>

					<Form.Item name='rating' label='Đánh giá'>
						<Rate allowHalf />
					</Form.Item>

					<Title level={5}>Chi phí dự kiến (VND)</Title>
					<Row gutter={16}>
						<Col span={8}>
							<Form.Item name='diningCost' label='Ăn uống'>
								<InputNumber
									style={{ width: '100%' }}
									min={0}
									formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
									parser={(value) => (value ? value.replace(/\D/g, '') : '') as any}
								/>
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name='accommodationCost' label='Lưu trú'>
								<InputNumber
									style={{ width: '100%' }}
									min={0}
									formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
									parser={(value) => (value ? value.replace(/\D/g, '') : '') as any}
								/>
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name='transportCost' label='Di chuyển'>
								<InputNumber
									style={{ width: '100%' }}
									min={0}
									formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
									parser={(value) => (value ? value.replace(/\D/g, '') : '') as any}
								/>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Modal>
		</div>
	);
};

export default Admin;
