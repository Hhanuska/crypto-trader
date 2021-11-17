import dynamic from 'next/dynamic';
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

interface InputProps {
    data: Array<CandleData>;
    title: string;
}

interface CandleData {
    x: number;
    y: Array<number>;
}

const CandlestickChart = ({ data, title }: InputProps) => {
    const options: ApexCharts.ApexOptions = {
        title: {
            text: title,
        },
        xaxis: {
            type: 'datetime'
        },
        yaxis: {
            tooltip: {
                enabled: true
            }
        },
        chart: {
            zoom: {
                enabled: true,
                autoScaleYaxis: true,
                type: 'xy'
            }
        }
    }

    const series = [
        {
            data: data
        }
    ]

    return (
        <ApexCharts
            options={options}
            series={series}
            type="candlestick"
            height="400px"
            width="70%"
        />
    )
}

export default CandlestickChart;
