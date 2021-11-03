import type { NextPage } from 'next';
import { BaseSyntheticEvent } from 'react';

const Downloader: NextPage = () => {
    const onSubmit = async (event: BaseSyntheticEvent) => {
        // Disable redirect
        event.preventDefault();

        const response = await fetch('api/marketData', {
            method: 'POST',
            body: JSON.stringify({
                symbol: event.target.symbol.value,
                from: event.target.from.value,
                to: event.target.to.value,
                resolution: event.target.resolution.value
            })
        });
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <label htmlFor="symbol">Symbol</label>
                <input type="text" id="symbol" defaultValue="BTCUSDT" required />
                <label htmlFor="from">From</label>
                <input type="date" id="from" required />
                <label htmlFor="to">To</label>
                <input type="date" id="to" required />
                <label htmlFor="resolution">Resolution</label>
                <input type="text" id="resolution" defaultValue="1d" />
                <input type="submit" value="Download" />
            </form>
        </div>
    );
}

export default Downloader;
