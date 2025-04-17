import { InsuranceProType } from "./InsuranceProType";

export enum InsuranceStatus {
  EN_ATTENTE = 'EN_ATTENTE',
  EN_COURS_DE_TRAITEMENT = 'EN_COURS_DE_TRAITEMENT',
  REFUSEE = 'REFUSEE',
  REDEMANDEE = 'REDEMANDEE',
}
export interface InsurancePro {
  id?: number;
  proName: string;
  description: string;
  premiumAmount: number;
  insuranceProType: InsuranceProType;
  status: InsuranceStatus;
  fichier: File | null;
}