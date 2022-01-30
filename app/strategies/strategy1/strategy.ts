import { Candlestick } from '../../binance/data/candlestick';
import { Positions } from '../../simulation/Simulation';
import { AbstractStrategy, ActionType, OnCandleResult, Strategy } from '../_helpers/_strategyTemplate';
import { Options } from './meta';

let options: Options = {
    smaShort: 12,
    smaLong: 50
};

interface Storage {
    smaShort: Sma;
    smaLong: Sma;
}

interface Sma {
    values: number[];
    sum: number;
    length: number;
    current: number;
    last: number;
}

type SmaName = 'smaShort' | 'smaLong';

const storage: Storage = {
    smaShort: {
        values: [],
        sum: 0,
        length: 0,
        current: 0,
        last: 0
    },
    smaLong: {
        values: [],
        sum: 0,
        length: 0,
        current: 0,
        last: 0
    }
}

export default class SmaCrossover implements AbstractStrategy {

    private options: Options = {
        smaShort: 12,
        smaLong: 50
    };

    private smaShort: Sma = {
        values: [],
        sum: 0,
        length: 0,
        current: 0,
        last: 0
    }

    private smaLong: Sma = {
        values: [],
        sum: 0,
        length: 0,
        current: 0,
        last: 0
    }

    public init(options: Options): void {
        this.options = { ...this.options, ...options }

        this.smaShort.length = options.smaShort;
        this.smaLong.length = options.smaLong;
    }

    public onCandle(candle: Candlestick, availableBalance: number, openPositions: Positions): OnCandleResult[] {
        this.progressSma('smaShort', candle.close);
        this.progressSma('smaLong', candle.close);

        const actions: OnCandleResult[] = [];

        if (!this.isSmaReady('smaLong')) {
            return actions;
        }

        if (this.smaShort.last <= this.smaLong.last && this.smaShort.current > this.smaLong.current) {
            // Close short positions
            for (const id in openPositions) {
                if (openPositions[id].getDirection() === 'short') {
                    actions.push({ action: 'close', id: id });
                }
            }

            actions.push({ action: 'long', type: 'percent', value: 1 });
        }

        if (this.smaShort.last >= this.smaLong.last && this.smaShort.current < this.smaLong.current) {
            // Close long positions
            for (const id in openPositions) {
                if (openPositions[id].getDirection() === 'long') {
                    actions.push({ action: 'close', id: id });
                }
            }

            actions.push({ action: 'short', type: 'percent', value: 1 });
        }

        return actions;
    }

    private progressSma(sma: SmaName, value: number) {
        this[sma].sum += value;
        this[sma].values.push(value);

        if (this.smaSubtract(sma)) {
            this[sma].last = this[sma].current;
            this[sma].sum -= this[sma].values.shift() as number;
            this[sma].current = this[sma].sum / this[sma].length;
        }
    }

    private smaSubtract(sma: SmaName): boolean {
        return this[sma].values.length > this[sma].length;
    }

    private isSmaReady(sma: SmaName): boolean {
        return this[sma].values.length === this[sma].length;
    }
}
