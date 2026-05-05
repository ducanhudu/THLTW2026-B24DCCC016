import React from 'react';
import { Card, Tag, Typography } from 'antd';
import { Task, TaskPriority } from '../types/task';

const { Text } = Typography;

const priorityColors: Record<TaskPriority, string> = {
    low: 'green',
    medium: 'orange',
    high: 'red',
};

interface TaskCardProps {
    task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
    const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 'done';

    return (
        <Card
            size="small"
            style={{
                marginBottom: 8,
                borderRadius: 6,
                borderLeft: `3px solid ${priorityColors[task.priority]}`,
            }}
            bodyStyle={{ padding: '8px 12px' }}
        >
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{task.name}</div>
            {task.description && (
                <Text
                    type="secondary"
                    style={{ fontSize: 12, display: 'block', marginBottom: 4 }}
                    ellipsis
                >
                    {task.description}
                </Text>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    {task.tags?.map((tag) => (
                        <Tag key={tag} style={{ fontSize: 11, marginRight: 2 }}>
                            {tag}
                        </Tag>
                    ))}
                </div>
                {task.deadline && (
                    <Text
                        style={{ fontSize: 11 }}
                        type={isOverdue ? 'danger' : 'secondary'}
                    >
                        {task.deadline}
                    </Text>
                )}
            </div>
        </Card>
    );
};

export default TaskCard;