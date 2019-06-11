export interface niceElapsedOptions {
    absoluteAfter?: number;
    compactDate?: boolean;
    now?: Date;
    precision?: number;
}
export declare function niceElapsed(someDate: Date, options?: niceElapsedOptions): string;
interface NiceDurationOptions {
    precision?: number;
}
export declare function niceDuration(value: number, options: NiceDurationOptions): string;
export {};
