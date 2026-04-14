import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Input, Select, Space, Popconfirm, message, Typography, Tag, Row, Col } from 'antd';
import CourseForm from './components/CourseForm';
import type { Course } from './types';
import { CourseStatus } from './types';

const { Title } = Typography;

const LOCAL_STORAGE_KEY = 'course_data_storage';

const CourseAdmin: React.FC = () => {
	const [courses, setCourses] = useState<Course[]>([]);
	const [searchText, setSearchText] = useState('');
	const [filterLecturer, setFilterLecturer] = useState<string | undefined>(undefined);
	const [filterStatus, setFilterStatus] = useState<CourseStatus | undefined>(undefined);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingCourse, setEditingCourse] = useState<Course | null>(null);

	useEffect(() => {
		const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
		if (savedData) {
			setCourses(JSON.parse(savedData));
		}
	}, []);

	useEffect(() => {
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(courses));
	}, [courses]);

	const removeVietnameseTones = (str: string) => {
		return str
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/đ/g, 'd')
			.replace(/Đ/g, 'D');
	};

	const generateCourseId = (name: string, allCourses: Course[]) => {
		const normalized = removeVietnameseTones(name.trim());

		const prefix =
			normalized
				.replace(/[^a-zA-Z]/g, '')
				.slice(0, 2)
				.toUpperCase() || 'CO';

		let id = '';
		let isDuplicate = true;

		while (isDuplicate) {
			const randomNum = Math.floor(1000 + Math.random() * 9000);
			const tempId = `${prefix}${randomNum}`;
			isDuplicate = allCourses.some((c) => c.id === tempId);
			id = tempId;
		}

		return id;
	};

	const handleOpenModal = (course?: Course) => {
		setEditingCourse(course || null);
		setIsModalOpen(true);
	};

	const handleDelete = (id: string) => {
		const target = courses.find((c) => c.id === id);
		if (target && target.studentCount > 0) {
			message.error('Không thể xóa khóa học đang có học viên');
			return;
		}
		setCourses(courses.filter((c) => c.id !== id));
		message.success('Đã xóa khóa học thành công');
	};

	const handleSave = (values: any) => {
		if (editingCourse) {
			setCourses(courses.map((c) => (c.id === editingCourse.id ? { ...c, ...values } : c)));
			message.success('Đã cập nhật khóa học');
		} else {
			const newCourse: Course = {
				...values,
				id: generateCourseId(values.name, courses),
			};
			setCourses([...courses, newCourse]);
			message.success('Đã thêm khóa học mới');
		}
		setIsModalOpen(false);
	};

	const filteredData = courses.filter((c) => {
		const matchesSearch = c.name.toLowerCase().includes(searchText.toLowerCase());
		const matchesLecturer = filterLecturer ? c.lecturer === filterLecturer : true;
		const matchesStatus = filterStatus ? c.status === filterStatus : true;
		return matchesSearch && matchesLecturer && matchesStatus;
	});

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			width: 120,
		},
		{
			title: 'Tên khóa học',
			dataIndex: 'name',
			key: 'name',
			render: (text: string) => <Typography.Text strong>{text}</Typography.Text>,
		},
		{
			title: 'Giảng viên',
			dataIndex: 'lecturer',
			key: 'lecturer',
		},
		{
			title: 'Số lượng học viên',
			dataIndex: 'studentCount',
			key: 'studentCount',
			sorter: (a: Course, b: Course) => a.studentCount - b.studentCount,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			render: (status: CourseStatus) => {
				let color = 'blue';
				let label = 'Đang mở';
				if (status === CourseStatus.CLOSED) {
					color = 'red';
					label = 'Đã kết thúc';
				} else if (status === CourseStatus.PAUSED) {
					color = 'orange';
					label = 'Tạm dừng';
				}
				return <Tag color={color}>{label}</Tag>;
			},
		},
		{
			title: 'Thao tác',
			key: 'actions',
			width: 180,
			render: (_: any, record: Course) => (
				<Space>
					<Button type='link' onClick={() => handleOpenModal(record)}>
						Sửa
					</Button>
					<Popconfirm
						title='Bạn có chắc chắn muốn xóa khóa học này?'
						onConfirm={() => handleDelete(record.id)}
						okText='Xóa'
						cancelText='Hủy'
						okButtonProps={{ danger: true }}
					>
						<Button type='link' danger>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div style={{ padding: '24px' }}>
			<Card
				title={<Title level={3}>Quản lý khóa học Online</Title>}
				extra={
					<Button type='primary' onClick={() => handleOpenModal()}>
						Thêm khóa học
					</Button>
				}
			>
				<div style={{ marginBottom: 24 }}>
					<Row gutter={16}>
						<Col span={8}>
							<Input
								placeholder='Tìm kiếm theo tên khóa học'
								value={searchText}
								onChange={(e) => setSearchText(e.target.value)}
							/>
						</Col>
						<Col span={6}>
							<Select
								placeholder='Lọc theo giảng viên'
								style={{ width: '100%' }}
								allowClear
								onChange={(value) => setFilterLecturer(value)}
							>
								<Select.Option value='Nguyễn Văn A'>Nguyễn Văn A</Select.Option>
								<Select.Option value='Trần Thị B'>Trần Thị B</Select.Option>
								<Select.Option value='Lê Văn C'>Lê Văn C</Select.Option>
								<Select.Option value='Phạm Minh D'>Phạm Minh D</Select.Option>
							</Select>
						</Col>
						<Col span={6}>
							<Select
								placeholder='Lọc theo trạng thái'
								style={{ width: '100%' }}
								allowClear
								onChange={(value) => setFilterStatus(value)}
							>
								<Select.Option value={CourseStatus.OPEN}>Đang mở</Select.Option>
								<Select.Option value={CourseStatus.CLOSED}>Đã kết thúc</Select.Option>
								<Select.Option value={CourseStatus.PAUSED}>Tạm dừng</Select.Option>
							</Select>
						</Col>
					</Row>
				</div>

				<Table dataSource={filteredData} columns={columns} rowKey='id' pagination={{ pageSize: 10 }} />
			</Card>

			<CourseForm
				visible={isModalOpen}
				onCancel={() => setIsModalOpen(false)}
				onSave={handleSave}
				initialValues={editingCourse}
				existingCourses={courses}
			/>
		</div>
	);
};

export default CourseAdmin;
