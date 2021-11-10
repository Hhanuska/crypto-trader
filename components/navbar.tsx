import { NextPage } from "next";
import Link from 'next/link';

const NavBar: NextPage = () => {

    return (
        <table>
            <tr>
                <th>
                    <Link href='/'>Home</Link>
                </th>
                <th>
                    <Link href='/downloader'>Downloader</Link>
                </th>
                <th>
                    <Link href='/backtest'>Backtest</Link>
                </th>
            </tr>
        </table>
    )
}

export default NavBar;
