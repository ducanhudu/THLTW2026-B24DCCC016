import React, { useState, useMemo } from 'react';
import {
	Table,
	Button,
	Modal,
	Form,
	Input,
	InputNumber,
	Popconfirm,
	message,
	Space,
	Card,
	Typography,
	Row,
	Col,
} from 'antd';
import { DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface Product {
	id: number;
	name: string;
	price: number;
	quantity: number;
}

const initialProducts: Product[] = [
	{ id: 1, name: 'Laptop Dell XPS 13', price: 25000000, quantity: 10 },
	{ id: 2, name: 'iPhone 15 Pro Max', price: 30000000, quantity: 15 },
	{ id: 3, name: 'Samsung Galaxy S24', price: 22000000, quantity: 20 },
	{ id: 4, name: 'iPad Air M2', price: 18000000, quantity: 12 },
	{ id: 5, name: 'MacBook Air M3', price: 28000000, quantity: 8 },
];

const ProductManagement: React.FC = () => {
	const [products, setProducts] = useState<Product[]>(initialProducts);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [searchText, setSearchText] = useState('');
	const [form] = Form.useForm();

	const filteredProducts = useMemo(() => {
		if (!searchText) return products;
		return products.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()));
	}, [products, searchText]);

	const handleAddProduct = (values: Omit<Product, 'id'>) => {
		const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
		const newProduct: Product = {
			id: newId,
			...values,
		};
		setProducts([...products, newProduct]);
		message.success('Thêm sản phẩm thành công!');
		setIsModalVisible(false);
		form.resetFields();
	};

	const handleDeleteProduct = (id: number) => {
		setProducts(products.filter((item) => item.id !== id));
		message.success('Xóa sản phẩm thành công!');
	};

	const columns: ColumnsType<Product> = [
		{
			title: 'STT',
			dataIndex: 'index',
			key: 'index',
			width: 80,
			align: 'center',
			render: (_text, _record, index) => index + 1,
		},
		{
			title: 'Tên sản phẩm',
			dataIndex: 'name',
			key: 'name',
			sorter: (a, b) => a.name.localeCompare(b.name),
		},
		{
			title: 'Giá (VNĐ)',
			dataIndex: 'price',
			key: 'price',
			align: 'right',
			sorter: (a, b) => a.price - b.price,
			render: (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price),
		},
		{
			title: 'Số lượng',
			dataIndex: 'quantity',
			key: 'quantity',
			align: 'center',
			sorter: (a, b) => a.quantity - b.quantity,
		},
		{
			title: 'Hành động',
			key: 'action',
			align: 'center',
			width: 120,
			render: (_text, record) => (
				<Popconfirm
					title='Bạn có chắc chắn muốn xóa sản phẩm này?'
					onConfirm={() => handleDeleteProduct(record.id)}
					okText='Có'
					cancelText='Không'
				>
					<Button type='primary' danger icon={<DeleteOutlined />} size='small'>
						Xóa
					</Button>
				</Popconfirm>
			),
		},
	];

	return (
		<div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
			<Card bordered={false} style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
				<Row justify='space-between' align='middle' style={{ marginBottom: 24 }}>
					<Col>
						<Title level={3} style={{ margin: 0 }}>
							Quản lý Sản phẩm
						</Title>
					</Col>
					<Col>
						<Space>
							<Input
								placeholder='Tìm kiếm theo tên...'
								prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
								onChange={(e) => setSearchText(e.target.value)}
								style={{ width: 250 }}
								allowClear
							/>
							<Button type='primary' icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
								Thêm mới
							</Button>
						</Space>
					</Col>
				</Row>

				<Table dataSource={filteredProducts} columns={columns} rowKey='id' pagination={{ pageSize: 5 }} bordered />

				<Modal
					title='Thêm sản phẩm mới'
					visible={isModalVisible}
					onCancel={() => setIsModalVisible(false)}
					footer={null}
					destroyOnClose
				>
					<Form form={form} layout='vertical' onFinish={handleAddProduct} initialValues={{ quantity: 1 }}>
						<Form.Item
							name='name'
							label='Tên sản phẩm'
							rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
						>
							<Input placeholder='Nhập tên sản phẩm' />
						</Form.Item>

						<Form.Item
							name='price'
							label='Giá sản phẩm'
							rules={[
								{ required: true, message: 'Vui lòng nhập giá!' },
								{ type: 'number', min: 0, message: 'Giá phải là số dương!' },
							]}
						>
							<InputNumber
								style={{ width: '100%' }}
								formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
								addonAfter='VNĐ'
								placeholder='Nhập giá'
							/>
						</Form.Item>

						<Form.Item
							name='quantity'
							label='Số lượng'
							rules={[
								{ required: true, message: 'Vui lòng nhập số lượng!' },
								{ type: 'integer', min: 0, message: 'Số lượng phải là số nguyên dương!' },
							]}
						>
							<InputNumber style={{ width: '100%' }} placeholder='Nhập số lượng' />
						</Form.Item>

						<Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
							<Space>
								<Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
								<Button type='primary' htmlType='submit'>
									Lưu sản phẩm
								</Button>
							</Space>
						</Form.Item>
					</Form>
				</Modal>
			</Card>
		</div>
	);
};

export default ProductManagement;
