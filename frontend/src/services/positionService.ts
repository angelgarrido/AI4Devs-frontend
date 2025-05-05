import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3010';

export interface Employee {
    name: string;
}

export interface Company {
    id: number;
    name: string;
    employees: Employee[];
}

export interface Position {
    id: number;
    companyId: number;
    interviewFlowId: number;
    title: string;
    description: string;
    status: string;
    isVisible: boolean;
    location: string;
    jobDescription: string;
    requirements: string;
    responsibilities: string;
    salaryMin: number;
    salaryMax: number;
    employmentType: string;
    benefits: string;
    companyDescription: string;
    applicationDeadline: string;
    contactInfo: string;
    company: Company;
    manager: string;
}

export interface InterviewStep {
    id: number;
    interviewFlowId: number;
    interviewTypeId: number;
    name: string;
    orderIndex: number;
}

export interface InterviewFlow {
    id: number;
    description: string;
    interviewSteps: InterviewStep[];
}

export interface InterviewFlowResponse {
    interviewFlow: {
        positionName: string;
        interviewFlow: InterviewFlow;
    };
}

export interface Candidate {
    id: number;
    fullName: string;
    currentInterviewStep: string;
    averageScore: number;
    applicationId: number;
}

export interface UpdateCandidateResponse {
    message: string;
    data: {
        id: number;
        positionId: number;
        candidateId: number;
        applicationDate: string;
        currentInterviewStep: number;
        notes: string | null;
        interviews: any[];
    };
}

export const getAllPositions = async (): Promise<Position[]> => {
    try {
        const response = await axios.get(`${API_URL}/positions`);
        return response.data;
    } catch (error) {
        console.error('Error fetching positions:', error);
        throw error;
    }
};

export const getInterviewFlow = async (positionId: number): Promise<InterviewFlowResponse> => {
    try {
        const response = await axios.get(`${API_URL}/positions/${positionId}/interviewflow`);
        return response.data;
    } catch (error) {
        console.error('Error fetching interview flow:', error);
        throw error;
    }
};

export const getCandidatesByPosition = async (positionId: number): Promise<Candidate[]> => {
    try {
        const response = await axios.get(`${API_URL}/positions/${positionId}/candidates`);
        return response.data;
    } catch (error) {
        console.error('Error fetching candidates:', error);
        throw error;
    }
};

export const updateCandidateStage = async (
    candidateId: number,
    applicationId: string,
    currentInterviewStep: string
): Promise<UpdateCandidateResponse> => {
    try {
        console.log('Sending update request:', {
            candidateId,
            applicationId,
            currentInterviewStep
        });
        
        const response = await axios.put(`${API_URL}/candidates/${candidateId}`, {
            applicationId,
            currentInterviewStep
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Update response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating candidate stage:', error);
        if (axios.isAxiosError(error)) {
            console.error('Error details:', {
                status: error.response?.status,
                data: error.response?.data,
                config: error.config
            });
        }
        throw error;
    }
};