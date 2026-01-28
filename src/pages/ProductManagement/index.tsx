import React, { useState, useMemo } from 'react';
import {
	Table,
	Button,
	Modal,
	Form,
	Input,
	InputNumber,
	Select,
	Popconfirm,
	Tag,
	Space,
	Card,
	Slider,
	Row,
	Col,
	message,
	Typography,
} from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { Product } from '@/models/products';

const { Option } = Select;
const { Title } = Typography;

const ProductManagement = () => {
	const { products, addProduct, updateProduct, deleteProduct } = useModel('products');
	const [form] = Form.useForm();

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingId, setEditingId] = useState<number | null>(null);

	const [searchText, setSearchText] = useState('');
	const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000]);
	const [statusFilter, setStatusFilter] = useState<string | null>(null);

	const categories = useMemo(() => {
		return Array.from(new Set(products.map((p) => p.category)));
	}, [products]);

	const filteredProducts = useMemo(() => {
		return products.filter((product) => {
			if (searchText && !product.name.toLowerCase().includes(searchText.toLowerCase())) return false;
			if (categoryFilter && product.category !== categoryFilter) return false;
			if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
			let status = 'Còn hàng';
			if (product.quantity === 0) status = 'Hết hàng';
			else if (product.quantity <= 10) status = 'Sắp hết';

			if (statusFilter && status !== statusFilter) return false;

			return true;
		});
	}, [products, searchText, categoryFilter, priceRange, statusFilter]);

	const handleAddEdit = (values: any) => {
		if (editingId) {
			updateProduct(editingId, values);
			message.success('Cập nhật sản phẩm thành công!');
		} else {
			addProduct(values);
			message.success('Thêm sản phẩm thành công!');
		}
		setIsModalVisible(false);
		form.resetFields();
		setEditingId(null);
	};

	const openEditModal = (record: Product) => {
		setEditingId(record.id);
		form.setFieldsValue(record);
		setIsModalVisible(true);
	};

	const handleDelete = (id: number) => {
		deleteProduct(id);
		message.success('Xóa sản phẩm thành công!');
	};

	const columns = [
		{
			title: 'STT',
			dataIndex: 'index',
			key: 'index',
			width: 60,
			render: (_: any, __: any, index: number) => index + 1,
		},
		{
			title: 'Tên sản phẩm',
			dataIndex: 'name',
			key: 'name',
			sorter: (a: Product, b: Product) => a.name.localeCompare(b.name),
			filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
				<div style={{ padding: 8 }}>
					<Input
						placeholder='Tìm tên'
						value={selectedKeys[0]}
						onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
						onPressEnter={() => {
							confirm();
							setSearchText(selectedKeys[0]);
						}}
						style={{ marginBottom: 8, display: 'block' }}
					/>
					<Space>
						<Button
							type='primary'
							onClick={() => {
								confirm();
								setSearchText(selectedKeys[0]);
							}}
							icon={<SearchOutlined />}
							size='small'
							style={{ width: 90 }}
						>
							Search
						</Button>
						<Button
							onClick={() => {
								clearFilters();
								setSearchText('');
							}}
							size='small'
							style={{ width: 90 }}
						>
							Reset
						</Button>
					</Space>
				</div>
			),
			filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
		},
		{
			title: 'Danh mục',
			dataIndex: 'category',
			key: 'category',
			filters: categories.map((c) => ({ text: c, value: c })),
			onFilter: (value: any, record: Product) => record.category === value,
		},
		{
			title: 'Giá (VNĐ)',
			dataIndex: 'price',
			key: 'price',
			sorter: (a: Product, b: Product) => a.price - b.price,
			render: (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val),
		},
		{
			title: 'Số lượng',
			dataIndex: 'quantity',
			key: 'quantity',
			sorter: (a: Product, b: Product) => a.quantity - b.quantity,
		},
		{
			title: 'Trạng thái',
			key: 'status',
			render: (_: any, record: Product) => {
				let color = 'green';
				let text = 'Còn hàng';
				if (record.quantity === 0) {
					color = 'red';
					text = 'Hết hàng';
				} else if (record.quantity <= 10) {
					color = 'orange';
					text = 'Sắp hết';
				}
				return <Tag color={color}>{text}</Tag>;
			},
		},
		{
			title: 'Thao tác',
			key: 'action',
			render: (_: any, record: Product) => (
				<Space size='middle'>
					<Button icon={<EditOutlined />} onClick={() => openEditModal(record)}>
						Sửa
					</Button>
					<Popconfirm
						title='Bạn có chắc chắn muốn xóa?'
						onConfirm={() => handleDelete(record.id)}
						okText='Có'
						cancelText='Không'
					>
						<Button danger icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div style={{ padding: 24 }}>
			<Card>
				<Row justify='space-between' align='middle' style={{ marginBottom: 16 }}>
					<Col>
						<Title level={3}>Quản lý Sản phẩm</Title>
					</Col>
					<Col>
						<Button
							type='primary'
							icon={<PlusOutlined />}
							onClick={() => {
								setEditingId(null);
								form.resetFields();
								setIsModalVisible(true);
							}}
						>
							Thêm mới
						</Button>
					</Col>
				</Row>

				<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
					<Col span={6}>
						<Input.Search
							placeholder='Tìm theo tên...'
							onSearch={(val) => setSearchText(val)}
							onChange={(e) => setSearchText(e.target.value)}
							allowClear
						/>
					</Col>
					<Col span={4}>
						<Select
							style={{ width: '100%' }}
							placeholder='Lọc Danh mục'
							allowClear
							onChange={(val) => setCategoryFilter(val)}
						>
							{categories.map((c) => (
								<Option key={c} value={c}>
									{c}
								</Option>
							))}
						</Select>
					</Col>
					<Col span={4}>
						<Select
							style={{ width: '100%' }}
							placeholder='Lọc Trạng thái'
							allowClear
							onChange={(val) => setStatusFilter(val)}
						>
							<Option value='Còn hàng'>Còn hàng</Option>
							<Option value='Sắp hết'>Sắp hết</Option>
							<Option value='Hết hàng'>Hết hàng</Option>
						</Select>
					</Col>
					<Col span={6}>
						<span style={{ marginRight: 8 }}>Giá:</span>
						<Slider
							range
							min={0}
							max={50000000}
							step={100000}
							defaultValue={[0, 50000000]}
							onChange={(val) => setPriceRange(val)}
							tooltipVisible
						/>
					</Col>
				</Row>

				<Table columns={columns} dataSource={filteredProducts} rowKey='id' pagination={{ pageSize: 5 }} />
			</Card>

			<Modal
				title={editingId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
				destroyOnClose
			>
				<Form form={form} layout='vertical' onFinish={handleAddEdit} initialValues={{ quantity: 0, price: 0 }}>
					<Form.Item name='name' label='Tên sản phẩm' rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
						<Input />
					</Form.Item>
					<Form.Item
						name='category'
						label='Danh mục'
						rules={[{ required: true, message: 'Vui lòng chọn hoặc nhập danh mục!' }]}
					>
						<Select mode='tags' placeholder='Chọn hoặc nhập danh mục mới' style={{ width: '100%' }}>
							{categories.map((c) => (
								<Option key={c} value={c}>
									{c}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item
						name='price'
						label='Giá'
						rules={[{ required: true }, { type: 'number', min: 0, message: 'Phải là số dương!' }]}
					>
						<InputNumber
							style={{ width: '100%' }}
							formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							parser={(val) => val!.replace(/\$\s?|(,*)/g, '')}
						/>
					</Form.Item>
					<Form.Item
						name='quantity'
						label='Số lượng'
						rules={[{ required: true }, { type: 'integer', min: 0, message: 'Phải là số nguyên không âm!' }]}
					>
						<InputNumber style={{ width: '100%' }} />
					</Form.Item>
					<Row justify='end'>
						<Space>
							<Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
							<Button type='primary' htmlType='submit'>
								Lưu
							</Button>
						</Space>
					</Row>
				</Form>
			</Modal>
		</div>
	);
};

export default ProductManagement;
