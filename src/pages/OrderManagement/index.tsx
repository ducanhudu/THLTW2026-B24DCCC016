import React, { useState, useMemo } from 'react';
import {
	Table,
	Button,
	Modal,
	Form,
	Input,
	InputNumber,
	Select,
	Tag,
	Space,
	Card,
	Row,
	Col,
	message,
	Typography,
	DatePicker,
	List,
} from 'antd';
import { PlusOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { Order, OrderStatus } from '@/models/orders';
import { Product } from '@/models/products';
import moment from 'moment';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface OrderItem {
	productId: number;
	productName: string;
	quantity: number;
	price: number;
}

interface OrderFormValues {
	customerName: string;
	phone: string;
	address: string;
	productIds: number[];
	[key: string]: any;
}

const OrderManagement = () => {
	const { orders, addOrder, updateOrderStatus } = useModel('orders');
	const { products } = useModel('products');
	const [form] = Form.useForm();

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isDetailVisible, setIsDetailVisible] = useState(false);
	const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

	const [searchText, setSearchText] = useState('');
	const [statusFilter, setStatusFilter] = useState<OrderStatus | null>(null);
	const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment] | null>(null);

	const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
	const [formTotal, setFormTotal] = useState(0);

	const handleCreateOrder = (values: OrderFormValues) => {
		const orderItems: OrderItem[] = [];
		let total = 0;

		if (!values.productIds || values.productIds.length === 0) {
			message.error('Vui lòng chọn ít nhất 1 sản phẩm');
			return;
		}

		for (const pId of values.productIds) {
			const qty = values[`qty_${pId}`];
			const product = (products as Product[]).find((p) => p.id === pId);
			if (!product) continue;

			if (qty > product.quantity) {
				message.error(`Sản phẩm ${product.name} không đủ hàng (Tồn: ${product.quantity})`);
				return;
			}

			orderItems.push({
				productId: product.id,
				productName: product.name,
				quantity: qty,
				price: product.price,
			});
			total += product.price * qty;
		}

		addOrder({
			customerName: values.customerName,
			phone: values.phone,
			address: values.address,
			products: orderItems,
			totalAmount: total,
		});

		message.success('Tạo đơn hàng thành công!');
		setIsModalVisible(false);
		form.resetFields();
		setFormTotal(0);
		setSelectedProductIds([]);
	};

	const handleStatusChange = (orderId: string, value: OrderStatus) => {
		updateOrderStatus(orderId, value);
		message.success('Cập nhật trạng thái thành công!');
	};

	const handleRecalculateTotal = (_: any, allValues: OrderFormValues) => {
		let t = 0;
		if (allValues.productIds) {
			allValues.productIds.forEach((pId: number) => {
				const qty = allValues[`qty_${pId}`] || 0;
				const product = (products as Product[]).find((p) => p.id === pId);
				if (product) {
					t += product.price * qty;
				}
			});
		}
		setFormTotal(t);
	};

	// --- FILTERS ---
	const filteredOrders = useMemo(() => {
		return (orders as Order[]).filter((o) => {
			if (searchText) {
				const lowText = searchText.toLowerCase();
				if (!o.customerName.toLowerCase().includes(lowText) && !o.id.toLowerCase().includes(lowText)) return false;
			}
			if (statusFilter && o.status !== statusFilter) return false;
			if (dateRange) {
				const oDate = moment(o.createdAt);
				if (!oDate.isBetween(dateRange[0], dateRange[1], 'day', '[]')) return false;
			}
			return true;
		});
	}, [orders, searchText, statusFilter, dateRange]);

	const columns: ColumnsType<Order> = [
		{
			title: 'Mã ĐH',
			dataIndex: 'id',
			key: 'id',
		},
		{
			title: 'Khách hàng',
			dataIndex: 'customerName',
			key: 'customerName',
		},
		{
			title: 'Sản phẩm',
			key: 'count',
			render: (_: any, r: Order) => r.products.length,
		},
		{
			title: 'Tổng tiền',
			dataIndex: 'totalAmount',
			key: 'totalAmount',
			render: (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val),
			sorter: (a: Order, b: Order) => a.totalAmount - b.totalAmount,
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'createdAt',
			key: 'createdAt',
			sorter: (a: Order, b: Order) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
		},
		{
			title: 'Trạng thái',
			key: 'status',
			render: (_: any, r: Order) => (
				<Select
					value={r.status}
					onChange={(val) => handleStatusChange(r.id, val)}
					style={{ width: 140 }}
					bordered={false}
				>
					<Option value='Chờ xử lý'>
						<Tag color='orange'>Chờ xử lý</Tag>
					</Option>
					<Option value='Đang giao'>
						<Tag color='blue'>Đang giao</Tag>
					</Option>
					<Option value='Hoàn thành'>
						<Tag color='green'>Hoàn thành</Tag>
					</Option>
					<Option value='Đã hủy'>
						<Tag color='red'>Đã hủy</Tag>
					</Option>
				</Select>
			),
		},
		{
			title: 'Thao tác',
			key: 'action',
			render: (_: any, r: Order) => (
				<Button
					icon={<EyeOutlined />}
					onClick={() => {
						setCurrentOrder(r);
						setIsDetailVisible(true);
					}}
				>
					Chi tiết
				</Button>
			),
		},
	];

	return (
		<div style={{ padding: 24 }}>
			<Card>
				<Row justify='space-between' align='middle' style={{ marginBottom: 16 }}>
					<Col>
						<Title level={3}>Quản lý Đơn hàng</Title>
					</Col>
					<Col>
						<Button type='primary' icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
							Tạo đơn hàng
						</Button>
					</Col>
				</Row>

				<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
					<Col span={8}>
						<Input.Search
							placeholder='Tìm tên KH hoặc Mã ĐH...'
							onSearch={(val) => setSearchText(val)}
							onChange={(e) => setSearchText(e.target.value)}
							allowClear
						/>
					</Col>
					<Col span={5}>
						<Select
							style={{ width: '100%' }}
							placeholder='Trạng thái'
							allowClear
							onChange={(val) => setStatusFilter(val)}
						>
							<Option value='Chờ xử lý'>Chờ xử lý</Option>
							<Option value='Đang giao'>Đang giao</Option>
							<Option value='Hoàn thành'>Hoàn thành</Option>
							<Option value='Đã hủy'>Đã hủy</Option>
						</Select>
					</Col>
					<Col span={6}>
						<RangePicker onChange={(dates: any) => setDateRange(dates)} />
					</Col>
				</Row>

				<Table dataSource={filteredOrders} columns={columns} rowKey='id' pagination={{ pageSize: 5 }} />
			</Card>

			<Modal
				title='Tạo đơn hàng mới'
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				width={700}
				footer={null}
				destroyOnClose
			>
				<Form form={form} layout='vertical' onFinish={handleCreateOrder} onValuesChange={handleRecalculateTotal}>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name='customerName' label='Tên khách hàng' rules={[{ required: true }]}>
								<Input placeholder='Nhập tên' />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name='phone'
								label='Số điện thoại'
								rules={[{ required: true }, { pattern: /^\d{10,11}$/, message: 'SĐT không hợp lệ (10-11 số)' }]}
							>
								<Input placeholder='Nhập SĐT' />
							</Form.Item>
						</Col>
					</Row>
					<Form.Item name='address' label='Địa chỉ' rules={[{ required: true }]}>
						<Input.TextArea rows={2} placeholder='Nhập địa chỉ giao hàng' />
					</Form.Item>

					<Form.Item name='productIds' label='Chọn sản phẩm' rules={[{ required: true }]}>
						<Select mode='multiple' placeholder='Chọn sản phẩm' onChange={(vals) => setSelectedProductIds(vals)}>
							{products.map((p: Product) => (
								<Option key={p.id} value={p.id} disabled={p.quantity === 0}>
									{p.name} - Giá: {p.price.toLocaleString()} (Tồn: {p.quantity})
								</Option>
							))}
						</Select>
					</Form.Item>

					{selectedProductIds.map((pId) => {
						const product = (products as Product[]).find((p) => p.id === pId);
						return (
							<Row key={pId} align='middle' gutter={8} style={{ marginBottom: 8 }}>
								<Col span={12}>
									<Text strong>{product?.name}</Text>
								</Col>
								<Col span={8}>
									<Form.Item
										name={`qty_${pId}`}
										noStyle
										initialValue={1}
										rules={[
											{ required: true, message: 'Nhập SL' },
											{ type: 'number', min: 1, message: '> 0' },
										]}
									>
										<InputNumber min={1} max={product?.quantity} addonAfter='cái' />
									</Form.Item>
								</Col>
								<Col span={4}>
									<Text type='secondary'>
										Wait: {(product ? product.price * (form.getFieldValue(`qty_${pId}`) || 1) : 0).toLocaleString()}
									</Text>
								</Col>
							</Row>
						);
					})}

					<div style={{ marginTop: 20, textAlign: 'right' }}>
						<Title level={4}>
							Tổng tiền: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(formTotal)}
						</Title>
						<Button onClick={() => setIsModalVisible(false)} style={{ marginRight: 8 }}>
							Hủy
						</Button>
						<Button type='primary' htmlType='submit'>
							Tạo đơn hàng
						</Button>
					</div>
				</Form>
			</Modal>

			<Modal
				title='Chi tiết đơn hàng'
				visible={isDetailVisible}
				onCancel={() => setIsDetailVisible(false)}
				footer={[
					<Button key='close' onClick={() => setIsDetailVisible(false)}>
						Đóng
					</Button>,
				]}
			>
				{currentOrder && (
					<div>
						<Card type='inner' title='Thông tin khách hàng' size='small'>
							<p>
								<strong>Tên:</strong> {currentOrder.customerName}
							</p>
							<p>
								<strong>SĐT:</strong> {currentOrder.phone}
							</p>
							<p>
								<strong>Địa chỉ:</strong> {currentOrder.address}
							</p>
							<p>
								<strong>Ngày tạo:</strong> {currentOrder.createdAt}
							</p>
							<p>
								<strong>Trạng thái:</strong> <Tag color='blue'>{currentOrder.status}</Tag>
							</p>
						</Card>
						<div style={{ marginTop: 16 }}>
							<Text strong>Sản phẩm:</Text>
							<List
								size='small'
								dataSource={currentOrder.products}
								renderItem={(item) => (
									<List.Item>
										<List.Item.Meta
											title={item.productName}
											description={`SL: ${item.quantity} x ${item.price.toLocaleString()} đ`}
										/>
										<div>{(item.quantity * item.price).toLocaleString()} đ</div>
									</List.Item>
								)}
							/>
							<div style={{ textAlign: 'right', marginTop: 16 }}>
								<Title level={4} type='danger'>
									Tổng cộng: {currentOrder.totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
								</Title>
							</div>
						</div>
					</div>
				)}
			</Modal>
		</div>
	);
};

export default OrderManagement;
