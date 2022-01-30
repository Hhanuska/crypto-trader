import { Meta } from '../_helpers/_strategyTemplate';

export interface Options {
    smaShort: number;
    smaLong: number;
}

const meta: Meta = {
    title: 'SMA Crossover',
    description: 'Trading strategy utilizing SMA crossovers',
    options: {
        smaShort: 12,
        smaLong: 50
    },
    entry: 'strategy'
}

export function getMeta(): Meta {
    return meta;
}
