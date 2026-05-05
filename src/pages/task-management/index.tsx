import React, { useState, useEffect, useCallback } from 'react';
import { Segmented, Button, Typography } from 'antd';
import { Task, TaskStatus } from './types/task';
import * as taskService from './services/taskService';
import Dashboard from './components/Dashboard';
import KanbanBoard from './components/KanbanBoard';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';

const { Title } = Typography;

const TABS = ['Dashboard', 'Kanban Board', 'Task List'];

const TaskManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('Dashboard');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [formVisible, setFormVisible] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const loadTasks = useCallback(() => {
        const data = taskService.getTasks();
        setTasks(data);
    }, []);

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    const handleDragEnd = (taskId: string, newStatus: TaskStatus) => {
        taskService.moveTask(taskId, newStatus);
        loadTasks();
    };

    const handleCreateTask = () => {
        setEditingTask(null);
        setFormVisible(true);
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setFormVisible(true);
    };

    const handleSaveTask = (values: any) => {
        if (editingTask) {
            taskService.updateTask(editingTask.id, values);
        } else {
            taskService.createTask(values);
        }
        setFormVisible(false);
        setEditingTask(null);
        loadTasks();
    };

    const handleCancelForm = () => {
        setFormVisible(false);
        setEditingTask(null);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Dashboard':
                return <Dashboard tasks={tasks} />;
            case 'Kanban Board':
                return <KanbanBoard tasks={tasks} onDragEnd={handleDragEnd} />;
            case 'Task List':
                return <TaskList tasks={tasks} onRefresh={loadTasks} />;
            default:
                return <Dashboard tasks={tasks} />;
        }
    };

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 24,
                }}
            >
                <Title level={2} style={{ margin: 0 }}>
                    Task Manager
                </Title>
                <Button type="primary" onClick={handleCreateTask}>
                    Create Task
                </Button>
            </div>

            <div style={{ marginBottom: 24 }}>
                <Segmented
                    options={TABS}
                    value={activeTab}
                    onChange={(value) => setActiveTab(value as string)}
                    size="large"
                />
            </div>

            <div>{renderContent()}</div>

            <TaskForm
                visible={formVisible}
                editingTask={editingTask}
                onSave={handleSaveTask}
                onCancel={handleCancelForm}
            />
        </div>
    );
};

export default TaskManagement;