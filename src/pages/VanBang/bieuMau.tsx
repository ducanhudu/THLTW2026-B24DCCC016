import { Card, Button, Table, Modal, Form, Input, Select, message, Popconfirm } from 'antd';
import { useState } from 'react';

const MauBieu = ({ list = [], setList }: any) => {
	const [open, setOpen] = useState(false);
	const [editing, setEditing] = useState<any>(null);
	const [form] = Form.useForm();

	const handleSubmit = (values: any) => {
		const { name } = values;

		const isDuplicate = list.find((i: any) => i.name.trim().toLowerCase() === name.trim().toLowerCase());

		if (isDuplicate && !editing) {
			message.error('Tên field đã tồn tại');
			return;
		}

		if (editing) {
			const newList = list.map((item: any) => (item.name === editing.name ? values : item));
			setList(newList);
			message.success('Cập nhật thành công');
		} else {
			setList([...list, values]);
			message.success('Thêm thành công');
		}

		setOpen(false);
		setEditing(null);
		form.resetFields();
	};

	const handleEdit = (record: any) => {
		setEditing(record);
		form.setFieldsValue(record);
		setOpen(true);
	};

	const handleDelete = (name: string) => {
		setList(list.filter((item: any) => item.name !== name));
		message.success('Đã xóa');
	};

	const columns = [
		{ title: 'Tên hiển thị', dataIndex: 'label' },
		{ title: 'Key', dataIndex: 'name' },
		{ title: 'Kiểu dữ liệu', dataIndex: 'type' },
		{
			title: 'Hành động',
			render: (_: any, record: any) => (
				<>
					<Button onClick={() => handleEdit(record)}>Sửa</Button>
					<Popconfirm title='Xóa field?' onConfirm={() => handleDelete(record.name)}>
						<Button danger style={{ marginLeft: 8 }}>
							Xóa
						</Button>
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<Card
			title='Cấu hình biểu mẫu'
			extra={
				<Button
					type='primary'
					onClick={() => {
						setOpen(true);
						setEditing(null);
						form.resetFields();
					}}
				>
					Thêm field
				</Button>
			}
		>
			<Table dataSource={list} columns={columns} rowKey='name' bordered />

			<Modal
				title={editing ? 'Sửa field' : 'Thêm field'}
				visible={open}
				forceRender
				onCancel={() => {
					setOpen(false);
					setEditing(null);
					form.resetFields();
				}}
				onOk={() => form.submit()}
			>
				<Form form={form} layout='vertical' onFinish={handleSubmit}>
					<Form.Item label='Tên hiển thị' name='label' rules={[{ required: true, message: 'Nhập label' }]}>
						<Input />
					</Form.Item>

					<Form.Item label='Key' name='name' rules={[{ required: true, message: 'Nhập key' }]}>
						<Input disabled={!!editing} />
					</Form.Item>

					<Form.Item label='Kiểu dữ liệu' name='type' rules={[{ required: true }]}>
						<Select
							options={[
								{ label: 'String', value: 'string' },
								{ label: 'Number', value: 'number' },
								{ label: 'Date', value: 'date' },
							]}
						/>
					</Form.Item>
				</Form>
			</Modal>
		</Card>
	);
};

export default MauBieu;
