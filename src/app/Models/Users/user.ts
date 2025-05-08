import { LoyaltyStatus } from "../Loyalty/loyalty-status.model";
import { IdentityType, Role } from "./enum";

export class User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  birthday: Date;
  identityType: IdentityType;
  numberOfIdentity: string;
  phoneNumber: string;
  address?: string;
  password: string;
  roles: Set<Role>;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Loyalty program fields
  loyaltyPoints?: number;
  loyaltyStatus?: LoyaltyStatus;

  [key: string]: any; // For dynamic properties

  constructor(data: Partial<User> = {}) {
    this.id = data.id;
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.email = data.email || '';
    this.birthday = data.birthday || new Date();
    this.identityType = data.identityType || IdentityType.PASSPORT;
    this.numberOfIdentity = data.numberOfIdentity || '';
    this.phoneNumber = data.phoneNumber || '';
    this.address = data.address;
    this.password = data.password || '';
    this.roles = data.roles || new Set<Role>();
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.loyaltyPoints = data.loyaltyPoints || 0;
    this.loyaltyStatus = data.loyaltyStatus;
  }
}