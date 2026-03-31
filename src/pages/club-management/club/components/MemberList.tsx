import { Modal, Table, Tag } from 'antd';
import { useState, useEffect } from 'react';

const MemberList = ({ visible, onCancel, clubName }: any) => {
	const [data, setData] = useState<any[]>([]);

	useEffect(() => {
		if (visible) {
			const saved = localStorage.getItem('memberApplications');
			const apps = saved ? JSON.parse(saved) : [];
			const filtered = apps.filter((app: any) => app.status === 'Approved' && app.clubName === clubName);
			setData(filtered);
		}
	}, [visible, clubName]);

	const columns = [
		{
			title: 'Họ tên',
			dataIndex: 'fullName',
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
			title: 'Trạng thái',
			dataIndex: 'status',
			render: (status: string) => <Tag color='green'>{status}</Tag>,
		},
	];

	return (
		<Modal
			title={`Thành viên đang sinh hoạt: ${clubName}`}
			visible={visible}
			onCancel={onCancel}
			footer={null}
			width={700}
		>
			<Table
				columns={columns}
				dataSource={data}
				rowKey='id'
				pagination={{ pageSize: 5 }}
				locale={{ emptyText: 'Chưa có thành viên nào tham gia câu lạc bộ này.' }}
			/>
		</Modal>
	);
};

export default MemberList;
