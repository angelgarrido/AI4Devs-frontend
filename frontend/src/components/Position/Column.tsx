import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Card } from 'react-bootstrap';
import './Position.css';

interface ColumnProps {
    id: string;
    title: string;
    children: React.ReactNode;
}

export const Column: React.FC<ColumnProps> = ({ id, title, children }) => {
    const { setNodeRef, isOver } = useDroppable({
        id,
        data: {
            type: 'column'
        }
    });

    return (
        <Card className={`kanban-column-card ${isOver ? 'drag-over' : ''}`}>
            <Card.Header className="kanban-column-header">
                {title}
            </Card.Header>
            <Card.Body 
                ref={setNodeRef}
                className="kanban-column-body"
            >
                {children}
            </Card.Body>
        </Card>
    );
}; 