export interface Candlestick {
    openTime: number;
    closeTime: number;
    open: number;
    close: number;
    high: number;
    low: number;
    volume: number;
    quoteAV: number;    // Quote asset volume
    trades: number;     // Number of trades
    buyBaseAV: number;  // Taker buy base asset volume
    buyQuoteAV: number; // Take buy quote asset volume
}

export function arrayToCandlestick(arr: Array<number | string>): Candlestick {
    return {
        openTime: arr[0] as number,
        closeTime: arr[6] as number,
        open: Number(arr[1]),
        close: Number(arr[4]),
        high: Number(arr[2]),
        low: Number(arr[3]),
        volume: Number(arr[5]),
        quoteAV: Number(arr[7]),
        trades: arr[8] as number,
        buyBaseAV: Number(arr[9]),
        buyQuoteAV: Number(arr[10])
    };
}
