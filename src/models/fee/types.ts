export interface Fees {
    economyFee: number;
    fastestFee: number;
    halfHourFee: number;
    hourFee: number;
    minimumFee: number;
}

export enum FeeLevel {
    SLOW = "hourFee",
    MEDIUM = "halfHourFee",
    FAST = "fastestFee"
}

export interface FeeNotificationBorder {
    feeBorder: number | null;
    feeLevel: FeeLevel;
}
