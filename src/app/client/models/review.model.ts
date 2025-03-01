import { Complaint } from "./complaint.model";
import { User } from "./user.model";

export class Review {
    id!: number;
    comment!: string;
    rating!: number;
    complaint!: Complaint;
    client!: User;
}