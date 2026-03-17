import { Tabs } from 'antd';
import Employees from './QuanLyNhanVien';
import Services from './QuanLyDichVu';
import Bookings from './QuanLyLichHen';
import Reviews from './DanhGia';
import Reports from './ThongKe';

const { TabPane } = Tabs;

export default function AppointmentApp() {
	return (
		<div style={{ padding: 24 }}>
			<h1>Hệ thống đặt lịch dịch vụ</h1>

			<Tabs defaultActiveKey='1'>
				<TabPane tab='Nhân viên' key='1'>
					<Employees />
				</TabPane>

				<TabPane tab='Dịch vụ' key='2'>
					<Services />
				</TabPane>

				<TabPane tab='Lịch hẹn' key='3'>
					<Bookings />
				</TabPane>

				<TabPane tab='Đánh giá' key='4'>
					<Reviews />
				</TabPane>

				<TabPane tab='Thống kê' key='5'>
					<Reports />
				</TabPane>
			</Tabs>
		</div>
	);
}
