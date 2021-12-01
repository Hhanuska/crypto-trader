import type { GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType, NextPage } from 'next';
import Head from 'next/head';
import { BaseSyntheticEvent, useState } from 'react';
import NavBar from '../components/navbar';

import { timeout } from '../app/resources/utils';
import EResolution from '../app/resources/EResolution';

import styles from '../styles/downloader.module.css'

export const getStaticProps: GetStaticProps = (context: GetStaticPropsContext) => {
    const resolutions = EResolution;

    return {
        props: {
            resolutions: resolutions
        }
    }
}

const DownloadPage: NextPage = ({ resolutions }: InferGetStaticPropsType<typeof getStaticProps>) => {
    const [downloadProgress, setDownloadProgress] = useState({ inProgress: false, required: 0, current: 0 });

    const onSubmit = async (event: BaseSyntheticEvent) => {
        // Disable redirect
        event.preventDefault();

        const response = await fetch('api/download/marketData', {
            method: 'POST',
            body: JSON.stringify({
                symbol: event.target.symbol.value,
                from: event.target.from.value,
                to: event.target.to.value,
                resolution: event.target.resolution.value
            })
        });
        const json = await response.json();
        setDownloadProgress({
            inProgress: json.success,
            required: downloadProgress.required,
            current: downloadProgress.current
        });

        updateProgress();
    }

    const updateProgress = async () => {
        const response = await fetch('/api/download/getProgress');
        const json = await response.json();

        setDownloadProgress({
            inProgress: json.inProgress,
            required: json.required,
            current: json.current
        });

        if (json.inProgress) {
            await timeout(500);
            updateProgress();
        }
    }

    return (
        <div>
            <Head>
                <title>Downloader</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <NavBar />
            <div className={styles.form}>
                <form className={styles.downloader} onSubmit={onSubmit}>
                    <label htmlFor="symbol">Symbol</label>
                    <input type="text" id="symbol" defaultValue="BTCUSDT" required />
                    <label htmlFor="from">From</label>
                    <input type="date" id="from" required />
                    <label htmlFor="to">To</label>
                    <input type="date" id="to" required />
                    <label htmlFor="resolution">Resolution</label>
                    <select name="resolution" id="resolution">
                        {
                            Object.keys(resolutions).map((label: string) => {
                                return (
                                    <optgroup key={label} label={label}>
                                        {resolutions[label].map((EResolution: string) => {
                                            return (
                                                <option key={EResolution} value={EResolution} selected={EResolution === '1d'}>{EResolution}</option>
                                            )
                                        })}
                                    </optgroup>
                                )
                            })
                        }
                    </select>
                
                    <input type="submit" value="Download" />
                </form>
            </div>
            <p className={styles.progress}>
                {downloadProgress.inProgress
                    ? `Download in progress... ${downloadProgress.current} / ${downloadProgress.required}`
                    : ''
                }
            </p>
        </div>
    );
}

export default DownloadPage;
