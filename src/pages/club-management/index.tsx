import { Tabs } from 'antd';
import Clubs from './club';
import Applications from './application';
import Members from './member';
import Reports from './report';

const { TabPane } = Tabs;

export default function ClubManagementApp() {
	return (
		<div style={{ padding: 24 }}>
			<h1>Hệ thống quản lý Câu lạc bộ</h1>

			<Tabs defaultActiveKey='1'>
				<TabPane tab='Câu lạc bộ' key='1'>
					<Clubs />
				</TabPane>

				<TabPane tab='Đơn đăng ký' key='2'>
					<Applications />
				</TabPane>

				<TabPane tab='Thành viên' key='3'>
					<Members />
				</TabPane>

				<TabPane tab='Thống kê' key='4'>
					<Reports />
				</TabPane>
			</Tabs>
		</div>
	);
}
