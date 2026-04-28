import React, { useState } from 'react';
import { Card, Row, Col, Typography, Statistic, List, Tag, Divider } from 'antd';
import Chart from 'react-apexcharts';

const { Title, Text } = Typography;

const mockStats = {
    totalWorkouts: 48,
    totalCalories: 12450,
    currentStreak: 7,
    completionRate: 85,
};

const mockWeeklyWorkouts = {
    options: {
        chart: { id: 'weekly-workouts' },
        xaxis: {
            categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
        },
        title: {
            text: 'Workouts Per Week',
            align: 'left' as const,
            style: { fontSize: '14px', fontWeight: '600' },
        },
        plotOptions: {
            bar: { horizontal: false, columnWidth: '50%' },
        },
        dataLabels: { enabled: false },
        colors: ['#1890ff'],
    },
    series: [
        {
            name: 'Workouts',
            data: [5, 7, 4, 6, 8, 5, 7, 6],
        },
    ],
};

const mockWeightOverTime = {
    options: {
        chart: { id: 'weight-over-time' },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        },
        title: {
            text: 'Weight Over Time (kg)',
            align: 'left' as const,
            style: { fontSize: '14px', fontWeight: '600' },
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth' as const },
        colors: ['#52c41a'],
    },
    series: [
        {
            name: 'Weight',
            data: [75, 74.5, 74, 73.2, 72.8, 72.5, 71.9, 71.5],
        },
    ],
};

const mockRecentWorkouts = [
    { id: 1, date: '2026-04-28', type: 'Cardio', duration: 45, calories: 520, status: 'Completed' },
    { id: 2, date: '2026-04-27', type: 'Strength', duration: 60, calories: 380, status: 'Completed' },
    { id: 3, date: '2026-04-26', type: 'Yoga', duration: 30, calories: 150, status: 'Completed' },
    { id: 4, date: '2026-04-25', type: 'HIIT', duration: 25, calories: 400, status: 'Skipped' },
    { id: 5, date: '2026-04-24', type: 'Other', duration: 50, calories: 300, status: 'Completed' },
];

const WorkoutDashboard: React.FC = () => {
    const [stats] = useState(mockStats);
    const [recentWorkouts] = useState(mockRecentWorkouts);

    return (
        <div style={{ padding: '24px' }}>
            <Title level={3} style={{ marginBottom: 24 }}>Dashboard</Title>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic title='Total Workouts' value={stats.totalWorkouts} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic title='Total Calories Burned' value={stats.totalCalories} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic title='Current Streak (days)' value={stats.currentStreak} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic title='Completion Rate (%)' value={stats.completionRate} suffix='%' />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} lg={12}>
                    <Card>
                        <Chart
                            options={mockWeeklyWorkouts.options}
                            series={mockWeeklyWorkouts.series}
                            type='bar'
                            height={350}
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card>
                        <Chart
                            options={mockWeightOverTime.options}
                            series={mockWeightOverTime.series}
                            type='line'
                            height={350}
                        />
                    </Card>
                </Col>
            </Row>

            <Card title={<Title level={4} style={{ margin: 0 }}>Recent Workouts</Title>}>
                <List
                    dataSource={recentWorkouts}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                title={
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text strong>{item.type}</Text>
                                        <Tag color={item.status === 'Completed' ? 'green' : 'red'}>{item.status}</Tag>
                                    </div>
                                }
                                description={
                                    <div>
                                        <Text type='secondary'>{item.date}</Text>
                                        <Divider type='vertical' />
                                        <Text type='secondary'>{item.duration} min</Text>
                                        <Divider type='vertical' />
                                        <Text type='secondary'>{item.calories} cal</Text>
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />
            </Card>
        </div>
    );
};

export default WorkoutDashboard;