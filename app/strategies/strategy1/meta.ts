import { Meta } from '../_strategyTemplate';

const meta: Meta = {
    title: 'Strategy #1',
    description: 'Trading strategy utilizing x and y indicators',
    options: {
        option1: '1',
        option2: '2'
    },
    entry: 'strategy'
}

export function getMeta(): Meta {
    return meta;
}
