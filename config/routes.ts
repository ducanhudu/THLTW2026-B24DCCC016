export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/dashboard/about',
		component: './TrangChu/About',
		hideInMenu: true,
	},
	{
		path: '/dashboard/blog-manager',
		component: './TrangChu/BlogManager',
		hideInMenu: true,
	},
	{
		path: '/dashboard/tag-manager',
		component: './TrangChu/TagManager',
		hideInMenu: true,
	},
	{
		path: '/dashboard/:id',
		component: './TrangChu/Detail',
		hideInMenu: true,
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/todo-list',
		name: 'TodoList',
		icon: 'OrderedListOutlined',
		component: './TodoList',
	},
	{
		path: '/theo-doi-hoc-tap',
		name: 'TheoDoiHocTap',
		icon: 'BookOutlined',
		component: './TheoDoiHocTap',
	},
	{
		path: '/doan-so-ngau-nhien',
		name: 'DoanSoNgauNhien',
		icon: 'SmileOutlined',
		component: './DoanSoNgauNhien',
	},
	{
		path: '/keo-bua-bao',
		name: 'KeoBuaBao',
		icon: 'SmileOutlined',
		component: './KeoBuaBao',
	},
	{
		path: '/ngan-hang-de-thi',
		name: 'NganHangDeThi',
		icon: 'SmileOutlined',
		component: './NganHangDeThi',
	},
	{
		path: '/set-lich-dich-vu',
		name: 'SetLichDichVu',
		icon: 'SmileOutlined',
		component: './SetLichDichVu',
	},
	{
		path: '/van-bang',
		name: 'QuanLyVanBang',
		icon: 'SmileOutlined',
		component: './VanBang',
	},
	{
		path: '/quan-ly-cau-lac-bo',
		name: 'QuanLyCauLacBo',
		icon: 'SmileOutlined',
		component: './club-management',
	},
	{
		path: '/travel',
		name: 'Travel',
		icon: 'CompassOutlined',
		component: './Travel',
	},
	{
		path: '/course-management',
		name: 'CourseManagement',
		icon: 'BookOutlined',
		component: './course-management',
	},
	{
		path: '/healthcare',
		name: 'HealthCare',
		icon: 'HeartOutlined',
		component: './Healthcare/FitnessAppPage',
	},

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];