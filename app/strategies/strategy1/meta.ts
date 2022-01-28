import { Meta } from '../_helpers/_strategyTemplate';

export interface Options {
    emaShort: number;
    emaLong: number;
}

const meta: Meta = {
    title: 'Strategy #1',
    description: 'Trading strategy utilizing x and y indicators',
    options: {
        warmUp: 14,
        ema1: 12,
        ema2: 50
    },
    entry: 'strategy'
}

export function getMeta(): Meta {
    return meta;
}
