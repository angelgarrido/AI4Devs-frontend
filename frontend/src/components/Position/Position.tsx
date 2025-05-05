import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DndContext, DragEndEvent, closestCorners, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { getInterviewFlow, getCandidatesByPosition, updateCandidateStage } from '../../services/positionService';
import { InterviewFlowResponse, Candidate, InterviewStep } from '../../services/positionService';
import { Column } from './Column';
import { CandidateCard } from './CandidateCard';
import { Container, Row, Col } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';
import './Position.css';

const Position: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [interviewFlow, setInterviewFlow] = useState<InterviewFlowResponse | null>(null);
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!id) return;
                const [flowData, candidatesData] = await Promise.all([
                    getInterviewFlow(parseInt(id)),
                    getCandidatesByPosition(parseInt(id))
                ]);
                setInterviewFlow(flowData);
                setCandidates(candidatesData);
            } catch (err) {
                setError('Error al cargar los datos de la posición');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveId(active.id as string);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over || !interviewFlow) {
            console.log('No hay un destino válido o no hay datos del flujo de entrevistas');
            return;
        }

        const candidateId = parseInt(active.id as string);
        const newStepName = over.id as string;
        
        const candidate = candidates.find(c => c.id === candidateId);
        if (!candidate) {
            console.log('Candidato no encontrado');
            return;
        }

        // Encontrar el ID del paso para el nuevo nombre del paso
        const newStep = interviewFlow.interviewFlow.interviewFlow.interviewSteps.find(
            step => step.name === newStepName
        );

        if (!newStep) {
            console.log('Paso no encontrado:', newStepName);
            return;
        }

        console.log('Actualizando etapa del candidato:', {
            candidateId,
            newStepId: newStep.id,
            newStepName,
            currentStep: candidate.currentInterviewStep,
            applicationId: candidate.applicationId
        });

        try {
            // Primero actualizar la UI optimistamente
            setCandidates(prevCandidates =>
                prevCandidates.map(c =>
                    c.id === candidateId
                        ? { ...c, currentInterviewStep: newStepName }
                        : c
                )
            );

            // Luego hacer la llamada a la API con el ID del paso
            await updateCandidateStage(
                candidateId,
                candidate.applicationId.toString(),
                newStep.id.toString()
            );

            console.log('Etapa del candidato actualizada exitosamente');
        } catch (err) {
            console.error('Error al actualizar la etapa del candidato:', err);
            // Revertir el cambio en la UI si falla la llamada a la API
            setCandidates(prevCandidates =>
                prevCandidates.map(c =>
                    c.id === candidateId
                        ? { ...c, currentInterviewStep: candidate.currentInterviewStep }
                        : c
                )
            );
        }
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!interviewFlow) return <div>No hay datos disponibles</div>;

    const steps = interviewFlow.interviewFlow.interviewFlow.interviewSteps;
    const activeCandidate = activeId ? candidates.find(c => c.id.toString() === activeId) : null;

    return (
        <Container fluid className="position-container">
            <div className="position-header">
                <Link to="/positions" className="back-link">
                    <ArrowLeft size={20} />
                    <span>Volver a Posiciones</span>
                </Link>
                <h1 className="position-title">
                    {interviewFlow.interviewFlow.positionName}
                </h1>
            </div>
            
            <div className="kanban-container">
                <DndContext
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <Row className="kanban-board">
                        {steps.map((step: InterviewStep) => (
                            <Col key={step.id} xs={12} md={4} lg={3} className="kanban-column">
                                <Column
                                    id={step.name}
                                    title={step.name}
                                >
                                    <SortableContext
                                        items={candidates
                                            .filter(c => c.currentInterviewStep === step.name)
                                            .map(c => c.id.toString())}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {candidates
                                            .filter(c => c.currentInterviewStep === step.name)
                                            .map(candidate => (
                                                <CandidateCard
                                                    key={candidate.id}
                                                    id={candidate.id.toString()}
                                                    candidate={candidate}
                                                />
                                            ))}
                                    </SortableContext>
                                </Column>
                            </Col>
                        ))}
                    </Row>
                    <DragOverlay dropAnimation={null}>
                        {activeCandidate ? (
                            <div className="candidate-card-overlay">
                                <div className="card-title">{activeCandidate.fullName}</div>
                                <div className="card-text">
                                    Puntuación: {activeCandidate.averageScore || 'Sin evaluar'}
                                </div>
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>
        </Container>
    );
};

export default Position; 