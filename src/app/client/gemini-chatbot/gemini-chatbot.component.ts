import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GeminiService } from '../gemini.service';
import { ChatMessage, ChatRequest, ChatResponseDTO } from '../models';

@Component({
  selector: 'app-gemini-chatbot',
  templateUrl: './gemini-chatbot.component.html',
  styleUrls: ['./gemini-chatbot.component.css'],
})
export class GeminiChatbotComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollMe') private scrollContainer!: ElementRef;

  messages: ChatMessage[] = [];
  currentMessage = '';
  isTyping = false;
  suggestedQuestions: string[] = [];
  userId: string;
  currentDateTime: string;

  constructor(private geminiService: GeminiService) {
    this.userId = this.geminiService.getCurrentUser();
    this.currentDateTime = this.geminiService.getCurrentTime();
  }

  ngOnInit() {
    this.loadChatHistory();
    this.addWelcomeMessage();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  onInputFocus(): void {
    this.scrollToBottom();
  }

  private loadChatHistory(): void {
    this.geminiService.getChatHistory(this.userId).subscribe({
      next: (history) => {
        this.messages = history;
        this.scrollToBottom();
      },
      error: (error) => console.error('Erreur lors du chargement de l\'historique:', error)
    });
  }

  private addWelcomeMessage(): void {
    const welcomeMessage = this.geminiService.getWelcomeMessage();
    this.messages.push(welcomeMessage);
  }

  sendMessage(): void {
    if (!this.currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      content: this.currentMessage,
      sender: 'user',
      timestamp: new Date()
    };
    this.messages.push(userMessage);

    const request: ChatRequest = {
      message: this.currentMessage,
      userId: this.userId,
      timestamp: this.currentDateTime
    };

    this.currentMessage = '';
    this.isTyping = true;

    this.geminiService.sendMessage(request).subscribe({
      next: (response: ChatResponseDTO) => {
        this.isTyping = false;
        const botMessage: ChatMessage = {
          content: response.message,
          sender: 'bot',
          timestamp: new Date(response.timestamp),
          suggestedQuestions: response.suggestedQuestions,
          id: new Date().getTime()
        };
        this.messages.push(botMessage);
        this.suggestedQuestions = response.suggestedQuestions || [];
        this.scrollToBottom();
      },
      error: (error) => {
        this.isTyping = false;
        console.error('Erreur lors de l\'envoi du message:', error);
        const errorMessage: ChatMessage = {
          content: this.geminiService.getErrorMessage(),
          sender: 'bot',
          timestamp: new Date(),
          suggestedQuestions: this.geminiService.getDefaultSuggestions()
        };
        this.messages.push(errorMessage);
        this.scrollToBottom();
      }
    });
  }

  useSuggestedQuestion(question: string): void {
    this.currentMessage = question;
    this.sendMessage();
  }

  provideFeedback(message: ChatMessage, isHelpful: boolean): void {
    if (message.id) {
      this.geminiService.submitFeedback({
        messageId: message.id,
        helpful: isHelpful,
        comment: '',
        userId: this.userId
      }).subscribe({
        next: () => {
          if (message.feedback) {
            message.feedback.isHelpful = isHelpful;
          } else {
            message.feedback = { isHelpful };
          }
        },
        error: (error) => console.error('Erreur lors de l\'envoi du feedback:', error)
      });
    }
  }

  clearChat(): void {
    this.geminiService.clearHistory(this.userId).subscribe({
      next: () => {
        this.messages = [];
        this.addWelcomeMessage();
      },
      error: (error) => console.error('Erreur lors de l\'effacement de l\'historique:', error)
    });
  }

  getMessageClass(message: ChatMessage): string {
    return message.sender === 'user' ? 'user-message' : 'bot-message';
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}