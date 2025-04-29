import { TypeAssuranceParticular } from '../../backoffice/models/type-assurance-particular.modelV';

export enum StatusDemande {
  EN_ATTENTE = 'EN_ATTENTE',
  ACCEPTEE = 'ACCEPTEE',
  REFUSEE = 'REFUSEE'
}

export class AssuranceParticular {
  id?: number;
  nomAssurance!: string;
  description!: string;
  prix!: number;
  typeAssurance!: TypeAssuranceParticular;
  status?: StatusDemande; // ✅ Ajout du champ 'status'
}
