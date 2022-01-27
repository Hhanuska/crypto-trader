import { Strategy } from './_strategyTemplate';

export default async function runStrategy(strat: Strategy) {
    const func = await import(`/app/strategies/${strat.dir}/${strat.entry}`);
    func.default();
}
