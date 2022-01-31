import { Candlestick } from '../../binance/data/candlestick';
import DataScheduler from './DataScheduler';
import PositionHandler from './PositionHandler';
import { RunStrategy, AbstractStrategy } from './_strategyTemplate';

export default async function runStrategy(strat: RunStrategy, startBalance?: number) {
    const imp = await import(`/app/strategies/${strat.dir}/${strat.entry}`);

    const strategy = new imp.default() as AbstractStrategy;

    const scheduler = new DataScheduler(strat.data);

    startBalance = startBalance ? startBalance : 1000;
    const positionHandler = new PositionHandler('backtest', startBalance);

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

    // positionHandler.closeAllPositions();

    let unrealized = 0;
    for (const id in positionHandler.getOpenPositions()) {
        unrealized += positionHandler.checkProfitIfClosed(id);
    }

    console.log(`
        Backtest started with $${startBalance}.
        Finished with $${positionHandler.getBalance()}
        Unrealized:
            ${Object.keys(positionHandler.getOpenPositions()).length} positions(s) still open.
            If closed: $${unrealized}
    `);

    return {
        balance: positionHandler.getBalance(),
        positions: positionHandler.getOpenPositions(),
        history: positionHandler.getHistory()
    }
}
