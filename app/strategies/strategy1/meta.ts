import { Meta } from '../_helpers/_strategyTemplate';

export interface Options {
    emaShort: number;
    emaLong: number;
}

const meta: Meta = {
    title: 'SMA Crossover',
    description: 'Trading strategy utilizing SMA crossovers',
    options: {
        warmUp: 14,
        emaShort: 12,
        emaLong: 50
    },
    entry: 'strategy'
}

export function getMeta(): Meta {
    return meta;
}
