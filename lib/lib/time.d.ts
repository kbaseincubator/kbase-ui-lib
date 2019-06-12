export interface NiceRelativeTimeOptions {
    absoluteAfter?: number;
    compact?: boolean;
    now?: Date;
    precision?: number;
}
export declare function niceRelativeTime(someDate: Date, options?: NiceRelativeTimeOptions): string;
declare type Format = 'full' | 'short' | 'compact';
interface NiceDurationOptions {
    precision?: number;
    format?: Format;
}
export declare function niceDuration(value: number, options?: NiceDurationOptions): string;
export {};
