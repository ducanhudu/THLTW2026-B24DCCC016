export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
    id: string;
    name: string;
    description: string;
    deadline: string;
    priority: TaskPriority;
    status: TaskStatus;
    tags: string[];
    createdAt: string;
}