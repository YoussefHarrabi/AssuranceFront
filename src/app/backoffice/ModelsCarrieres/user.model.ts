import { IdentityType } from './identity-type.enum';
import { JobApplication } from './job-application.model';
import { Role } from './role.enum';


export class User {
  id!: number;
  firstName!: string;
  lastName!: string;
  email!: string;
  birthday!: string; // Format ISO : "YYYY-MM-DD"
  identityType!: IdentityType;
  numberOfIdentity!: string;
  phoneNumber!: string;
  address!: string; // Optionnel
  password! :string;
  roles!: Role[]; // Plusieurs rôles possibles
  createdAt!: string; // Format ISO
  updatedAt!: string; // Optionnel
  jobApplications!: JobApplication[]; // Liste des candidatures associées
}
