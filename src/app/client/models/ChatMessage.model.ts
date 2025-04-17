export interface ChatMessage {
    content: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    isTyping?: boolean;
    suggestedQuestions?: string[];
    id?: number;
    feedback?: {
      isHelpful?: boolean;
      comment?: string;
    };
  }