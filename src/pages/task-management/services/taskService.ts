import { Task } from '../types/task';

const STORAGE_KEY = 'task-manager-tasks';

const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const getTasks = (): Task[] => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

export const saveTasks = (tasks: Task[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const createTask = (task: Omit<Task, 'id' | 'createdAt'>): Task => {
    const tasks = getTasks();
    const newTask: Task = {
        ...task,
        id: generateId(),
        createdAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    saveTasks(tasks);
    return newTask;
};

export const updateTask = (id: string, updates: Partial<Task>): Task | null => {
    const tasks = getTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;
    tasks[index] = { ...tasks[index], ...updates };
    saveTasks(tasks);
    return tasks[index];
};

export const deleteTask = (id: string): boolean => {
    const tasks = getTasks();
    const filtered = tasks.filter((t) => t.id !== id);
    saveTasks(filtered);
    return filtered.length < tasks.length;
};

export const moveTask = (id: string, newStatus: Task['status']): Task | null => {
    return updateTask(id, { status: newStatus });
};