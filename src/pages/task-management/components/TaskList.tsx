import React, { useState } from 'react';
import { Task, TaskStatus } from '../types/task';
import TaskTable from './TaskTable';
import TaskForm from './TaskForm';
import * as taskService from '../services/taskService';

interface TaskListProps {
    tasks: Task[];
    onRefresh: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onRefresh }) => {
    const [formVisible, setFormVisible] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const handleCreate = () => {
        setEditingTask(null);
        setFormVisible(true);
    };

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setFormVisible(true);
    };

    const handleSave = (values: any) => {
        if (editingTask) {
            taskService.updateTask(editingTask.id, values);
        } else {
            taskService.createTask(values);
        }
        setFormVisible(false);
        setEditingTask(null);
        onRefresh();
    };

    const handleDelete = (id: string) => {
        taskService.deleteTask(id);
        onRefresh();
    };

    const handleStatusChange = (id: string, status: TaskStatus) => {
        taskService.moveTask(id, status);
        onRefresh();
    };

    const handleCancel = () => {
        setFormVisible(false);
        setEditingTask(null);
    };

    return (
        <div>
            <TaskTable
                tasks={tasks}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
            />
            <TaskForm
                visible={formVisible}
                editingTask={editingTask}
                onSave={handleSave}
                onCancel={handleCancel}
            />
        </div>
    );
};

export default TaskList;