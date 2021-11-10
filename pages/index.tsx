import type { NextPage } from 'next';

import Link from 'next/link';

const Home: NextPage = () => (
	<div>
		<Link href='/downloader'>
			<a>Download Data</a>
		</Link>
		<Link href='/backtest'>
			<a>Backtest</a>
		</Link>
	</div>
);

export default Home;
