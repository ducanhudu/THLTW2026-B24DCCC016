import { ProTable, PageContainer } from '@ant-design/pro-components';
import { Button, Space, Popconfirm, Tag, message } from 'antd';
import { useState, useEffect } from 'react';
import ApplicationForm from './components/ApplicationForm';
import ApplicationDetail from './components/ApplicationDetail';
import RejectModal from './components/RejectModal';

const ApplicationList = () => {
	const [data, setData] = useState<any[]>(() => {
		const saved = localStorage.getItem('memberApplications');
		return saved ? JSON.parse(saved) : [];
	});

	const [clubs] = useState(() => {
		const saved = localStorage.getItem('clubData');
		return saved ? JSON.parse(saved) : [];
	});

	const [formVisible, setFormVisible] = useState(false);
	const [detailVisible, setDetailVisible] = useState(false);
	const [rejectVisible, setRejectVisible] = useState(false);
	const [currentApp, setCurrentApp] = useState<any>(null);
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const [isBulkReject, setIsBulkReject] = useState(false);

	useEffect(() => {
		localStorage.setItem('memberApplications', JSON.stringify(data));
	}, [data]);

	const addHistory = (app: any, action: string, reason?: string) => {
		const historyItem = {
			action,
			time: new Date().toLocaleString(),
			operator: 'Admin',
			reason: reason || '-',
		};
		return {
			...app,
			history: [historyItem, ...(app.history || [])],
		};
	};

	const handleSave = (values: any) => {
		if (currentApp) {
			setData(
				data.map((item) =>
					item.id === currentApp.id ? addHistory({ ...item, ...values }, 'Cập nhật thông tin') : item,
				),
			);
		} else {
			const newApp = {
				id: Date.now(),
				...values,
				status: 'Pending',
				notes: '-',
				history: [
					{
						action: 'Tạo mới đơn đăng ký',
						time: new Date().toLocaleString(),
						operator: 'Hệ thống',
						reason: '-',
					},
				],
			};
			setData([newApp, ...data]);
		}
		setFormVisible(false);
		setCurrentApp(null);
	};

	const handleDelete = (id: number) => {
		setData(data.filter((item) => item.id !== id));
	};

	const updateStatus = (id: number, status: string, reason?: string) => {
		setData(
			data.map((item) =>
				item.id === id
					? addHistory(
							{ ...item, status, notes: reason || '-' },
							`${status === 'Approved' ? 'Duyệt' : 'Từ chối'} đơn`,
							reason,
					  )
					: item,
			),
		);
	};

	const handleBulkApprove = () => {
		setData(
			data.map((item) =>
				selectedRowKeys.includes(item.id) && item.status === 'Pending'
					? addHistory({ ...item, status: 'Approved', notes: '-' }, 'Duyệt đơn (Bulk)')
					: item,
			),
		);
		setSelectedRowKeys([]);
		message.success(`Đã duyệt ${selectedRowKeys.length} đơn`);
	};

	const handleConfirmReject = (reason: string) => {
		if (isBulkReject) {
			setData(
				data.map((item) =>
					selectedRowKeys.includes(item.id) && item.status === 'Pending'
						? addHistory({ ...item, status: 'Rejected', notes: reason }, 'Từ chối đơn (Bulk)', reason)
						: item,
				),
			);
			setSelectedRowKeys([]);
			message.success(`Đã từ chối ${selectedRowKeys.length} đơn`);
		} else if (currentApp) {
			updateStatus(currentApp.id, 'Rejected', reason);
			message.success('Đã từ chối đơn');
		}
		setRejectVisible(false);
		setIsBulkReject(false);
	};

	const columns: any = [
		{
			title: 'Họ tên',
			dataIndex: 'fullName',
			sorter: (a: any, b: any) => a.fullName.localeCompare(b.fullName),
		},
		{
			title: 'Email',
			dataIndex: 'email',
		},
		{
			title: 'Số điện thoại',
			dataIndex: 'phone',
		},
		{
			title: 'Giới tính',
			dataIndex: 'gender',
			search: false,
		},
		{
			title: 'Câu lạc bộ',
			dataIndex: 'clubName',
			filters: clubs.map((c: any) => ({ text: c.name, value: c.name })),
			onFilter: (value: any, record: any) => record.clubName === value,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			render: (status: string) => (
				<Tag color={status === 'Approved' ? 'green' : status === 'Rejected' ? 'red' : 'gold'}>{status}</Tag>
			),
			filters: [
				{ text: 'Pending', value: 'Pending' },
				{ text: 'Approved', value: 'Approved' },
				{ text: 'Rejected', value: 'Rejected' },
			],
			onFilter: (value: any, record: any) => record.status === value,
		},
		{
			title: 'Thao tác',
			valueType: 'option',
			width: 250,
			render: (_: any, record: any) => [
				<Space key='actions'>
					<Button
						type='link'
						onClick={() => {
							setCurrentApp(record);
							setDetailVisible(true);
						}}
					>
						Chi tiết
					</Button>
					<Button
						type='link'
						onClick={() => {
							setCurrentApp(record);
							setFormVisible(true);
						}}
					>
						Sửa
					</Button>
					{record.status === 'Pending' && (
						<>
							<Popconfirm title='Xác nhận duyệt đơn?' onConfirm={() => updateStatus(record.id, 'Approved')}>
								<Button type='link' style={{ color: '#52c41a' }}>
									Duyệt
								</Button>
							</Popconfirm>
							<Button
								type='link'
								danger
								onClick={() => {
									setCurrentApp(record);
									setIsBulkReject(false);
									setRejectVisible(true);
								}}
							>
								Từ chối
							</Button>
						</>
					)}
					<Popconfirm title='Xóa đơn này?' onConfirm={() => handleDelete(record.id)}>
						<Button type='link' danger>
							Xóa
						</Button>
					</Popconfirm>
				</Space>,
			],
		},
	];

	return (
		<PageContainer title='Quản lý đơn đăng ký'>
			<div style={{ marginBottom: 16 }}>
				{selectedRowKeys.length > 0 && (
					<Space>
						<Button type='primary' onClick={handleBulkApprove}>
							Duyệt {selectedRowKeys.length} đơn đã chọn
						</Button>
						<Button
							danger
							onClick={() => {
								setIsBulkReject(true);
								setRejectVisible(true);
							}}
						>
							Từ chối {selectedRowKeys.length} đơn đã chọn
						</Button>
					</Space>
				)}
			</div>

			<ProTable
				columns={columns}
				dataSource={data}
				rowKey='id'
				search={{ labelWidth: 'auto' }}
				options={false}
				pagination={{
					pageSize: 10,
					showTotal: () => null,
				}}
				rowSelection={{
					selectedRowKeys,
					onChange: (keys) => setSelectedRowKeys(keys),
				}}
				toolBarRender={() => [
					<Button
						key='add'
						type='primary'
						onClick={() => {
							setCurrentApp(null);
							setFormVisible(true);
						}}
					>
						Thêm mới đơn
					</Button>,
				]}
			/>

			<ApplicationForm
				visible={formVisible}
				onCancel={() => setFormVisible(false)}
				onSave={handleSave}
				initialValues={currentApp}
				clubs={clubs}
			/>

			<ApplicationDetail visible={detailVisible} onCancel={() => setDetailVisible(false)} data={currentApp} />

			<RejectModal visible={rejectVisible} onCancel={() => setRejectVisible(false)} onConfirm={handleConfirmReject} />
		</PageContainer>
	);
};

export default ApplicationList;
