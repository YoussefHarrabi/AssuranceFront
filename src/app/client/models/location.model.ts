export interface CustomLocation {
    address: string;
    city: string;
    postalCode: string;
    country: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
    directions?: string;
}