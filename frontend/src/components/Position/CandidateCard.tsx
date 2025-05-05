import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from 'react-bootstrap';
import { Candidate } from '../../services/positionService';
import './Position.css';

interface CandidateCardProps {
    id: string;
    candidate: Candidate;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({ id, candidate }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            className="candidate-card"
            {...attributes}
            {...listeners}
        >
            <Card.Body>
                <Card.Title>{candidate.fullName}</Card.Title>
                <Card.Text>
                    <strong>Puntuación:</strong> {candidate.averageScore || 'Sin evaluar'}
                </Card.Text>
                <Card.Text>
                    <strong>Estado:</strong> {candidate.currentInterviewStep}
                </Card.Text>
            </Card.Body>
        </Card>
    );
}; 