export default [
	{
		path: '/club-management',
		name: 'Quản lý Câu lạc bộ',
		component: './club-management',
		routes: [
			{
				path: '/club-management/club',
				name: 'Câu lạc bộ',
				component: './club-management/club',
				hideInMenu: true,
			},
			{
				path: '/club-management/application',
				name: 'Đơn đăng ký',
				component: './club-management/application',
				hideInMenu: true,
			},
			{
				path: '/club-management/member',
				name: 'Thành viên',
				component: './club-management/member',
				hideInMenu: true,
			},
			{
				path: '/club-management/report',
				name: 'Báo cáo',
				component: './club-management/report',
				hideInMenu: true,
			},
		],
	},
];
