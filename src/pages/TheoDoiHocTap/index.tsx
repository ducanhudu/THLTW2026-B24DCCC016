import { Tabs } from 'antd';
import SubjectManager from './components/SubjectManager';
import SessionManager from './components/SessionManager';
import TargetManager from './components/TargetManager';

const { TabPane } = Tabs;

const TheoDoiHocTap = () => {
	return (
		<div style={{ padding: 24 }}>
			<Tabs defaultActiveKey='1'>
				<TabPane tab='Quản lý Môn học' key='1'>
					<SubjectManager />
				</TabPane>

				<TabPane tab='Nhật ký Học tập' key='2'>
					<SessionManager />
				</TabPane>

				<TabPane tab='Mục tiêu & Tiến độ' key='3'>
					<TargetManager />
				</TabPane>
			</Tabs>
		</div>
	);
};

export default TheoDoiHocTap;
