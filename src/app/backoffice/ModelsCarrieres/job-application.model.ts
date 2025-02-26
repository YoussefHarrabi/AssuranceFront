
import { JobOffer } from './job-offer.model';

export class JobApplication {
  id!: number;
  //user: User; // Relation avec l'entité utilisateur
  jobOffer!: JobOffer; // NULL = candidature spontanée
  statut!: string;
  dateCandidature!: Date;
  cvPath!: string;
  lettreMotivationPath!: string;
  email!: string;
}