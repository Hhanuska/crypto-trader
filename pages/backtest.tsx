import type { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from 'next';
import Table from '../app/database/Table';

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    const response = await fetch('http://localhost:3000/api/getTables');
    const json = await response.json();
    const tables = json.success ? json.tables : [];
    
    return {
        props: {
            tables: tables
        }
    }
}

const BacktestPage: NextPage = ({ tables }: InferGetServerSidePropsType<typeof getServerSideProps>) => (
    <div>
        <table>
            <tr>
                <th>Symbol</th>
                <th>Resolution</th>
                <th>Start Date</th>
                <th>End Date</th>
            </tr>
            {tables.map((name: string) => {
                const parsed = Table.parseTableName(name);
                
                return (
                    <tr>
                        <td key='symbol'>{parsed.symbol}</td>
                        <td key='resolution'>{parsed.resolution}</td>
                        <td key='from'>{parsed.from}</td>
                        <td key='to'>{parsed.to}</td>
                    </tr>
                );
            })
        }
        </table>
    </div>
);

export default BacktestPage;
