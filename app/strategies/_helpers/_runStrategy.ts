import { Candlestick } from '../../binance/data/candlestick';
import DataScheduler from './DataScheduler';
import PositionHandler from './PositionHandler';
import { RunStrategy, AbstractStrategy } from './_strategyTemplate';

export default async function runStrategy(strat: RunStrategy) {
    const imp = await import(`/app/strategies/${strat.dir}/${strat.entry}`);
    const strategy = new imp.default() as AbstractStrategy;
    const scheduler = new DataScheduler(strat.data);
    const positionHandler = new PositionHandler('backtest');

    strategy.init(strat.options);

    while (!scheduler.isFinished()) {
        const candles = await scheduler.getNext();

        while (candles.length !== 0) {
            // Always defined because while condition => we can safely use "as Candlestick"
            const candle = candles.shift() as Candlestick;

            positionHandler.updateCurrentPrice(candle.close);

            const response = strategy.onCandle(candle, positionHandler.getBalance(), positionHandler.getOpenPositions());
            const actions = Array.isArray(response) ? response : [response];

            actions.forEach((action) => {
                positionHandler.action(action);
            });
        }
    }

    positionHandler.closeAllPositions();

    console.log(positionHandler.getBalance());
    console.log(positionHandler.getHistory());
}
