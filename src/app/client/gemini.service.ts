import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChatFeedbackDTO, ChatMessage, ChatRequest, ChatResponseDTO, MetadataConfig } from './models';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private readonly API_URL = 'http://localhost:8084/api/gemini';
  private messages = new BehaviorSubject<ChatMessage[]>([]);
  
  // Constants pour Maghrebia
  private readonly CONTACT_INFO = {
    SERVICE_CLIENT: '31 330 330',
    URGENCE: '31 399 399',
    EMAIL: 'contact@maghrebia.com.tn',
    FAX: '(+216) 71 784 307'
  };

  // Informations actuelles
  private readonly CURRENT_USER = 'zeinebcherif';
  private readonly CURRENT_TIME = '2025-04-16 17:00:26';

  // Suggestions par défaut
  private readonly DEFAULT_SUGGESTIONS = [
    'Quels types d\'assurance proposez-vous ?',
    'Comment vous contacter en cas d\'urgence ?',
    'Où se trouve votre siège social ?',
    'Quels sont vos horaires d\'ouverture ?'
  ];

  // Interface pour le mapping des numéros de téléphone
  private readonly PHONE_REPLACEMENTS: { [key: string]: string } = {
    '01.23.45.67.89': this.CONTACT_INFO.SERVICE_CLIENT,
    '01.23.45.67.90': this.CONTACT_INFO.SERVICE_CLIENT,
    '0800.12.34.56': this.CONTACT_INFO.URGENCE
  };
  
  constructor(private http: HttpClient) {}

  // Méthode pour remplacer les numéros de téléphone incorrects
  private replacePhoneNumbers(message: string): string {
    if (!message) return message;
    
    return message.replace(
      /01\.23\.45\.67\.89|01\.23\.45\.67\.90|0800\.12\.34\.56/g,
      (matched: string) => this.PHONE_REPLACEMENTS[matched] || matched
    );
  }

  // Envoyer un message au chatbot
  sendMessage(request: ChatRequest): Observable<ChatResponseDTO> {
    request.timestamp = this.CURRENT_TIME;
    return this.http.post<ChatResponseDTO>(`${this.API_URL}/send`, request)
      .pipe(
        map(response => ({
          ...response,
          message: this.replacePhoneNumbers(response.message)
        }))
      );
  }

  // Obtenir l'historique des messages
  getChatHistory(userId: string, limit: number = 20): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.API_URL}/history/${userId}?limit=${limit}`)
      .pipe(
        map(messages => messages.map(msg => ({
          ...msg,
          content: this.replacePhoneNumbers(msg.content)
        })))
      );
  }

  // Soumettre un feedback
  submitFeedback(feedback: ChatFeedbackDTO): Observable<any> {
    feedback.userId = this.CURRENT_USER;
    return this.http.post(`${this.API_URL}/feedback`, feedback);
  }

  // Effacer l'historique
  clearHistory(userId: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/history/${userId}`);
  }

  // Obtenir les informations du chatbot
  getChatbotInfo(): Observable<MetadataConfig> {
    return this.http.get<MetadataConfig>(`${this.API_URL}/info`);
  }

  // Obtenir les suggestions basées sur le contexte
  getSuggestions(context: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/suggestions/${context}`);
  }

  // Obtenir les FAQs
  getFAQs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/faq`)
      .pipe(
        map(faqs => faqs.map(faq => ({
          ...faq,
          answer: this.replacePhoneNumbers(faq.answer)
        })))
      );
  }

  // Vérifier l'état du service
  checkHealth(): Observable<any> {
    return this.http.get(`${this.API_URL}/health`);
  }

  // Méthodes utilitaires
  getCurrentUser(): string {
    return this.CURRENT_USER;
  }

  getCurrentTime(): string {
    return this.CURRENT_TIME;
  }

  getDefaultSuggestions(): string[] {
    return this.DEFAULT_SUGGESTIONS;
  }

  getContactInfo() {
    return this.CONTACT_INFO;
  }

  // Méthode pour formater un message d'erreur
  getErrorMessage(): string {
    return `Désolé, une erreur est survenue. Veuillez nous contacter au ${this.CONTACT_INFO.SERVICE_CLIENT} ou par email à ${this.CONTACT_INFO.EMAIL}`;
  }

  // Méthode pour obtenir le message de bienvenue
  getWelcomeMessage(): ChatMessage {
    return {
      content: 'Bonjour! Je suis l\'assistant virtuel de Maghrebia Assurances, spécialisé dans l\'assurance en Tunisie. Comment puis-je vous aider aujourd\'hui?',
      sender: 'bot',
      timestamp: new Date(),
      suggestedQuestions: this.DEFAULT_SUGGESTIONS
    };
  }

  // Méthode pour formater les réponses du chatbot
  formatBotResponse(response: string): string {
    return this.replacePhoneNumbers(response);
  }

  // Méthode pour obtenir les informations de contact formatées
  getFormattedContactInfo(): string {
    return `Pour nous contacter :\n` +
           `• Service Client : ${this.CONTACT_INFO.SERVICE_CLIENT}\n` +
           `• Urgence 24/7 : ${this.CONTACT_INFO.URGENCE}\n` +
           `• Email : ${this.CONTACT_INFO.EMAIL}\n` +
           `• Fax : ${this.CONTACT_INFO.FAX}`;
  }
}