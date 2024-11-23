import {Line} from 'react-chartjs-2';
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import Papa from 'papaparse';
import { useEffect, useState } from 'react';
import FlatData from './Flats.csv'

ChartJS.register(
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement,
    Title,
    Tooltip,
    Legend,
);

export const LineGraph = () => {
    const [chartData, setChartData] = useState({
        datasets: []
    });
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        Papa.parse(FlatData, {
            download: true,
            header: true,
            dynamicTyping: true,
            delimiter: "",
            complete: ((result) => {
                console.log(result);
                
                setChartData({
                    labels: result.data.map((item, index) => [item["property_name"]]).filter( String ),
                    datasets: [
                        {
                            label: "Laptops",
                            data: result.data.map((item, index) => [item["price"]]).map(Number).filter( Number ),
                            fill: false,
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.1,
                            parsing: { xAxisKey: 'Company', yAxisKey: 'Ram' }
                        }
                    ]
                });
                setChartOptions({
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top'
                        },
                        title: {
                            display: true,
                            text: "Laptops",
                        }
                    },
                })
            })
        })
    }, [])

    return (
        <>
            {
                chartData.datasets.length > 0 ? (
                    <div>
                        <Line options={chartOptions} data={chartData} />
                    </div>
                ) : (
                    <div>
                        Loading...
                    </div>
                )
            }
        </>
    );
}

export default LineGraph;