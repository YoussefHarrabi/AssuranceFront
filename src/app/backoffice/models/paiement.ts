import { MethodePaiement } from "../Enums/MethodePaiement.enum";

export interface Paiement {
  id?: number;
  datePaiement: string;
  montantPaiement: number;
  methodePaiement: MethodePaiement;
  facture: any;
}
