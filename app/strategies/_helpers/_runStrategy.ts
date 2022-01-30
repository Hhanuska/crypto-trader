import { Candlestick } from '../../binance/data/candlestick';
import DataScheduler from './DataScheduler';
import PositionHandler from './PositionHandler';
import { RunStrategy, OnCandleResult } from './_strategyTemplate';

export default async function runStrategy(strat: RunStrategy) {
    const func = await import(`/app/strategies/${strat.dir}/${strat.entry}`);
    const scheduler = new DataScheduler(strat.data);
    const positionHandler = new PositionHandler('backtest');

    if (func.init) {
        func.init(strat.options);
    }

    while (!scheduler.isFinished()) {
        const candles = await scheduler.getNext();

        while (candles.length !== 0) {
            // Always defined because while condition => we can safely use "as Candlestick"
            const candle = candles.shift() as Candlestick;

            positionHandler.updateCurrentPrice(candle.close);

            const actions = func.default(candle, positionHandler.getBalance(), positionHandler.getOpenPositions()) as OnCandleResult[];

            actions.forEach((action) => {
                positionHandler.action(action);
            });
        }
    }

    positionHandler.closeAllPositions();

    console.log(positionHandler.getBalance());
    console.log(positionHandler.getHistory());
}
