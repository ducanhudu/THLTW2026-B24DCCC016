import { ProTable, PageContainer } from '@ant-design/pro-components';
import { Button, message, Tag } from 'antd';
import { useState, useEffect } from 'react';
import ChangeClubModal from './components/ChangeClubModal';

const MemberList = () => {
	const [data, setData] = useState<any[]>(() => {
		const saved = localStorage.getItem('memberApplications');
		const apps = saved ? JSON.parse(saved) : [];
		return apps.filter((app: any) => app.status === 'Approved');
	});

	const [clubs] = useState(() => {
		const saved = localStorage.getItem('clubData');
		return saved ? JSON.parse(saved) : [];
	});

	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const [modalVisible, setModalVisible] = useState(false);

	useEffect(() => {
		const saved = localStorage.getItem('memberApplications');
		let apps = saved ? JSON.parse(saved) : [];

		apps = apps.map((app: any) => {
			const updatedMember = data.find((m) => m.id === app.id);
			return updatedMember ? { ...app, ...updatedMember } : app;
		});

		localStorage.setItem('memberApplications', JSON.stringify(apps));
	}, [data]);

	const handleChangeClub = (newClubName: string) => {
		const newData = data.map((member) => {
			if (selectedRowKeys.includes(member.id)) {
				const historyItem = {
					action: `Chuyển sang Câu lạc bộ: ${newClubName}`,
					time: new Date().toLocaleString(),
					operator: 'Admin',
					reason: `Chuyển từ ${member.clubName}`,
				};
				return {
					...member,
					clubName: newClubName,
					history: [historyItem, ...(member.history || [])],
				};
			}
			return member;
		});

		setData(newData);
		setModalVisible(false);
		setSelectedRowKeys([]);
		message.success(`Đã chuyển ${selectedRowKeys.length} thành viên sang ${newClubName}`);
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
			title: 'Câu lạc bộ',
			dataIndex: 'clubName',
			filters: clubs.map((c: any) => ({ text: c.name, value: c.name })),
			onFilter: (value: any, record: any) => record.clubName === value,
			render: (text: string) => <Tag color='blue'>{text}</Tag>,
		},
	];

	return (
		<PageContainer title='Danh sách thành viên'>
			<div style={{ marginBottom: 16 }}>
				{selectedRowKeys.length > 0 && (
					<Button type='primary' onClick={() => setModalVisible(true)}>
						Đổi câu lạc bộ ({selectedRowKeys.length} đã chọn)
					</Button>
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
			/>

			<ChangeClubModal
				visible={modalVisible}
				onCancel={() => setModalVisible(false)}
				onConfirm={handleChangeClub}
				selectedCount={selectedRowKeys.length}
				clubs={clubs}
			/>
		</PageContainer>
	);
};

export default MemberList;
