import { Complaint } from "./complaint.model";
import { Review } from "./review.model";
import { Role } from "./role.enum";

export class User {
    id!: number;
    firstName!: string;
    lastName!: string;
    email!: string;
    birthday!: Date;
   // identityType: IdentityType;
    numberOfIdentity!: string;
    phoneNumber!: string;
    address!: string;
    password!: string;
    roles!: Role[];
    createdAt!: Date;
    updatedAt!: Date;
    complaints!: Complaint[];
    responses!: Response[];
    reviews!: Review[];
}