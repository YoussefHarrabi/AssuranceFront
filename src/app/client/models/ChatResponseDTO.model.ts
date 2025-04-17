import { ResponseDataDTO } from "./ResponseDataDTO.model";

export interface ChatResponseDTO {
    message: string;
    timestamp: string;
    type: ResponseType;
    data?: ResponseDataDTO;
    content?: any;
    metadata?: string;
    suggestedQuestions?: string[];
}