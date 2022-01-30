import { Candlestick } from '../../binance/data/candlestick';
import { Positions } from '../../simulation/Simulation';

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

export abstract class AbstractStrategy {
    /**
     * Initialize strategy
     * Gets called once at the start
     * @param options 
     */
    public abstract init(options: any): void;

    /**
     * Gets called on every candle
     * Returns an action or an array of actions
     * @param candle 
     * @param availableBalance 
     * @param openPositions 
     * @returns action or array of actions
     */
    public abstract onCandle(candle: Candlestick, availableBalance: number, openPositions: Positions): OnCandleResult | OnCandleResult[];
}
