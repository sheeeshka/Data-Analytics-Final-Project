// IMPORTS
// =========================================================================
import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "./assets/logo.png"; 
import BarChartIcon from "@mui/icons-material/BarChart";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import RadarIcon from "@mui/icons-material/Radar";
import PieChartIcon from "@mui/icons-material/PieChart";
import ScatterPlotIcon from "@mui/icons-material/ScatterPlot";
import Papa from 'papaparse';

//=======================================================================


const DataPreparationPage = () => {
  const navigate = useNavigate();
  const [selectedVisualization, setSelectedVisualization] = useState("");
  const [file, setFile] = useState(null);
  const [selectedRangeX, setSelectedRangeX] = useState("");
  const [selectedRangeY, setSelectedRangeY] = useState("");
  const [data, setData] = useState();
  const [columnArray, setColumn] = useState([""]);
  const [values, setValues] = useState([]);
 
 
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];

    Papa.parse(uploadedFile, {
        header: true,
        skipEmptyLines: true,
        complete: function (result) {
            const cleanedData = result.data.map((row) => {
                const cleanedRow = {};
                Object.keys(row).forEach((key) => {
                    if (row[key]?.trim()) { 
                        cleanedRow[key] = row[key];
                    }
                });
                return cleanedRow;
            });

            const columnArray = Object.keys(cleanedData[0] || {}); 
            const valuesArray = cleanedData.map((d) => Object.values(d)); 

          
            setData(cleanedData); 
            setColumn(columnArray);
            setValues(valuesArray);
        },
    });

    setFile(uploadedFile);
};

const handleRemoveDuplicates = () => {
  if (!data || data.length === 0) {
    console.warn("No data available to process.");
    return;
  }

  let cleanedData = [...data];

  // 1. Handle Missing Values: Replace empty or null values with a default value (e.g., "N/A")
  cleanedData = handleMissingValues(cleanedData);

  // 2. Remove Rows with Empty Values: Filter out rows that have any empty or null value in any column
  cleanedData = removeRowsWithEmptyValues(cleanedData);


  // 4. Remove Duplicates: Remove duplicate rows based on the entire row (JSON.stringify approach)
  const uniqueData = Array.from(
    new Map(
      cleanedData.map((row) => [JSON.stringify(row), row]) 
    ).values()
  );

  // Extract columns and values from the cleaned data
  const columnArray = Object.keys(uniqueData[0] || {});
  const valuesArray = uniqueData.map((d) => Object.values(d));

  // Update state with cleaned data, columns, and values
  setData(uniqueData);
  setColumn(columnArray);
  setValues(valuesArray);
};

// 1. Handling Missing Values: Replace empty or null values with a default value (e.g., "N/A")
const handleMissingValues = (data) => {
  return data.map((row) =>
    Object.fromEntries(
      Object.entries(row).map(([key, value]) => [
        key,
        value ? value.trim().replace(/\s+/g, " ") : "N/A", // Replace missing values with "N/A" or any default value
      ])
    )
  );
};

