import type { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from 'next';
import { BaseSyntheticEvent, useState } from 'react';

import NavBar from '../components/navbar';
import CandlestickChart from '../components/candlestickChart';

import styles from '../styles/backtest.module.css';

import Database from '../app/database/Database';
import Table from '../app/database/Table';
import { Candlestick } from '../app/binance/data/candlestick';
import { getStrategies } from '../app/resources/files';
import { Strategy } from '../app/strategies/_helpers/_strategyTemplate';

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    const tables = (await Database.instance.getTables()).map((t) => t.name);
    const strategies = await getStrategies();

    return {
        props: {
            tables: tables,
            strategies: strategies
        }
    }
}

const dropTable = async (event: BaseSyntheticEvent) => {
    event.preventDefault();

    console.log(event.target.value);

    const response = await fetch('/api/dropTable', {
        method: 'POST',
        body: JSON.stringify({
            table: event.target.value
        })
    });

    const element = document.getElementById(event.target.value);
    element?.parentNode?.removeChild(element);
}

const BacktestPage: NextPage = ({ tables, strategies }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const [candlestickData, setCandlestickData] = useState({ data: [], title: '' });
    const [selectedDataset, setSelectedDataset] = useState(null);
    const [selectedStrategy, setSelectedStrategy] = useState(null);
    const textAreaDefault = 'Select a strategy'
    const [textAreaValue, setTextAreaValue] = useState(textAreaDefault);

    const updateChart = async (event: BaseSyntheticEvent) => {
        const res = await fetch('/api/getCandles?' + new URLSearchParams({ table: event.target.value }));
        const candles = await res.json();

        if (candles.success) {
            setCandlestickData({
                data: candles.candles.map((candle: Candlestick) => {
                    return {
                        x: (candle.closeTime),
                        y: [candle.open, candle.high, candle.low, candle.close]
                    }
                }),
                title: event.target.value.split('_')[0]
            })
        }
    }

    const selectDataset = (event: BaseSyntheticEvent) => {
        if (selectedDataset === event.target.value) {
            setSelectedDataset(null);
        } else {
            setSelectedDataset(event.target.value);
        }
    }

    const selectStrategy = (event: BaseSyntheticEvent) => {
        if (selectedStrategy === event.target.value) {
            setSelectedStrategy(null);
            setTextAreaValue(textAreaDefault);
        } else {
            setSelectedStrategy(event.target.value);
            setOptionsInputValue(event.target.value);
        }
    }

    const handleTextAreaChange = (event: BaseSyntheticEvent) => {
        setTextAreaValue(event.target.value);
    }

    const setOptionsInputValue = (dir: string) => {
        const strat = getStratFromDir(dir);

        if (!strat) {
            throw new Error('Invalid strategy');
        }

        setTextAreaValue(JSON.stringify(strat.options, null, 2));
    }

    const getStratFromDir = (dir: string): Strategy | undefined => {
        return (strategies as Strategy[]).find((strat: Strategy) => strat.dir === dir);
    }

    const runStrat = async (event: BaseSyntheticEvent) => {
        if (!selectedDataset || !selectedStrategy) {
            return;
        }

        // Use spread operator to make a new object instead of a reference
        // This way the default options for the strategy will be unchanged
        const obj = {...getStratFromDir(selectedStrategy)};

        if (!obj) {
            throw new Error('Invalid strategy');
        }

        try {
            const options = JSON.parse(textAreaValue);
            obj.options = options;
        } catch (err) {
            console.log('Invalid options. Make sure it\'s valid JSON.');
        }

        const response = await fetch('api/strategies/run', {
            method: 'POST',
            body: JSON.stringify({
                ...obj,
                data: selectedDataset
            })
        });
    }

    return (
        <div>
            <NavBar />
            <div className={styles.selector}>
                <table className={styles.table}>
                    <tr>
                        <th>Symbol</th>
                        <th>Resolution</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Action</th>
                        <th>Chart</th>
                        <th>Select</th>
                    </tr>
                    {tables.map((name: string) => {
                        const parsed = Table.parseTableName(name);
                        return (
                            <tr id={name} key={name} className={selectedDataset === name ? styles.selected : ''}>
                                <td>{parsed.symbol}</td>
                                <td>{parsed.resolution}</td>
                                <td>{parsed.from}</td>
                                <td>{parsed.to}</td>
                                <td>
                                    <button value={name} onClick={dropTable} className={styles.deleteButton}>🗑 Delete</button>
                                </td>
                                <td>
                                    <button value={name} onClick={updateChart}>📈</button>
                                </td>
                                <td>
                                    <button value={name} onClick={selectDataset}>Select</button>
                                </td>
                            </tr>
                        );
                    })
                    }
                </table>
                <table className={styles.table}>
                    <tr>
                        <th>Title</th>
                        <th>Select</th>
                    </tr>
                    {strategies.map((strat: Strategy) => {
                        return (
                            <tr id={strat.dir} key={strat.dir} className={selectedStrategy === strat.dir ? styles.selected : ''}>
                                <td title={strat.description}>{strat.title}</td>
                                <td>
                                    <button value={strat.dir} onClick={selectStrategy}>Select</button>
                                </td>
                            </tr>
                        )
                    })}
                </table>
                <textarea value={textAreaValue} onChange={handleTextAreaChange} rows={12} cols={40} />
                <button onClick={runStrat}>Run Backtest</button>
            </div>
            <div className={styles.chart}>
                <CandlestickChart
                    data={candlestickData.data}
                    title={candlestickData.title}
                />
            </div>
        </div>
    );
}

export default BacktestPage;
