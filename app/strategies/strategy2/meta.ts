import { Meta } from '../_helpers/_strategyTemplate';

const meta: Meta = {
    title: 'Strategy #2',
    description: 'Trading strategy utilizing z and w indicators',
    options: {
        option1: '3',
        option2: '4'
    },
    entry: 'strategy'
}

export function getMeta(): Meta {
    return meta;
}
