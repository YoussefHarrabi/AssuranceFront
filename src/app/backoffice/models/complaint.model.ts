import { ComplaintStatus } from './complaint-status.enum';
import { ComplaintType } from './complaint-type.enum';
import { Review } from './review.model';
import { User } from './user.model';
import { Response } from './response.model';

export class Complaint {
    id!: number;
    title!: string;
    description!: string;
    status!: ComplaintStatus;
    creationDate!: Date;
    lastModifiedDate!: Date;
    type!: ComplaintType;
    client!: User;
    response!: Response;
    review!: Review;
}