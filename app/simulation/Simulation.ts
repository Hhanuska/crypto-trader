import Position, { direction } from './Position';

export interface Positions {
    [id: string]: Position;
}

export default class Simulation {

    private balance: number;

    private positions: Positions = {};

    private history: Position[] = [];

    constructor(balance: number) {
        this.balance = balance;
    }

    public getBalance(): number {
        return this.balance;
    }

    public getAllocated(): number {
        let sum = 0;

        for (const id in this.positions) {
            sum += this.positions[id].getOpen();
        }

        return sum;
    }

    public getOpenPositions(): Positions {
        return this.positions;
    }

    public getHistory(): Position[] {
        return this.history;
    }

    public openPosition(direction: direction, value: number, price: number): string {
        if (value > this.balance) {
            throw new Error(`Insufficient balance: ${value}. Available balance: ${this.balance}`);
        }

        this.balance -= value;
        const position = new Position(direction, value, price);

        return this.addPosition(position);
    }

    public closePosition(id: string, price: number) {
        if (!this.positions[id]) {
            throw new Error('This position doesn\'t exist: ' + id);
        }

        this.balance += this.positions[id].close(price);
        
        this.history.push(this.positions[id]);
        delete this.positions[id];
    }

    private createId(position: Position) {
        let counter = 0;

        while (this.positions[`${position.getId()}_${++counter}`]);

        return `${position.getId()}_${counter}`;
    }

    private addPosition(position: Position): string {
        const id = this.createId(position);

        this.positions[id] = position;

        return id;
    }
}
