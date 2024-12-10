import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  RadarController,
  PieController,
  PolarAreaController,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title,
  PointElement,
  RadialLinearScale,
  ArcElement
} from "chart.js";
import { Bar, Line, Radar, Pie, PolarArea, Doughnut } from "react-chartjs-2";
import logo from "./assets/logo.png"; 
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

// Register the necessary chart components with ChartJS
ChartJS.register(
  BarElement,
  LineElement,
  RadarController,
  PieController,
  PolarAreaController,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title
);

ChartJS.register(
  BarElement,
  LineElement,
  RadarController,
  PieController,
  PolarAreaController,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title,
  PointElement,
  RadialLinearScale,
  ArcElement,

);

export default function VisualizationPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [findings, setFindings] = useState("Summary of results will be displayed here...");
  
  const { visualizationType, rangeX, rangeY, columns, dataValue } = location.state || {
    visualizationType: "",
    rangeX: "",
    rangeY: "",
    columns: [],
    dataValue: [],
  };

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    handleGenerateGraph();
  }, [visualizationType]);

  const handleGenerateGraph = () => {

    switch (visualizationType)
    {
      case "Bar Chart":
        if (rangeX === "All Columns") {
          const selectedData = [];
        
          for (let i = 0; i < columns.length; i++) {
            const columnType = columns[i];                                         // Get the current column (key)
        
                                                                                     // Accumulate the sum for the current column
            const columnSum = dataValue.reduce((acc, result) => {
              let value = result[columnType];
        
                                                                                    // Coerce value to a number if it’s a string
              value = Number(value);                                                // Convert to number (will be NaN if invalid)
        
                                                                                    // Check if the value is a valid number
              if (!isNaN(value)) {
                return acc + value;
              }
        
              return acc;                                                            // Ignore non-numeric values
            }, 0);                                                                    // Initial value of accumulator is 0
        
                                                                                      // Push the accumulated sum for the column to selectedData
            selectedData.push(columnSum);
          }
        
                                                                                      // Log final selectedData before updating the chart
 
          console.log(selectedData);
          setChartData((prev) => ({
            labels: columns,                                                            // Labels for the columns
            datasets: [
              {
                label: `Summed Data for All Columns`,                                   // Label for the dataset
                data: selectedData,                                                     // Use selectedData here
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
            ],
          }));
        } 
        
        else 
        {
                const selectedData = dataValue
                  .filter(
                    (result) =>
                      result[rangeX] !== undefined &&
                      result[rangeX] !== null &&
                      result[rangeX] !== ""
                  )                                                                     // Filter out empty values
                  .map((result) => result[rangeX]);                                     // Map to extract the rangeX values

                const labelData = [];                                                             // assign values (string) of rangeY (column) as label
                if(rangeY === "All Columns" || rangeY === "") {                                   // assign number/index as a label
                  for (let i = 0; i < selectedData.length; i++) {
                    labelData.push(i);
                  }
                } else {
                  dataValue.map((item, index) => labelData.push([item[rangeY]])).filter( String ); 
                }
                console.log(dataValue.map((item, index) => [item[rangeY]]).filter( String ));
                setChartData((prev) => ({
                  labels: labelData,                                                   // Example of updating labels
                  datasets: [
                    {
                      label: `${rangeX} Bar Graph`,
                      data: selectedData,                                             // Example data
                      backgroundColor: "rgba(75, 192, 192, 0.2)",
                      borderColor: "rgba(75, 192, 192, 1)",
                      borderWidth: 1,
                    },
                  ],
                }));
              }
  break;


  case "Line Graph":
    if (rangeX === "All Columns") {
      const selectedData = [];
  
      for (let i = 0; i < columns.length; i++) {
        const columnType = columns[i];                                                // Get the current column (key)
  
                                                                                       // Accumulate the sum for the current column
        const columnSum = dataValue.reduce((acc, result) => {
          let value = result[columnType];
  
                                                                                        // Coerce value to a number if it’s a string
          value = Number(value);                                                        // Convert to number (will be NaN if invalid)
  
                                                                                        // Check if the value is a valid number
          if (!isNaN(value)) {
            return acc + value;
          }
  
          return acc;                                                                    // Ignore non-numeric values
        }, 0);                                                                          // Initial value of accumulator is 0
  
                                                                                        // Push the accumulated sum for the column to selectedData
        selectedData.push(columnSum);
      }
  
                                                                                        // Log final selectedData before updating the chart
      console.log("Selected Data for All Columns (Line Graph):", selectedData);
  
      setChartData((prev) => ({
        labels: columns,                                                                // Labels for the columns
        datasets: [
          {
            label: `Summed Data for All Columns (Line Graph)`,                          // Label for the dataset
            data: selectedData,                                                          // Use selectedData here
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
            fill: false,                                                                 // No area fill for Line Graph
          },
        ],
      }));
    } else {
      const selectedData = dataValue
        .filter(
          (result) =>
            result[rangeX] !== undefined &&
            result[rangeX] !== null &&
            result[rangeX] !== ""
        )                                                                              // Filter out empty values
        .map((result) => result[rangeX]);                                               // Map to extract the rangeX values
  
      const labelData = [];                                                             // assign values (string) of rangeY (column) as label
      if(rangeY === "All Columns" || rangeY === "") {                                   // assign number/index as a label
        for (let i = 0; i < selectedData.length; i++) {
          labelData.push(i);
        }
      } else {
        dataValue.map((item, index) => labelData.push([item[rangeY]])).filter( String ); 
      }
      
  
      setChartData((prev) => ({
        labels: labelData,                                                            // Labels for x-axis (row indices or generated labels)
        datasets: [
          {
            label: `${rangeX} Line Graph`,                                            // Label for the dataset
            data: selectedData,                                                       // Example data
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
            fill: false,                                                               // No area fill for Line Graph
          },
        ],
      }));
    }
    break;
  


      case "Radar Chart":
  const selectedDataRadar = [];
  for (let i = 0; i < columns.length; i++) {                                             // Loop through each column
    const columnType = columns[i];                                                       // Get the current column (key)
                                                
    const radarSingleData = dataValue.reduce((acc, result) => {                         // Accumulate the sum for the current column (key)
      const value = result[columnType];                                                 // Access the value of result using the columnType key
      
      if (typeof value === 'number') {                                                  // Ensure the value is a number before adding to the accumulator
        return acc + value;
      } else if (!isNaN(Number(value))) {                                               // If the value is a string that represents a number, convert it
        return acc + Number(value);
      }

      return acc;                                                                       // Ignore non-numeric values
    }, 0);                                                                              // Initial value of accumulator is 0
    
                                                                                        
    selectedDataRadar.push(radarSingleData);                                            // Push the accumulated sum for the column to selectedDataRadar
  }
  console.log(selectedDataRadar);
  setChartData((prev) => ({
    labels: columns,                                                                    // Labels for the Radar chart
    datasets: [
      {
        label: `Radar Chart`,                                                             // Label for the dataset
        data: selectedDataRadar,                                                        // Use selectedDataRadar here instead of selectedData
        backgroundColor: "rgba(75, 192, 192, 0.2)",                                     // Example background color
        borderColor: "rgba(75, 192, 192, 1)",                                            // Example border color
        borderWidth: 1,
      },
    ],
  }));
  break;

  case "Polar Area Chart":
  const selectedDataPolar = [];
  
  for (let i = 0; i < columns.length; i++) {
    const columnType = columns[i];                                                    // Get the current column (key)
    
                                                                                      // Accumulate the sum for the current column
    const polarSingleData = dataValue.reduce((acc, result) => {
      let value = result[columnType];


                                                                                      // Coerce value to a number if it’s a string
      value = Number(value);                                                           // Convert to number (will be NaN if invalid)

      if (!isNaN(value)) {                                                            // Check if the value is a valid number
        return acc + value;
      }
      

      return acc;                                                                       // Ignore non-numeric values
    }, 0);                                                                         // Initial value of accumulator is 0
    
    selectedDataPolar.push(polarSingleData);                                        // Push the accumulated sum for the column to selectedDataPolar
  }

 
  setChartData((prev) => ({
    labels: columns,                                                                    // Labels for the Polar Area chart
    datasets: [
      {
        label: `Polar Area Chart`,                                                        // Label for the dataset
        data: selectedDataPolar,                                                          // Use selectedDataPolar here
        backgroundColor: [
          "rgba(75, 192, 192, 0.2)", "rgba(153, 102, 255, 0.2)", "rgba(255, 159, 64, 0.2)",
          "rgba(54, 162, 235, 0.2)", "rgba(255, 99, 132, 0.2)", "rgba(255, 205, 86, 0.2)"
        ],                                                                              // Example background colors for the sections
        borderColor: [
          "rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)", "rgba(255, 159, 64, 1)",
          "rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)", "rgba(255, 205, 86, 1)"
        ],                                                                                              // Example border colors
        borderWidth: 1,
      },
    ],
  }));
  break;


  case "Pie Chart":
    const selectedDataPie = [];
    
    for (let i = 0; i < columns.length; i++) {
      const columnType = columns[i];                                                        // Get the current column (key)
      
                                                                                            // Accumulate the sum for the current column
      const pieSingleData = dataValue.reduce((acc, result) => {
        let value = result[columnType];

                                                                                             // Coerce value to a number if it’s a string
        value = Number(value);                                                                // Convert to number (will be NaN if invalid)
  
                                                                                              // Check if the value is a valid number
        if (!isNaN(value)) {
          return acc + value;
        }

        return acc;                                                                            // Ignore non-numeric values
      }, 0);                                                                                  // Initial value of accumulator is 0
      
                                                                                              // Push the accumulated sum for the column to selectedDataPie
      selectedDataPie.push(pieSingleData);
    }
  
    setChartData((prev) => ({
      labels: columns,                                                                       // Labels for the Pie chart
      datasets: [
        {
          label: `Pie Chart`,                                                                 // Label for the dataset
          data: selectedDataPie,                                                              // Use selectedDataPie here
          backgroundColor: [
            "rgba(75, 192, 192, 0.2)", "rgba(153, 102, 255, 0.2)", "rgba(255, 159, 64, 0.2)",
            "rgba(54, 162, 235, 0.2)", "rgba(255, 99, 132, 0.2)", "rgba(255, 205, 86, 0.2)"
          ],                                                                                  // Example background colors for the sections
          borderColor: [
            "rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)", "rgba(255, 159, 64, 1)",
            "rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)", "rgba(255, 205, 86, 1)"
          ],                                                                                          // Example border colors
          borderWidth: 1,
        },
      ],
    }));
    break;
  
      default:
      alert("ERROR: Invalid Chart Type!");
      break;
    }
  }

  const handleGenerateReport = () => {
    const pdf = new jsPDF();
  
                                                                                                    // Capture the title and add to PDF as centered, bold, and bigger font
    const titleText = title || '';                                                                 // Using the title state value directly
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(24);                                                                            // Larger font size for the title
    const titleWidth = pdf.getTextWidth(titleText);                                               // Get the width of the title
    pdf.text(titleText, (pdf.internal.pageSize.width - titleWidth) / 2, 20);                        // Centered title
    pdf.setFont('helvetica', 'normal');                                                             // Reset to normal font for other text
  
                                                                                                   // Capture the description and add to PDF with normal size font
    const descriptionElement = document.getElementById("makeDescription");
    const descriptionText = descriptionElement ? descriptionElement.innerText || descriptionElement.textContent : '';
    pdf.setFontSize(12);                                                                                        // Normal font size for description
    pdf.setFont('helvetica', 'bold');                                                                             // Bold "Description"
    pdf.text("Description", 10, 40);                                                                            // Add "Description" heading
    pdf.setFont('helvetica', 'normal');                                                                        // Reset to normal font for the description text
    pdf.text(descriptionText, 10, 50);                                                                             // Position of description text
  
                                                                                                                  // Capture the chart and add to PDF as image
    const chartElement = document.getElementById("chart");
    html2canvas(chartElement).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 10, 60, 180, 160);                                                                 // Customize position and size for chart
  
                                                                                                                  // Capture the findings and add to PDF below the chart
      const findingsElement = document.getElementById("makeFindings");
      const findingsText = findingsElement ? findingsElement.innerText || findingsElement.textContent : '';
      pdf.setFontSize(12);                                                                                          // Normal font size for findings
      pdf.setFont('helvetica', 'bold');                                                                              // Bold "Findings"
      pdf.text("Findings", 10, 230);                                                                                // Add "Findings" heading
      pdf.setFont('helvetica', 'normal');                                                                           // Reset to normal font for the findings text
      pdf.text(findingsText, 10, 240);                                                                              // Position findings below the chart
  
                                                                                                                    // Save the PDF
      pdf.save(`${title}.pdf`);
    });
  };
  
  return (
    <Box
      sx={{
        backgroundColor: "#FFF3E0", 
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "Poppins, sans-serif",
        padding: 4,
        boxSizing: "border-box",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "1200px",
          marginBottom: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="FetchData Logo"
            sx={{
              width: 60,
              height: 60,
            }}
          />
          <Typography
            sx={{
              color: "#FFB74D", 
              fontSize: "2rem",
              fontWeight: "700",
            }}
          >
            FetchData
          </Typography>
        </Box>
        <Button
          variant="outlined"
          sx={{
            color: "#FFB74D",
            borderColor: "#FFB74D",
            fontWeight: "600",
            textTransform: "none",
            padding: "8px 24px",
            borderRadius: "20px",
            "&:hover": { backgroundColor: "#FFF3E0" },
          }}
          onClick={() => navigate("/datapreparation")}
        >
          Back to Data Preparation
        </Button>
      </Box>

      {/* Chart and Details Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          width: "100%",
          maxWidth: "1200px",
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          padding: 4,
          boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Chart Display */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "#FFF8E1", 
            borderRadius: "16px",
            padding: 3,
          }}
        >
          <Typography
            sx={{
              fontSize: "1.4rem",
              fontWeight: "700",
              color: "#4E342E", 
              marginBottom: 2,
            }}
          >
            Chart Preview
          </Typography>
          <Box
            id="chart"
            sx={{
              height: "300px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
    
            {chartData && chartData.labels && chartData.labels.length > 0 ? (
              {
                "Bar Chart": <Bar data={chartData} />,
                "Line Graph": <Line data={chartData} />,
                "Radar Chart": <Radar data={chartData} />,
                "Polar Area Chart": <PolarArea data={chartData} />,
                "Pie Chart": <Pie data={chartData} />,
              }[visualizationType]
            ) : (
              <Typography>No chart data available!</Typography>
            )}
          </Box>
        </Box>

        {/* Chart Details */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {/* Add Title */}
          <TextField
            label="Add Chart Title"
            value={title}
            id="makeTitle"
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
              backgroundColor: "#FFFFFF",
              borderRadius: "8px",
            }}
          />

          {/* Add Description */}
          <TextField
            label="Add Chart Description"
            value={description}
            id="makeDescription"
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            sx={{
              backgroundColor: "#FFFFFF",
              borderRadius: "8px",
            }}
          />

          {/* Findings */}
          <Box
            sx={{
              flex: 1,
              backgroundColor: "#FFF8E1",
              borderRadius: "16px",
              padding: 3,
            }}
          >
            <Typography
              sx={{
                fontSize: "1.2rem",
                fontWeight: "600",
                color: "#4E342E",
                marginBottom: 1,
              }}
            >
              Findings:
            </Typography>
            <TextField
              value={findings}
              id="makeFindings"
              onChange={(e) => setFindings(e.target.value)}
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              sx={{
                backgroundColor: "#FFFFFF",
                borderRadius: "8px",
                marginBottom: 2,
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Generate Report Button */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "1200px",
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 4,
        }}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#FFB74D", 
            color: "#FFFFFF",
            fontWeight: "700",
            textTransform: "none",
            padding: "12px 32px",
            borderRadius: "20px",
            "&:hover": { backgroundColor: "#FFA726" },
          }}
          onClick={handleGenerateReport}
        >
          Generate Report
        </Button>
      </Box>
    </Box>
  );
}
