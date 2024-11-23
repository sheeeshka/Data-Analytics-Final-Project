export const lineChartData = {
    labels: [
        'Red', 
        'Blue', 
        'Yellow', 
        'Green', 
        'Purple', 
        'Orange'
    ],
    datasets: [
        {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            borderColor: "rgb(75, 192, 192)",
            borderWidth: 1
        },
        {
            label: '# of Votes per Brgy',
            data: [6, 4, 2, 8, 12, 9],
            borderColor: "red",
            borderWidth: 1
        }
    ]
};

export const barChartData = {
    labels: [
        'Red', 
        'Blue', 
        'Yellow', 
        'Green', 
        'Purple', 
        'Orange'
    ],
    datasets: [
        {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: "lightblue",
            borderColor: "darkblue",
            borderWidth: 1
        }
    ]
};

export const pieChartData = {
    labels: [
        'Red', 
        'Blue', 
        'Yellow', 
        'Green', 
        'Purple', 
        'Orange'
    ],
    datasets: [
        {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                "red",
                "orange",
                "yellow",
                "green",
                "blue",
            ],
            borderWidth: 1,
            hoverOffset: 20,
        }
    ]
};