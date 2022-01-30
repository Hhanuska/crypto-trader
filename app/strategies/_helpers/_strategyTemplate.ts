export interface Meta {
    title: string;
    description: string;
    options: Object;
    entry: string;
}

export interface Strategy extends Meta {
    dir: string;
}

export interface RunStrategy extends Strategy {
    data: string;   // name of dataset
}

export type ActionType = OpenPosition | ClosePosition;

export type OnCandleResult = ClosePosition | OpenPositionType;

interface OpenPositionType {
    action: 'long' | 'short';
    type: 'percent' | 'absolute';
    value: number;
}

interface OpenPosition {
    action: 'long' | 'short';
    value: number;
}

interface ClosePosition {
    action: 'close';
    id: string;
}

interface NullPosition {
    action: null;
}
