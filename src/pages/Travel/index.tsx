import React from 'react';
import { Tabs, Typography, Layout } from 'antd';
import Explore from './components/Explore';
import TripPlanner from './components/TripPlanner';
import Budget from './components/Budget';
import Admin from './components/Admin';

const { Title } = Typography;
const { Content } = Layout;

const TravelPage: React.FC = () => {
	return (
		<Content style={{ padding: '24px', background: '#fff', minHeight: '100vh' }}>
			<div style={{ marginBottom: '24px' }}>
				<Title level={2}>Quản lý Du lịch</Title>
			</div>

			<Tabs defaultActiveKey='1' type='card' size='large'>
				<Tabs.TabPane tab='Khám phá' key='1'>
					<Explore />
				</Tabs.TabPane>
				<Tabs.TabPane tab='Lịch trình' key='2'>
					<TripPlanner />
				</Tabs.TabPane>
				<Tabs.TabPane tab='Ngân sách' key='3'>
					<Budget />
				</Tabs.TabPane>
				<Tabs.TabPane tab='Quản trị' key='4'>
					<Admin />
				</Tabs.TabPane>
			</Tabs>
		</Content>
	);
};

export default TravelPage;
