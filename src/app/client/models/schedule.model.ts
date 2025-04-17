export interface Schedule {
    weekdays: {
        open: string;
        close: string;
    };
    weekend?: {
        open: string;
        close: string;
    };
    holidays?: string[];
}