// 2. Removing Rows with Empty Values
const removeRowsWithEmptyValues = (data) => {
  return data.filter((row) =>
    Object.values(row).every((value) => value && value.trim() !== "")
  );
};



  const handleUnleashClick = () => {
    navigate("/visualization", {
      state: {
        visualizationType: selectedVisualization,
        rangeX: selectedRangeX,
        rangeY: selectedRangeY,
        columns: columnArray,
        dataValue: data,
      },
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
              padding: { xs: "6px 16px", sm: "8px 24px" }, // Responsive padding
              fontSize: { xs: "14px", sm: "16px" }, // Responsive font size
              borderRadius: "20px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "auto", // Makes text and box flexible
              maxWidth: "100%", // Prevents overflow
              "&:hover": {
                backgroundColor: "#FFF3E0",
                borderColor: "#FF8C00", // Slightly different border color on hover
                color: "#FF8C00", // Change text color on hover
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Add hover effect
              },
            }}
          onClick={() => navigate("/landingpage")}
        >
          Back to Landing Page
        </Button>
      </Box>

      {/* Main Content */}
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
        {/* Upload CSV and Preview */}
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
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "#4E342E",
              marginBottom: 2,
            }}
          >
            Upload CSV and Preview
          </Typography>
          <Button
            variant="outlined"
            component="label"
            sx={{
              width: "100%",
              textTransform: "none",
              color: "#4E342E",
              fontWeight: "600",
              border: "2px dashed #CCC",
              padding: "12px",
              borderRadius: "12px",
              marginBottom: 3,
              "&:hover": {
                borderColor: "#FFA726",
                backgroundColor: "#FFF7E5",
              },
            }}
          >
            {file ? file.name : "Click to Upload"}
            
            <input 
              type="file" 
              hidden 
              onChange={handleFileUpload} 
              name="file"
              accept=".csv"
            />

          </Button>
          
          {file && (
            
            <Box
              sx={{
                maxHeight: "200px",
                maxWidth: "500px",
                overflow: "auto",
                border: "1px solid #CCC",
                borderRadius: "8px",
                padding: 2,
                marginBottom: 2,
              }}
            >

              {/* TABLE FOR POPULATING DATA */}
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {columnArray.map((header, i) => (
                      <TableCell key={i}>{header}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {values.map((v, i) => (
                    <TableRow key = {i}>
                      {v.map((value, i) => (
                        <TableCell key = {i}>{value}</TableCell>
                      ))}
                    </TableRow>
                  )
                  )}
                </TableBody>
              </Table>
            </Box>
          )}
          {file && (
            <Button
            variant="contained"
            onClick={handleRemoveDuplicates}
            sx={{
              backgroundColor: "#FFB74D",
              color: "#FFFFFF",
              fontWeight: "700",
              width: "200px", // Set width to a specific value to keep it in one line
              height: "45px", // Adjust height for a more rounded appearance
              borderRadius: "25px", // Oval shape
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Adding shadow effect
              "&:hover": { backgroundColor: "#FFA726" },
            }}
          >
            Clean Data
          </Button>
          )}
        </Box>

        {/* Right: Visualization Selection */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {/* Choose Visualization */}
          <Box>
            <Typography
              sx={{
                fontSize: "1.2rem",
                fontWeight: "600",
                color: "#4E342E",
                marginBottom: 2,
              }}
            >
              Choose Visualization:
            </Typography>
            <Grid container spacing={2}>
              {[
                { label: "Bar Chart", icon: <BarChartIcon /> },
                { label: "Line Graph", icon: <ShowChartIcon /> },
                { label: "Radar Chart", icon: <RadarIcon /> },
                { label: "Polar Area Chart", icon: <ScatterPlotIcon /> },
                { label: "Pie Chart", icon: <PieChartIcon /> },
              ].map((option) => (
                <Grid item xs={6} key={option.label}>
                  <Button
                    variant={selectedVisualization === option.label ? "contained" : "outlined"}
                    fullWidth
                    onClick={() => setSelectedVisualization(option.label)}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                      backgroundColor: selectedVisualization === option.label ? "#FFB74D" : "#FFF",
                      color: "#4E342E",
                      fontWeight: "600",
                      borderRadius: "12px",
                      "&:hover": {
                        backgroundColor: "#FFF3E0",
                      },
                    }}
                  >
                    {option.icon}
                    {option.label}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Choose Ranges */}
          <Box>
            <Typography
              sx={{
                fontSize: "1.2rem",
                fontWeight: "600",
                color: "#4E342E",
                marginBottom: 2,
              }}
            >
              Choose Ranges:
            </Typography>
              { (selectedVisualization == "Line Graph" || selectedVisualization == "Bar Chart")  &&
                <>
  
                    <TextField
                      select
                      value={selectedRangeX}
                      onChange={(e) => setSelectedRangeX(e.target.value)}
                      fullWidth
                      SelectProps={{ native: true }}
                      sx={{ marginBottom: 2 }}
                    >
                      <option value="">Select Range</option>
                        <option value="All Columns">All Columns</option> {/* Add the additional option here */}
                        {columnArray.map((header) => (
                          <option key={header} value={header}>
                            {header}
                          </option>
                        ))}
                    </TextField>

                    <TextField
                      select
                      value={selectedRangeY}
                      onChange={(e) => setSelectedRangeY(e.target.value)}
                      fullWidth
                      SelectProps={{ native: true }}
                      sx={{ marginBottom: 2 }}
                    >
                      <option value="">Select Range(Label)</option>
                        <option value="All Columns">All Columns</option> {/* Add the additional option here */}
                        {columnArray.map((header) => (
                          <option key={header} value={header}>
                            {header}
                          </option>
                        ))}
                    </TextField>
                  
                  
                  </>
                } 
          </Box>

          {/* Unleash Data Button */}
          <Button
            variant="contained"
            onClick={handleUnleashClick}
            disabled={!selectedVisualization || !file}
            sx={{
              backgroundColor: "#FFB74D",
              color: "#FFFFFF",
              fontWeight: "700",
              fontSize: "1rem",
              "&:hover": { backgroundColor: "#FFF3E0",color: "#FFB74D" }
              ,
            }}
          >
            Unleash Data
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default DataPreparationPage;
