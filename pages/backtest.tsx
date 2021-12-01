import type { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from 'next';
import { BaseSyntheticEvent, useState } from 'react';

import NavBar from '../components/navbar';
import CandlestickChart from '../components/candlestickChart';

import Database from '../app/database/Database';
import Table from '../app/database/Table';
import { Candlestick } from '../app/binance/data/candlestick';

import styles from '../styles/backtest.module.css';

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    const tables = (await Database.instance.getTables()).map((t) => t.name);

    return {
        props: {
            tables: tables
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

const BacktestPage: NextPage = ({ tables }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
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

    return (
        <div>
            <NavBar />
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
