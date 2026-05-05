import React from 'react';
import { Card } from 'antd';

interface StatCardProps {
    title: string;
    value: number;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color }) => {
    return (
        <Card
            bodyStyle={{ padding: 24 }}
            style={{
                borderTop: `3px solid ${color}`,
                borderRadius: 8,
            }}
        >
            <div style={{ fontSize: 14, color: '#8c8c8c', marginBottom: 8 }}>{title}</div>
            <div style={{ fontSize: 32, fontWeight: 700, color }}>{value}</div>
        </Card>
    );
};

export default StatCard;