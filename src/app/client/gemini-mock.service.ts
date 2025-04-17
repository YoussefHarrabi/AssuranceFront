import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable()
export class GeminiServiceMock {
  private chatHistory: Array<{ id: number, content: string, timestamp: string, type: string }> = [];

  constructor() {
    // Message de bienvenue initial
    this.chatHistory.push({
      id: 1,
      content: "Bonjour, je suis le chatbot Gemini. Comment puis-je vous aider aujourd'hui?",
      timestamp: new Date().toISOString(),
      type: "BOT"
    });
  }

  sendMessage(message: string, userId: string): Observable<any> {
    console.log('Mock service - Envoi de message:', message);
    
    // Ajouter le message de l'utilisateur à l'historique
    this.chatHistory.push({
      id: this.chatHistory.length + 1,
      content: message,
      timestamp: new Date().toISOString(),
      type: "USER"
    });
    
    // Simuler une réponse du chatbot
    const botResponses = [
      "Je comprends votre question. Pouvez-vous me donner plus de détails?",
      "Merci pour votre message. Nous traitons votre demande.",
      "D'après nos informations, votre police d'assurance couvre ce type de situation.",
      "Je vous recommande de contacter directement notre service client au Tél. : 00 216 71 788 800",
      "Votre demande a été enregistrée avec succès.",
      "Nous allons examiner votre dossier et vous répondre dans les meilleurs délais.",
      "Pour cette question spécifique, je vous conseille de consulter notre documentation en ligne.",
      "Je peux vous aider à résoudre ce problème. Avez-vous déjà essayé de...",
      "Selon nos termes et conditions, cette situation est couverte par votre assurance."
    ];
    
    // Sélectionner une réponse aléatoire
    const randomIndex = Math.floor(Math.random() * botResponses.length);
    const botResponse = botResponses[randomIndex];
    
    // Ajouter la réponse du bot à l'historique
    this.chatHistory.push({
      id: this.chatHistory.length + 1,
      content: botResponse,
      timestamp: new Date().toISOString(),
      type: "BOT"
    });
    
    // Retourner la réponse simulée avec un délai
    return of({ 
      message: botResponse,
      type: "BOT",
      timestamp: new Date().toISOString()
    }).pipe(delay(1000)); // Délai d'une seconde pour simuler le temps de réponse
  }

  getChatHistory(userId: string): Observable<any> {
    console.log('Mock service - Récupération de l\'historique pour l\'utilisateur:', userId);
    return of(this.chatHistory).pipe(delay(700));
  }

  getFAQs(): Observable<any> {
    return of([
      { question: "Quels types d'assurance proposez-vous?", answer: "Nous proposons des assurances auto, habitation, santé et vie." },
      { question: "Comment contacter le service client?", answer: "Vous pouvez nous joindre au Tél. : 00 216 71 788 800 ou par Fax : 00 216 71 788 334" },
      { question: "Quels sont vos horaires d'ouverture?", answer: "Nos bureaux sont ouverts du lundi au vendredi de 9h à 18h et le samedi de 9h à 12h." },
      { question: "Comment déclarer un sinistre?", answer: "Vous pouvez déclarer un sinistre en ligne sur notre site ou en appelant notre service dédié." },
      { question: "Comment résilier mon contrat?", answer: "Pour résilier votre contrat, envoyez-nous une lettre recommandée avec AR ou utilisez notre formulaire en ligne." }
    ]).pipe(delay(500));
  }

  clearChatHistory(userId: string): Observable<any> {
    console.log('Mock service - Effacement de l\'historique pour l\'utilisateur:', userId);
    // Garder uniquement le message de bienvenue
    this.chatHistory = [{
      id: 1,
      content: "Bonjour, je suis le chatbot Gemini. Comment puis-je vous aider aujourd'hui?",
      timestamp: new Date().toISOString(),
      type: "BOT"
    }];
    return of({ success: true }).pipe(delay(500));
  }
}