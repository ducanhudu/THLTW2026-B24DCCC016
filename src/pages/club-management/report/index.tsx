import { PageContainer } from '@ant-design/pro-components';
import { Card, Statistic, Row, Col } from 'antd';
import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

const ReportPage = () => {
	const [stats, setStats] = useState({
		totalClubs: 0,
		totalPending: 0,
		totalApproved: 0,
		totalRejected: 0,
	});

	const [chartData, setChartData] = useState<any>({
		series: [],
		options: {},
	});

	useEffect(() => {
		const savedClubs = localStorage.getItem('clubData');
		const clubData = savedClubs ? JSON.parse(savedClubs) : [];

		const savedApps = localStorage.getItem('memberApplications');
		const memberApplications = savedApps ? JSON.parse(savedApps) : [];

		setStats({
			totalClubs: clubData.length,
			totalPending: memberApplications.filter((a: any) => a.status === 'Pending').length,
			totalApproved: memberApplications.filter((a: any) => a.status === 'Approved').length,
			totalRejected: memberApplications.filter((a: any) => a.status === 'Rejected').length,
		});

		const clubNames = clubData.map((c: any) => c.name);
		const pendingData = clubData.map(
			(c: any) => memberApplications.filter((a: any) => a.clubName === c.name && a.status === 'Pending').length,
		);
		const approvedData = clubData.map(
			(c: any) => memberApplications.filter((a: any) => a.clubName === c.name && a.status === 'Approved').length,
		);
		const rejectedData = clubData.map(
			(c: any) => memberApplications.filter((a: any) => a.clubName === c.name && a.status === 'Rejected').length,
		);

		setChartData({
			series: [
				{ name: 'Pending', data: pendingData },
				{ name: 'Approved', data: approvedData },
				{ name: 'Rejected', data: rejectedData },
			],
			options: {
				chart: {
					type: 'bar',
					height: 350,
					toolbar: { show: false },
				},
				plotOptions: {
					bar: {
						horizontal: false,
						columnWidth: '55%',
						endingShape: 'rounded',
					},
				},
				dataLabels: { enabled: false },
				stroke: {
					show: true,
					width: 2,
					colors: ['transparent'],
				},
				xaxis: {
					categories: clubNames,
				},
				yaxis: {
					title: { text: 'Số lượng đơn' },
				},
				fill: { opacity: 1 },
				tooltip: {
					y: {
						formatter: (val: number) => val + ' đơn',
					},
				},
				colors: ['#faad14', '#52c41a', '#ff4d4f'],
			},
		});
	}, []);

	return (
		<PageContainer title='Báo cáo và Thống kê'>
			<Row gutter={16} style={{ marginBottom: '24px' }}>
				<Col span={6}>
					<Card>
						<Statistic title='Tổng số CLB' value={stats.totalClubs} />
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic title='Chờ duyệt (Pending)' value={stats.totalPending} valueStyle={{ color: '#faad14' }} />
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic title='Đã duyệt (Approved)' value={stats.totalApproved} valueStyle={{ color: '#52c41a' }} />
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic title='Từ chối (Rejected)' value={stats.totalRejected} valueStyle={{ color: '#ff4d4f' }} />
					</Card>
				</Col>
			</Row>

			<Card title='Thống kê đơn đăng ký theo từng Câu lạc bộ'>
				{chartData.series.length > 0 ? (
					<Chart options={chartData.options} series={chartData.series} type='bar' height={350} />
				) : (
					<div style={{ textAlign: 'center', padding: '50px' }}>Chưa có dữ liệu thống kê.</div>
				)}
			</Card>
		</PageContainer>
	);
};

export default ReportPage;
