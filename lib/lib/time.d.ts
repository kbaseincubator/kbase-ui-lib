declare type Format = 'full' | 'short' | 'compact';
export interface NiceRelativeTimeOptions {
    absoluteAfter?: number;
    format?: Format;
    now?: Date;
    precision?: number;
}
export declare function niceRelativeTime(someDate: Date, options?: NiceRelativeTimeOptions): string;
interface NiceDurationOptions {
    precision?: number;
    format?: Format;
}
export declare function niceDuration(value: number, options?: NiceDurationOptions): string;
export {};
