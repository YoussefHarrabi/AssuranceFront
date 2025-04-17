import { Role } from "../Enums/Role.enum";
import { IdentityType } from "../Enums/IdentityType.enum";
export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  birthday: string;  // Will be converted to/from LocalDate in backend
  identityType: IdentityType;
  numberOfIdentity: string;
  phoneNumber: string;
  address?: string;
  password?: string;  // Optional in responses, required in creation
  roles: Set<Role>;
  createdAt?: string;  // Will be converted to/from LocalDate in backend
  updatedAt?: string;  // Will be converted to/from LocalDate in backend
  factures?: any[];    // Optional: only if you need to access factures
}
