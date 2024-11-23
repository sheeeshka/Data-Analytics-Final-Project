import { Bar } from 'react-chartjs-2';
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    BarElement,
    Title,
    Tooltip,
    Legend,
    plugins,
} from 'chart.js';
import Papa from 'papaparse';
import { useEffect, useState } from 'react';
import FlatData from './laptop.csv'

ChartJS.register(
    CategoryScale, 
    LinearScale, 
    BarElement,
    Title,
    Tooltip,
    Legend,
);

export const BarGraph = () => {
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
                console.log(result)
                setChartData({
                    labels: result.data.map((item, index) => [item["Company"]]).filter( String ),
                    datasets: [
                        {
                            label: "Laptops",
                            data: result.data.map((item, index) => [item["Price"]]).filter( Number ),
                            borderColor: 'darkblue',
                            backgroundColor: 'lightblue',
                            borderWidth: 1,
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
                            text: "Price of Flats in Sucat City",
                        }
                    }
                })
            })
        })
    }, [])

    return (
        <>
            {
                chartData.datasets.length > 0 ? (
                    <div>
                        <Bar options={chartOptions} data={chartData}/>
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

export default BarGraph;