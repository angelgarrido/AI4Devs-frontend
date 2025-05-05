export interface Position {
    id: number;
    title: string;
    description: string;
}

export interface InterviewStep {
    id: number;
    name: string;
    description: string;
}

export interface InterviewFlow {
    id: number;
    name: string;
    description: string;
    steps: InterviewStep[];
}

export interface InterviewFlowResponse {
    interviewFlow: InterviewFlow;
}

export interface Candidate {
    id: number;
    name: string;
    email: string;
    currentStage: number;
    applicationId: number;
} 