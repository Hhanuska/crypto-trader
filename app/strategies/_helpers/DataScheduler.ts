import { Candlestick } from '../../binance/data/candlestick';
import Database from '../../database/Database';

export default class DataScheduler {

    private table: string;

    private limit: number;

    public lastCandleCloseTime: number = 0;

    private finished: boolean = false;

    constructor(table: string, limit: number = 50) {
        this.table = table;
        this.limit = limit;
    }

    public async getNext(): Promise<Candlestick[]> {
        const candles: Candlestick[] = await Database.instance.getCandlesPaginated(this.table, this.limit, this.lastCandleCloseTime);

        if (candles.length < this.limit) {
            this.finished = true;
        } else {
            this.lastCandleCloseTime = candles[candles.length - 1].closeTime;
        }

        return candles;
    }

    public restart(): void {
        this.lastCandleCloseTime = 0;
        this.finished = false;
    }

    public isFinished(): boolean {
        return this.finished;
    }
}
