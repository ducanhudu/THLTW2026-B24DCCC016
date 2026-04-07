import React, { useState, useEffect, useMemo } from 'react';
import { Card, Typography, Row, Col, InputNumber, Progress, Alert, Space, Divider, Form, Statistic } from 'antd';
import {
	WalletOutlined,
	RestOutlined,
	CarOutlined,
	HomeOutlined,
	WarningOutlined,
	CheckCircleOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface TripItem {
	id: string;
	price: number;
}

const ITINERARY_KEY = 'travel_itinerary';
const BUDGET_SETTINGS_KEY = 'travel_budget_settings';

const Budget: React.FC = () => {
	const [totalBudget, setTotalBudget] = useState<number>(10000000);
	const [diningExpense, setDiningExpense] = useState<number>(0);
	const [transportExpense, setTransportExpense] = useState<number>(0);
	const [itineraryTotal, setItineraryTotal] = useState<number>(0);

	const loadData = () => {
		const savedItinerary = localStorage.getItem(ITINERARY_KEY);
		if (savedItinerary) {
			const items: TripItem[] = JSON.parse(savedItinerary);
			const total = items.reduce((sum, item) => sum + item.price, 0);
			setItineraryTotal(total);
		}

		const savedSettings = localStorage.getItem(BUDGET_SETTINGS_KEY);
		if (savedSettings) {
			const settings = JSON.parse(savedSettings);
			setTotalBudget(settings.totalBudget || 10000000);
			setDiningExpense(settings.diningExpense || 0);
			setTransportExpense(settings.transportExpense || 0);
		}
	};

	useEffect(() => {
		loadData();
		window.addEventListener('storage', loadData);
		return () => window.removeEventListener('storage', loadData);
	}, []);

	useEffect(() => {
		const settings = { totalBudget, diningExpense, transportExpense };
		localStorage.setItem(BUDGET_SETTINGS_KEY, JSON.stringify(settings));
	}, [totalBudget, diningExpense, transportExpense]);

	const totalSpent = useMemo(() => {
		return itineraryTotal + diningExpense + transportExpense;
	}, [itineraryTotal, diningExpense, transportExpense]);

	const remaining = totalBudget - totalSpent;
	const percent = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
	const isOverBudget = totalSpent > totalBudget;

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
	};

	return (
		<div style={{ padding: '0 8px' }}>
			<Title level={3} style={{ marginBottom: 24 }}>
				Quản lý ngân sách
			</Title>

			<Row gutter={[24, 24]}>
				<Col xs={24} lg={12}>
					<Card title='Ngân sách & Chi phí' bodyStyle={{ padding: '24px' }}>
						<Form layout='vertical'>
							<Form.Item
								label={
									<Text strong>
										<WalletOutlined /> Tổng ngân sách dự kiến
									</Text>
								}
							>
								<InputNumber
									style={{ width: '100%' }}
									value={totalBudget}
									onChange={(val) => setTotalBudget(val || 0)}
									formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
									parser={(value) => (value ? value.replace(/\$\s?|(,*)/g, '') : '') as any}
									addonAfter='VND'
								/>
							</Form.Item>

							<Divider>Chi phí phát sinh</Divider>

							<Form.Item
								label={
									<Text strong>
										<RestOutlined /> Ăn uống
									</Text>
								}
							>
								<InputNumber
									style={{ width: '100%' }}
									value={diningExpense}
									onChange={(val) => setDiningExpense(val || 0)}
									formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
									parser={(value) => (value ? value.replace(/\$\s?|(,*)/g, '') : '') as any}
									addonAfter='VND'
								/>
							</Form.Item>

							<Form.Item
								label={
									<Text strong>
										<CarOutlined /> Di chuyển
									</Text>
								}
							>
								<InputNumber
									style={{ width: '100%' }}
									value={transportExpense}
									onChange={(val) => setTransportExpense(val || 0)}
									formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
									parser={(value) => (value ? value.replace(/\$\s?|(,*)/g, '') : '') as any}
									addonAfter='VND'
								/>
							</Form.Item>

							<Text type='secondary' style={{ fontSize: 12 }}>
								({formatPrice(itineraryTotal)})
							</Text>
						</Form>
					</Card>
				</Col>

				<Col xs={24} lg={12}>
					<Card title='Phân tích chi tiêu' bodyStyle={{ padding: '24px' }}>
						<div style={{ textAlign: 'center', marginBottom: 32 }}>
							<Progress
								type='dashboard'
								percent={percent}
								strokeColor={isOverBudget ? '#ff4d4f' : percent > 80 ? '#faad14' : '#52c41a'}
								width={200}
								format={(percentValue) => (
									<div style={{ display: 'flex', flexDirection: 'column' }}>
										<Text strong style={{ fontSize: 24 }}>
											{percent}%
										</Text>
										<Text type='secondary' style={{ fontSize: 12 }}>
											Đã sử dụng
										</Text>
									</div>
								)}
							/>
						</div>

						<Row gutter={16} style={{ marginBottom: 24 }}>
							<Col span={12}>
								<Statistic
									title='Tổng chi tiêu'
									value={totalSpent}
									suffix='VND'
									valueStyle={{ color: isOverBudget ? '#cf1322' : '#3f8600', fontSize: 20 }}
								/>
							</Col>
							<Col span={12}>
								<Statistic
									title={remaining >= 0 ? 'Còn lại' : 'Vượt mức'}
									value={Math.abs(remaining)}
									suffix='VND'
									valueStyle={{ color: remaining < 0 ? '#cf1322' : '#52c41a', fontSize: 20 }}
								/>
							</Col>
						</Row>

						{isOverBudget && (
							<Alert
								message='Cảnh báo ngân sách'
								description={`Bạn đã vượt quá ngân sách dự kiến ${formatPrice(
									Math.abs(remaining),
								)}. Hãy xem xét cân đối lại chi phí!`}
								type='error'
								showIcon
								icon={<WarningOutlined />}
								style={{ marginBottom: 16 }}
							/>
						)}

						{!isOverBudget && percent > 0 && (
							<Alert
								message='Ngân sách ổn định'
								description='Kế hoạch tài chính của bạn đang nằm trong giới hạn cho phép.'
								type='success'
								showIcon
								icon={<CheckCircleOutlined />}
							/>
						)}

						<Divider orientation='left'>Phân bổ chi phí</Divider>
						<Space direction='vertical' style={{ width: '100%' }} size='middle'>
							<div>
								<Row justify='space-between'>
									<Col>
										<Text>
											<HomeOutlined /> Lưu trú/Tham quan
										</Text>
									</Col>
									<Col>
										<Text strong>{formatPrice(itineraryTotal)}</Text>
									</Col>
								</Row>
								<Progress
									percent={Math.round((itineraryTotal / totalSpent) * 100 || 0)}
									size='small'
									showInfo={false}
								/>
							</div>
							<div>
								<Row justify='space-between'>
									<Col>
										<Text>
											<RestOutlined /> Ăn uống
										</Text>
									</Col>
									<Col>
										<Text strong>{formatPrice(diningExpense)}</Text>
									</Col>
								</Row>
								<Progress
									percent={Math.round((diningExpense / totalSpent) * 100 || 0)}
									size='small'
									status='active'
									strokeColor='#fa8c16'
									showInfo={false}
								/>
							</div>
							<div>
								<Row justify='space-between'>
									<Col>
										<Text>
											<CarOutlined /> Di chuyển
										</Text>
									</Col>
									<Col>
										<Text strong>{formatPrice(transportExpense)}</Text>
									</Col>
								</Row>
								<Progress
									percent={Math.round((transportExpense / totalSpent) * 100 || 0)}
									size='small'
									status='active'
									strokeColor='#13c2c2'
									showInfo={false}
								/>
							</div>
						</Space>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default Budget;
