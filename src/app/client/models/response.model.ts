import { Complaint } from "./complaint.model";
import { User } from "./user.model";

export class Response {
    id!: number;
    content!: string;
    date!: Date; // Use Date for better date handling
    complaint!: Complaint;
    advisor!: User;
}