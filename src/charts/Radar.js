import {Radar} from 'react-chartjs-2';
import { 
    Chart as ChartJS, 
    PointElement, 
    RadialLinearScale,
    LineElement,
    Filler,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import Papa from 'papaparse';
import { useEffect, useState } from 'react';
import FlatData from './laptop.csv'

ChartJS.register(
    PointElement, 
    RadialLinearScale,
    LineElement,
    Filler,
    Title,
    Tooltip,
    Legend,
);

export const RadarGraph = () => {
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
                    labels: result.data.map((item, index) => [item["Company"]]).filter( String ),
                    datasets: [
                        {
                            label: "Laptops",
                            data: result.data.map((item, index) => [item["Price"]]).map(Number).filter( Number ),
                            backgroundColor: 'rgb(75, 192, 192, 0.1)',
                            borderColor: 'rgb(75, 192, 192)',
                            fill: true,
                        },
                        {
                            label: "Laptops 2",
                            data: result.data.map((item, index) => [item["Ram"]]).map(Number).filter( Number ),
                            backgroundColor: 'rgb(192, 75, 75, 0.1)',
                            borderColor: 'rgb(192, 75, 75)',
                            fill: true,
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
                        },
                        elements: {
                            line: {
                            borderWidth: 3
                            }
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
                        <Radar options={chartOptions} data={chartData} />
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

export default RadarGraph;