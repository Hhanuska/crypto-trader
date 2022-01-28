import DataScheduler from './DataScheduler';
import { RunStrategy } from './_strategyTemplate';

export default async function runStrategy(strat: RunStrategy) {
    const func = await import(`/app/strategies/${strat.dir}/${strat.entry}`);
    const scheduler = new DataScheduler(strat.data);

    if (func.init) {
        func.init(strat.options);
    }

    while (!scheduler.isFinished()) {
        const candles = await scheduler.getNext();

        while (candles.length !== 0) {
            const action = func.default(candles.shift())
            if (action) {
                console.log(action);
            }
        }
    }
}
