import { ProTable, PageContainer, ActionType } from '@ant-design/pro-components';
import { Button, Space, Popconfirm, Image } from 'antd';
import { useState, useRef, useEffect } from 'react';
import ClubForm from './components/ClubForm';
import MemberList from './components/MemberList';

const ClubList = () => {
	const actionRef = useRef<ActionType>();
	const [data, setData] = useState<any[]>(() => {
		const savedData = localStorage.getItem('clubData');
		return savedData ? JSON.parse(savedData) : [];
	});

	useEffect(() => {
		localStorage.setItem('clubData', JSON.stringify(data));
	}, [data]);

	const [formVisible, setFormVisible] = useState(false);
	const [memberVisible, setMemberVisible] = useState(false);
	const [currentClub, setCurrentClub] = useState<any>(null);

	const handleDelete = (id: number) => {
		setData(data.filter((item) => item.id !== id));
		actionRef.current?.reload();
	};

	const handleSave = (values: any) => {
		if (currentClub) {
			setData(data.map((item) => (item.id === currentClub.id ? { ...item, ...values } : item)));
		} else {
			setData([...data, { id: Date.now(), ...values }]);
		}
		setFormVisible(false);
		setCurrentClub(null);
		actionRef.current?.reload();
	};

	const columns: any = [
		{
			title: 'Ảnh đại diện',
			dataIndex: 'avatar',
			render: (text: string) => <Image src={text} width={50} height={50} />,
			search: false,
		},
		{
			title: 'Tên câu lạc bộ',
			dataIndex: 'name',
			sorter: (a: any, b: any) => a.name.localeCompare(b.name),
		},
		{
			title: 'Ngày thành lập',
			dataIndex: 'foundedDate',
			sorter: (a: any, b: any) => a.foundedDate.localeCompare(b.foundedDate),
			search: false,
		},
		{
			title: 'Mô tả',
			dataIndex: 'description',
			render: (text: string) => <div dangerouslySetInnerHTML={{ __html: text }} />,
			search: false,
		},
		{
			title: 'Chủ nhiệm CLB',
			dataIndex: 'leader',
			search: false,
		},
		{
			title: 'Hoạt động',
			dataIndex: 'status',
			search: false,
			filters: [
				{ text: 'Có', value: 'Có' },
				{ text: 'Không', value: 'Không' },
			],
			onFilter: (value: any, record: any) => record.status === value,
		},
		{
			title: 'Thao tác',
			valueType: 'option',
			render: (_: any, record: any) => [
				<Space key='actions'>
					<Button
						type='link'
						onClick={() => {
							setCurrentClub(record);
							setFormVisible(true);
						}}
					>
						Chỉnh sửa
					</Button>
					<Popconfirm title='Xác nhận xóa CLB này?' onConfirm={() => handleDelete(record.id)}>
						<Button type='link' danger>
							Xóa
						</Button>
					</Popconfirm>
					<Button
						type='link'
						onClick={() => {
							setCurrentClub(record);
							setMemberVisible(true);
						}}
					>
						Thành viên
					</Button>
				</Space>,
			],
		},
	];

	const handleRequest = async (params: any) => {
		let filteredData = [...data];
		if (params.name) {
			filteredData = filteredData.filter((item) => item.name.toLowerCase().includes(params.name.toLowerCase()));
		}
		return {
			data: filteredData,
			success: true,
			total: filteredData.length,
		};
	};

	return (
		<PageContainer title='Danh sách câu lạc bộ'>
			<ProTable
				actionRef={actionRef}
				columns={columns}
				request={handleRequest}
				params={{ data }}
				rowKey='id'
				options={false}
				pagination={{
					pageSize: 10,
					showTotal: () => null,
				}}
				search={{
					labelWidth: 'auto',
				}}
				toolBarRender={() => [
					<Button
						key='button'
						type='primary'
						onClick={() => {
							setCurrentClub(null);
							setFormVisible(true);
						}}
					>
						Thêm mới
					</Button>,
				]}
			/>

			<ClubForm
				visible={formVisible}
				onCancel={() => setFormVisible(false)}
				onSave={handleSave}
				initialValues={currentClub}
			/>

			<MemberList visible={memberVisible} onCancel={() => setMemberVisible(false)} clubName={currentClub?.name} />
		</PageContainer>
	);
};

export default ClubList;
