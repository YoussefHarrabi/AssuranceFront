import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { ChatbotService } from '../chatbot.service';
import { ChatResponse } from '../models/ChatResponse.model';
import { ContactInfo, CustomLocation, ResponseType, Schedule } from '../models';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollMe') private scrollContainer!: ElementRef;

  messages: Array<{
    text: string;
    isUser: boolean;
    timestamp: string;
    type?: ResponseType;
    data?: {
      location?: CustomLocation;
      contact?: ContactInfo;
      schedule?: Schedule;
    };
  }> = [];
  
  currentMessage: string = '';
  userId: string = 'zeinebcherif';
  currentUser: string = 'zeinebcherif';
  currentDateTime: string = '2025-04-15 22:41:57';

  constructor(private chatbotService: ChatbotService) {}

  ngOnInit(): void {
    this.messages.push({
      text: 'Bonjour ! Comment puis-je vous aider avec nos assurances ?',
      isUser: false,
      timestamp: new Date().toISOString(),
      type: ResponseType.TEXT
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  sendMessage(): void {
    if (this.currentMessage.trim() === '') return;

    this.messages.push({
      text: this.currentMessage,
      isUser: true,
      timestamp: new Date().toISOString(),
      type: ResponseType.TEXT as ResponseType
    });

    this.chatbotService.sendMessage(this.currentMessage, this.userId)
      .subscribe({
        next: (response: ChatResponse) => {
          this.messages.push({
            text: response.message,
            isUser: false,
            timestamp: response.timestamp,
            type: response.type as ResponseType,
            data: response.data
          });
          this.scrollToBottom();
        },
        error: (error) => {
          console.error('Erreur lors de l\'envoi du message:', error);
          this.messages.push({
            text: 'Désolé, une erreur est survenue. Veuillez réessayer.',
            isUser: false,
            timestamp: new Date().toISOString(),
            type: ResponseType.ERROR as ResponseType
          });
          this.scrollToBottom();
        }
      });

    this.currentMessage = '';
  }

  isLocationResponse(type?: ResponseType): boolean {
    return type === ResponseType.LOCATION;
  }

  isContactResponse(type?: ResponseType): boolean {
    return type === ResponseType.CONTACT;
  }

  isScheduleResponse(type?: ResponseType): boolean {
    return type === ResponseType.SCHEDULE;
  }

  openMap(location: CustomLocation | undefined): void {
    if (location?.address && location?.postalCode && location?.city && location?.country) {
      const query = `${location.address}, ${location.postalCode} ${location.city}, ${location.country}`;
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
      window.open(url, '_blank');
    }
  }

  formatTime(time: string | undefined): string {
    if (!time) return '';
    try {
      const [hours, minutes] = time.split(':');
      return new Intl.DateTimeFormat('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(new Date(2000, 0, 1, parseInt(hours), parseInt(minutes)));
    } catch {
      return time;
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  isLastMessage(index: number): boolean {
    return index === this.messages.length - 1;
  }

  getMessageClass(message: any): string {
    let classes = ['message'];
    if (message.isUser) {
      classes.push('message-user');
    } else {
      classes.push('message-bot');
    }
    if (message.type === ResponseType.ERROR) {
      classes.push('message-error');
    }
    return classes.join(' ');
  }

  onInputFocus(): void {
    this.scrollToBottom();
  }

  clearChat(): void {
    this.messages = [{
      text: 'Bonjour ! Comment puis-je vous aider avec nos assurances ?',
      isUser: false,
      timestamp: new Date().toISOString(),
      type: ResponseType.TEXT
    }];
  }

  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  ensureHttpProtocol(url: string): string {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  }

  getSafeUrl(url: string | undefined): string {
    if (!url) return '#';
    return this.ensureHttpProtocol(url);
  }
}