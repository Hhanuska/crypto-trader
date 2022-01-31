export type direction = 'long' | 'short';

export default class Position {

    private direction: direction;

    private openValue: number;

    private closeValue: number | null = null;

    private openPrice: number;

    private closePrice: number | null = null;

    private isClosed: boolean = false;

    private id: string;

    constructor(direction: direction, value: number, price: number) {
        this.direction = direction;
        this.openValue = value;
        this.openPrice = price;
        this.id = this.createId();
    }

    // TODO: Calculate fees
    public close(price: number): number {
        if (this.isClosed) {
            throw new Error('Position already closed');
        }

        this.isClosed = true;

        let close = null;

        if (this.direction === 'long') {
            close = this.closeLong(price);
        } else {
            close = this.closeShort(price);
        }

        this.closeValue = close;
        this.closePrice = price;
        return close;
    }

    public checkProfitIfClosed(price: number): number {
        let close = null;

        if (this.direction === 'long') {
            close = this.closeLong(price);
        } else {
            close = this.closeShort(price);
        }

        return close;
    }

    private closeLong(price: number): number {
        return this.openValue * (price / this.openPrice);
    }

    private closeShort(price: number): number {
        const percentGain = (price / this.openPrice - 1) * -1;

        return this.openValue + this.openValue * percentGain;
    }

    private createId(): string {
        return `${this.direction}_${this.openValue}_${this.openPrice}`;
    }

    public getId(): string {
        return this.id;
    }

    public getOpen(): number {
        return this.openValue;
    }

    public getDirection(): direction {
        return this.direction;
    }
}
