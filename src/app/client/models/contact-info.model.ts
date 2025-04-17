export interface ContactInfo {
    phone: string;
    email: string;
    fax?: string;
    socialMedia?: {
        facebook?: string;
        twitter?: string;
        linkedin?: string;
    };
}