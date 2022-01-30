import type { NextPage } from 'next';
import Link from 'next/link';

import NavBar from '../components/navbar';

import styles from '../styles/index.module.css'

const Home: NextPage = () => (
	<div>
		<NavBar />
		<div className={styles.grid}>
			<div className={styles.leftSide}>
				<Link href="/downloader">
					<a className={styles.downloader}>Downloader</a>
				</Link>
				<Link href="/backtest">
					<a className={styles.backtest}>Backtest</a>
				</Link>
			</div>
			<div className={styles.rightSide}>
				<p>Getting started...</p>
				<ol>
					<li>Go to the <Link href="/downloader"><a>Downloader</a></Link></li>
					<li>Select your desired parameters (You can find the possible symbols on <a href="https://www.binance.com/en">Binance</a>. (e.g. BTCUSDT, ETHUSDT)</li>
					<li>Download a dataset</li>
					<li>Go to the <Link href="/backtest"><a>Backtester</a></Link></li>
					<li>Here you can manage your downloaded datasets or</li>
					<li>Chart your datasets</li>
				</ol>
			</div>
		</div>
	</div>
);

export default Home;
