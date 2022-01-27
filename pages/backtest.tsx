import type { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from 'next';
import { BaseSyntheticEvent, useState } from 'react';

import NavBar from '../components/navbar';
import CandlestickChart from '../components/candlestickChart';

import Database from '../app/database/Database';
import Table from '../app/database/Table';
import { Candlestick } from '../app/binance/data/candlestick';

import styles from '../styles/backtest.module.css';
import { getFileNames, removeStartsWithUnderscore, getStrategies } from '../app/resources/files';

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

    const runStrat = async (event: BaseSyntheticEvent) => {
        const obj = JSON.parse(event.target.value)

        const response = await fetch('api/strategies/run', {
            method: 'POST',
            body: JSON.stringify(obj)
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
                    </tr>
                    {tables.map((name: string) => {
                        const parsed = Table.parseTableName(name);
                        return (
                            <tr id={name} key={name}>
                                <td>{parsed.symbol}</td>
                                <td>{parsed.resolution}</td>
                                <td>{parsed.from}</td>
                                <td>{parsed.to}</td>
                                <td>
                                    <button value={name} onClick={dropTable} className={styles.deleteButton}>🗑 Delete</button>
                                </td>
                                <td>
                                    <button value={name} onClick={updateChart} className={styles.chartButton}>📈</button>
                                </td>
                            </tr>
                        );
                    })
                    }
                </table>
                <table className={styles.table}>
                    <tr>
                        <th>Title</th>
                        <th>Action</th>
                    </tr>
                    {strategies.map((strat: any) => {
                        return (
                            <tr id={strat.title} key={strat.title}>
                                <td>{strat.title}</td>
                                <td>
                                    <button value={JSON.stringify(strat)} onClick={runStrat}>Run</button>
                                </td>
                            </tr>
                        )
                    })}
                </table>
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
