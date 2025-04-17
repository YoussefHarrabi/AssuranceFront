import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { 
  ChatResponse, 
  ResponseType,
  CustomLocation, 
  ContactInfo, 
  Schedule 
} from './models';
import { ChatRequest } from './models/ChatRequest.model';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private readonly CURRENT_DATETIME = '2025-04-15 22:51:14';
  private readonly CURRENT_USER = 'zeinebcherif';
  private readonly API_URL = 'http://localhost:8084/api/chatbot/ask';
  
  private localResponses = {
    locations: {
      main: {
        address: "123 Avenue des Assurances",
        city: "Paris",
        postalCode: "75008",
        country: "France",
        coordinates: {
          lat: 48.8716,
          lng: 2.3015
        },
        directions: "Métro ligne 1, station Charles de Gaulle-Étoile"
      }
    },
    contact: {
      phone: "01 23 45 67 89",
      email: "contact@assurance.fr",
      fax: "01 23 45 67 90",
      socialMedia: {
        facebook: "https://facebook.com/assurance",
        twitter: "https://twitter.com/assurance",
        linkedin: "https://linkedin.com/company/assurance"
      }
    },
    schedule: {
      weekdays: {
        open: "09:00",
        close: "18:00"
      },
      weekend: {
        open: "10:00",
        close: "16:00"
      },
      holidays: ["01/01", "01/05", "25/12"]
    }
  };

  constructor(private http: HttpClient) {}

  sendMessage(message: string, userId: string): Observable<ChatResponse> {
    const request: ChatRequest = {
      message: message.toLowerCase(),
      userId: userId,
      timestamp: this.CURRENT_DATETIME
    };

    const localResponse = this.checkLocalResponse(request.message);
    if (localResponse) {
      return of(localResponse);
    }

    return this.http.post<ChatResponse>(
      this.API_URL, 
      request, 
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    );
  }

  private checkLocalResponse(message: string): ChatResponse | null {
    if (this.isLocationQuery(message)) {
      return {
        message: 'Voici notre adresse principale :',
        timestamp: this.CURRENT_DATETIME,
        type: ResponseType.LOCATION,
        data: {
          location: this.localResponses.locations.main
        }
      };
    }

    if (this.isContactQuery(message)) {
      return {
        message: 'Voici nos coordonnées :',
        timestamp: this.CURRENT_DATETIME,
        type: ResponseType.CONTACT,
        data: {
          contact: this.localResponses.contact
        }
      };
    }

    if (this.isScheduleQuery(message)) {
      return {
        message: 'Voici nos horaires d\'ouverture :',
        timestamp: this.CURRENT_DATETIME,
        type: ResponseType.SCHEDULE,
        data: {
          schedule: this.localResponses.schedule
        }
      };
    }

    if (this.isInsuranceQuery(message)) {
      return {
        message: this.getInsuranceResponse(message),
        timestamp: this.CURRENT_DATETIME,
        type: ResponseType.TEXT,
        data: undefined
      };
    }

    return null;
  }

  // Méthodes de vérification des requêtes
  private isLocationQuery(message: string): boolean {
    const locationKeywords = [
      'où', 'adresse', 'localisation', 'situé', 'trouve',
      'emplacement', 'localiser', 'lieu', 'bureau'
    ];
    return this.containsAnyKeyword(message, locationKeywords);
  }

  private isContactQuery(message: string): boolean {
    const contactKeywords = [
      'contact', 'téléphone', 'email', 'appeler', 'joindre',
      'numéro', 'mail', 'fax', 'facebook', 'twitter', 'linkedin',
      'réseaux sociaux', 'contacter'
    ];
    return this.containsAnyKeyword(message, contactKeywords);
  }

  private isScheduleQuery(message: string): boolean {
    const scheduleKeywords = [
      'horaire', 'ouvert', 'fermé', 'heure', 'quand',
      'jour', 'semaine', 'weekend', 'férié', 'disponible'
    ];
    return this.containsAnyKeyword(message, scheduleKeywords);
  }

  private isInsuranceQuery(message: string): boolean {
    const insuranceKeywords = [
      'assurance', 'garantie', 'couverture', 'contrat', 'devis',
      'auto', 'voiture', 'habitation', 'maison', 'santé',
      'vie', 'décès', 'accident', 'sinistre', 'remboursement'
    ];
    return this.containsAnyKeyword(message, insuranceKeywords);
  }

  private containsAnyKeyword(message: string, keywords: string[]): boolean {
    return keywords.some(keyword => message.includes(keyword));
  }

  private getInsuranceResponse(message: string): string {
    if (message.includes('auto') || message.includes('voiture')) {
      return 'Notre assurance auto propose plusieurs formules :\n' +
        '- Formule au tiers\n' +
        '- Formule intermédiaire\n' +
        '- Formule tous risques\n' +
        'Quelle formule vous intéresse ?';
    }
    
    if (message.includes('habitation') || message.includes('maison')) {
      return 'Notre assurance habitation couvre :\n' +
        '- Dégâts des eaux\n' +
        '- Incendie\n' +
        '- Vol\n' +
        '- Catastrophes naturelles\n' +
        'Souhaitez-vous un devis personnalisé ?';
    }
    
    if (message.includes('santé')) {
      return 'Notre assurance santé s\'adapte à vos besoins :\n' +
        '- Remboursements optimisés\n' +
        '- Couverture hospitalisation\n' +
        '- Médecine douce\n' +
        'Que souhaitez-vous savoir de plus ?';
    }
    
    if (message.includes('vie')) {
      return 'L\'assurance vie est un excellent moyen d\'épargner et de protéger vos proches.\n' +
        'Nous proposons des contrats adaptés à vos besoins avec des rendements attractifs.';
    }
    
    return 'Nous proposons plusieurs types d\'assurances :\n' +
      '- Assurance auto\n' +
      '- Assurance habitation\n' +
      '- Assurance santé\n' +
      '- Assurance vie\n' +
      'Quelle assurance vous intéresse ?';
  }
}