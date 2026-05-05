import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import { Task } from '../types/task';
import StatCard from './StatCard';

const { Title, Text } = Typography;

interface DashboardProps {
    tasks: Task[];
}

const Dashboard: React.FC<DashboardProps> = ({ tasks }) => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'done').length;
    const overdueTasks = tasks.filter(
        (t) => t.deadline && new Date(t.deadline) < new Date() && t.status !== 'done',
    ).length;

    const recentTasks = [...tasks]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    const tasksByPriority = {
        high: tasks.filter((t) => t.priority === 'high').length,
        medium: tasks.filter((t) => t.priority === 'medium').length,
        low: tasks.filter((t) => t.priority === 'low').length,
    };

    return (
        <div>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                    <StatCard title="Total Tasks" value={totalTasks} color="#1890ff" />
                </Col>
                <Col xs={24} sm={8}>
                    <StatCard title="Completed Tasks" value={completedTasks} color="#52c41a" />
                </Col>
                <Col xs={24} sm={8}>
                    <StatCard title="Overdue Tasks" value={overdueTasks} color="#ff4d4f" />
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col xs={24} sm={12}>
                    <Card title="Priority Distribution" style={{ borderRadius: 8 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text>High Priority</Text>
                                <Text strong style={{ color: '#ff4d4f' }}>{tasksByPriority.high}</Text>
                            </div>
                            <div
                                style={{
                                    height: 8,
                                    background: '#f0f0f0',
                                    borderRadius: 4,
                                    overflow: 'hidden',
                                }}
                            >
                                <div
                                    style={{
                                        width: totalTasks ? `${(tasksByPriority.high / totalTasks) * 100}%` : '0%',
                                        height: '100%',
                                        background: '#ff4d4f',
                                        borderRadius: 4,
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text>Medium Priority</Text>
                                <Text strong style={{ color: '#faad14' }}>{tasksByPriority.medium}</Text>
                            </div>
                            <div
                                style={{
                                    height: 8,
                                    background: '#f0f0f0',
                                    borderRadius: 4,
                                    overflow: 'hidden',
                                }}
                            >
                                <div
                                    style={{
                                        width: totalTasks ? `${(tasksByPriority.medium / totalTasks) * 100}%` : '0%',
                                        height: '100%',
                                        background: '#faad14',
                                        borderRadius: 4,
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text>Low Priority</Text>
                                <Text strong style={{ color: '#52c41a' }}>{tasksByPriority.low}</Text>
                            </div>
                            <div
                                style={{
                                    height: 8,
                                    background: '#f0f0f0',
                                    borderRadius: 4,
                                    overflow: 'hidden',
                                }}
                            >
                                <div
                                    style={{
                                        width: totalTasks ? `${(tasksByPriority.low / totalTasks) * 100}%` : '0%',
                                        height: '100%',
                                        background: '#52c41a',
                                        borderRadius: 4,
                                    }}
                                />
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12}>
                    <Card title="Recent Tasks" style={{ borderRadius: 8 }}>
                        {recentTasks.length === 0 ? (
                            <Text type="secondary">No tasks yet</Text>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {recentTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        style={{
                                            padding: '8px 12px',
                                            background: '#fafafa',
                                            borderRadius: 6,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text>{task.name}</Text>
                                        <Text
                                            type={
                                                task.status === 'done'
                                                    ? 'success'
                                                    : task.status === 'in-progress'
                                                        ? undefined
                                                        : 'secondary'
                                            }
                                            style={{ fontSize: 12 }}
                                        >
                                            {task.status === 'in-progress'
                                                ? 'In Progress'
                                                : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                        </Text>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;