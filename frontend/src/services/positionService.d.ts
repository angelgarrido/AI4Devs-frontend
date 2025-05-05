export interface Position {
    id: number;
    title: string;
    status: string;
    location: string;
    applicationDeadline: string;
    companyId: number;
    interviewFlowId: number;
    manager?: string;
}

export interface InterviewStep {
    id: number;
    name: string;
    order: number;
}

export interface InterviewFlow {
    id: number;
    name: string;
    steps: InterviewStep[];
}

export interface InterviewFlowResponse {
    interviewFlow: InterviewFlow;
}

export interface Candidate {
    id: number;
    fullName: string;
    currentStage: number;
    averageScore?: number;
    applicationId: number;
}

export function getAllPositions(): Promise<Position[]>;
export function getInterviewFlow(positionId: number): Promise<InterviewFlowResponse>;
export function getCandidatesByPosition(positionId: number): Promise<Candidate[]>;
export function updateCandidateStage(candidateId: number, interviewStepId: number, applicationId: number): Promise<any>; 