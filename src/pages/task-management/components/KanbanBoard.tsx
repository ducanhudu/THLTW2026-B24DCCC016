import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Task, TaskStatus } from '../types/task';
import TaskCard from './TaskCard';

const columns: { key: TaskStatus; title: string; color: string }[] = [
    { key: 'todo', title: 'Todo', color: '#1890ff' },
    { key: 'in-progress', title: 'In Progress', color: '#faad14' },
    { key: 'done', title: 'Done', color: '#52c41a' },
];

interface KanbanBoardProps {
    tasks: Task[];
    onDragEnd: (taskId: string, newStatus: TaskStatus) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onDragEnd }) => {
    const handleDragEnd = (result: DropResult) => {
        const { destination, draggableId } = result;
        if (!destination) return;
        const newStatus = destination.droppableId as TaskStatus;
        onDragEnd(draggableId, newStatus);
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div style={{ display: 'flex', gap: 16, minHeight: 400 }}>
                {columns.map((column) => {
                    const columnTasks = tasks.filter((t) => t.status === column.key);
                    return (
                        <div
                            key={column.key}
                            style={{
                                flex: 1,
                                background: '#fafafa',
                                borderRadius: 8,
                                padding: 12,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <div
                                style={{
                                    fontWeight: 700,
                                    fontSize: 15,
                                    marginBottom: 12,
                                    paddingBottom: 8,
                                    borderBottom: `2px solid ${column.color}`,
                                    color: column.color,
                                }}
                            >
                                {column.title} ({columnTasks.length})
                            </div>
                            <Droppable droppableId={column.key}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        style={{
                                            flex: 1,
                                            minHeight: 100,
                                            background: snapshot.isDraggingOver ? '#e6f7ff' : 'transparent',
                                            borderRadius: 6,
                                            transition: 'background 0.2s ease',
                                        }}
                                    >
                                        {columnTasks.map((task, index) => (
                                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{
                                                            ...provided.draggableProps.style,
                                                            marginBottom: 0,
                                                        }}
                                                    >
                                                        <TaskCard task={task} />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    );
                })}
            </div>
        </DragDropContext>
    );
};

export default KanbanBoard;