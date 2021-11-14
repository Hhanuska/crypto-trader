import { NextPage } from "next";
import Link from 'next/link';
import styles from '../styles/navbar.module.css'
import { useRouter } from 'next/router'

const NavBar: NextPage = () => {
    const router = useRouter();

    const navigation = [
        { href: '/', text: 'Home' },
        { href: '/downloader', text: 'Downloader' },
        { href: '/backtest', text: 'Backtest' }
    ]

    return (
        <div className={styles.navbar}>
            <ul>
                {
                    navigation.map((e) => (
                        <li key={e.text}>
                            <Link href={e.href}>
                                <a className={isActiveClass(router.route, e.href)}>{e.text}</a>
                            </Link>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

const isActiveClass = (router: string, href: string): string => {
    return router === href ? 'active' : '';
}

export default NavBar;
