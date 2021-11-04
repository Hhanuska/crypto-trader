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
                <select name="resolution" id="resolution">
                    <optgroup label="Minutes">
                        <option value="1m">1m</option>
                        <option value="3m">3m</option>
                        <option value="5m">5m</option>
                        <option value="15m">15m</option>
                        <option value="30m">30m</option>
                    </optgroup>
                    <optgroup label="Hours">
                        <option value="1h">1h</option>
                        <option value="2h">2h</option>
                        <option value="4h">4h</option>
                        <option value="6h">6h</option>
                        <option value="8h">8h</option>
                        <option value="12h">12h</option>
                    </optgroup>
                    <optgroup label="Days">
                        <option value="1d" selected={true}>1d</option>
                        <option value="3d">3d</option>
                    </optgroup>
                    <optgroup label="Weeks">
                        <option value="1w">1w</option>
                    </optgroup>
                    <optgroup label="Months">
                        <option value="1M">1M</option>
                    </optgroup>
                </select>
                
                <input type="submit" value="Download" />
            </form>
        </div>
    );
}

export default Downloader;
