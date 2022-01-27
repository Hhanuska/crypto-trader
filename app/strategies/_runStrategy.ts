import { RunStrategy } from './_strategyTemplate';

export default async function runStrategy(strat: RunStrategy) {
    const func = await import(`/app/strategies/${strat.dir}/${strat.entry}`);
    func.default(strat.data);
}
