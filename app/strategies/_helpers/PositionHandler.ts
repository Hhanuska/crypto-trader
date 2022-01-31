import Simulation from '../../simulation/Simulation';
import { ActionType, OnCandleResult } from './_strategyTemplate';

type Modes = 'backtest' | 'live';

export default class PositionHandler {

    private mode: Modes;

    private simulation: Simulation | undefined;

    private currentPrice: number = 0;

    constructor(mode: Modes, balance: number = 1000) {
        this.mode = mode;

        if (mode === 'backtest') {
            this.simulation = new Simulation(balance);
        }
    }

    public getMode() {
        return this.mode;
    }

    public getBalance(): number {
        if (this.mode === 'backtest') {
            return (this.simulation as Simulation).getBalance();
        } else {
            // Live Trading (TODO)
            return 0;
        }
    }

    public getOpenPositions() {
        if (this.mode === 'backtest') {
            return (this.simulation as Simulation).getOpenPositions();
        } else {
            // Live Trading (TODO)
            return {};
        }
    }

    public action(candleResult: OnCandleResult) {
        const action = this.onCandleResultToAction(candleResult);

        if (this.mode === 'backtest') {
            if (action.action === 'close') {
                (this.simulation as Simulation).closePosition(action.id, this.currentPrice);
            }

            if (action.action === 'long' || action.action === 'short') {
                (this.simulation as Simulation).openPosition(action.action, action.value, this.currentPrice);
            }
        } else {
            // Live Trading (TODO)
        }
    }

    public checkProfitIfClosed(id: string): number {
        if (this.mode === 'backtest') {
            return (this.simulation as Simulation).checkProfitIfClosed(id, this.currentPrice);
        } else {
            // Live Trading (TODO)
            return 0;
        }
    }

    private onCandleResultToAction(r: OnCandleResult): ActionType {
        const balance = this.mode === 'backtest' ? (this.simulation as Simulation).getBalance() : 0;

        if (r.action === 'close') {
            return r;
        } else {
            const toUse = r.type === 'absolute' ? r.value : balance * r.value;

            return {
                action: r.action,
                value: toUse
            }
        }
    }

    public closeAllPositions() {
        if (this.mode === 'backtest') {
            const positions = (this.simulation as Simulation).getOpenPositions();

            for (const id in positions) {
                this.action({ action: 'close', id: id });
            }
        } else {
            // Live Trading (TODO)
        }
    }

    public updateCurrentPrice(price: number) {
        this.currentPrice = price;
    }

    public getHistory() {
        if (this.mode === 'backtest') {
            return (this.simulation as Simulation).getHistory();
        } else {
            // Live Trading (TODO)
            return [];
        }
    }
}
