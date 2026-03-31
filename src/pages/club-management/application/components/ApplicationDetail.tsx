import { Modal, Descriptions, Table, Tag } from 'antd';

const ApplicationDetail = ({ visible, onCancel, data }: any) => {
	if (!data) return null;

	const historyColumns = [
		{
			title: 'Thời gian',
			dataIndex: 'time',
		},
		{
			title: 'Hành động',
			dataIndex: 'action',
		},
		{
			title: 'Người thực hiện',
			dataIndex: 'operator',
		},
		{
			title: 'Lý do/Ghi chú',
			dataIndex: 'reason',
		},
	];

	return (
		<Modal title='Chi tiết đơn đăng ký' visible={visible} onCancel={onCancel} width={800} footer={null}>
			<Descriptions bordered column={2} size='small'>
				<Descriptions.Item label='Họ tên'>{data.fullName}</Descriptions.Item>
				<Descriptions.Item label='Giới tính'>{data.gender}</Descriptions.Item>
				<Descriptions.Item label='Email'>{data.email}</Descriptions.Item>
				<Descriptions.Item label='Số điện thoại'>{data.phone}</Descriptions.Item>
				<Descriptions.Item label='Địa chỉ' span={2}>
					{data.address}
				</Descriptions.Item>
				<Descriptions.Item label='Sở trường'>{data.specialty}</Descriptions.Item>
				<Descriptions.Item label='Câu lạc bộ'>{data.clubName}</Descriptions.Item>
				<Descriptions.Item label='Trạng thái'>
					<Tag color={data.status === 'Approved' ? 'green' : data.status === 'Rejected' ? 'red' : 'gold'}>
						{data.status}
					</Tag>
				</Descriptions.Item>
				<Descriptions.Item label='Ghi chú'>{data.notes || '-'}</Descriptions.Item>
				<Descriptions.Item label='Lý do đăng ký' span={2}>
					{data.reason}
				</Descriptions.Item>
			</Descriptions>

			<h3 style={{ marginTop: '24px' }}>Lịch sử thao tác</h3>
			<Table
				dataSource={data.history || []}
				columns={historyColumns}
				pagination={false}
				size='small'
				rowKey={(record, index) => index.toString()}
			/>
		</Modal>
	);
};

export default ApplicationDetail;
