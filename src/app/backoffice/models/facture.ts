import { FactureStatut } from './../Enums/FactureStatut.enum';
import { User } from './User';

export interface Facture {
  factureId: number;
  montant: number;
  dateEmission: string;
  factureStatut: FactureStatut; // Utilisation de l'enum FactureStatut
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}
