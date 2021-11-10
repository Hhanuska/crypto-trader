import type { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from 'next';
import { BaseSyntheticEvent } from 'react';
import Database from '../app/database/Database';
import Table from '../app/database/Table';

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

const BacktestPage: NextPage = ({ tables }: InferGetServerSidePropsType<typeof getServerSideProps>) => (
    <div>
        <table>
            <tr>
                <th>Symbol</th>
                <th>Resolution</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Action</th>
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
                            <button value={name} onClick={dropTable}>Delete</button>
                        </td>
                    </tr>
                );
            })
        }
        </table>
    </div>
);

export default BacktestPage;
