import type { NextPage } from 'next';
import Link from 'next/link';

import NavBar from '../components/navbar';

const Home: NextPage = () => (
	<div>
		<NavBar />
		<Link href='/downloader'>
			<a>Download Data</a>
		</Link>
		<Link href='/backtest'>
			<a>Backtest</a>
		</Link>
	</div>
);

export default Home;
