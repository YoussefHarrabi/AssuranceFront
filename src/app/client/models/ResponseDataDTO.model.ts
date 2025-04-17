import { ContactInfo } from "./contact-info.model";
import { Link } from "./link.model";
import { CustomLocation } from "./location.model";
import { Schedule } from "./schedule.model";

export interface ResponseDataDTO {
    location?: CustomLocation;
    contact?: ContactInfo;
    schedule?: Schedule;
    links?: Link[];
    content?: any;
    metadata?: string;
}