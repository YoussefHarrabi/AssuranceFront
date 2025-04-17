import { ResponseType } from './response-type.enum';
import { ContactInfo } from "./contact-info.model";
import { Link } from "./link.model";
import { CustomLocation } from "./location.model";
import { Schedule } from "./schedule.model";

export interface ChatResponse {
    message: string;
    timestamp: string;
    type: ResponseType;
    data?: {
        location?: CustomLocation;
        contact?: ContactInfo;
        schedule?: Schedule;
        links?: Link[];
    };
}