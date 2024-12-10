import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "./assets/logo.png"; 
import dawg from "./assets/dawg.png"; 

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        backgroundColor: "#FFF3E0",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // Centers content horizontally
        justifyContent: "center", // Centers content vertically
        padding: 3,
        boxSizing: "border-box",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "left",
          justifyContent: "left",
          gap: 1.5,
          marginBottom: 2,
          width: "80%",
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="FetchData Logo"
          sx={{
            width: 90,
            height: 80,
          }}
        />
        <Typography
          sx={{
            color: "#FFA726",
            fontSize: "3rem",
            fontWeight: "700",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          FetchData
        </Typography>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
          width: "80%",
        }}
      >
        {/* Description and Buttons */}
        <Box
          sx={{
            textAlign: "left",
            maxWidth: "800px",
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontWeight: "800",
              fontSize: { xs: "3rem", md: "4rem" },
              color: "#4E342E",
              lineHeight: "1.2",
              marginBottom: 3,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Unleash the Power of Your Data
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: "1.2rem",
              color: "#4E342E",
              lineHeight: "1.8",
              width: "100%",
              marginBottom: 3,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            FetchData makes data analytics simple and fast. Our platform helps
            businesses quickly retrieve, analyze, and act on data, turning
            insights into action with ease. Just like a loyal dog fetching a
            ball, we fetch the answers you need—reliable, efficient, and always
            on point.
            <br />
            <strong>FetchData — Fetch the answers. Fetch success.</strong>
          </Typography>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              variant="contained"
              onClick={() => navigate("/datapreparation")}
              sx={{
                backgroundColor: "#FFB74D",
                color: "#4E342E",
                fontWeight: "700",
                textTransform: "none",
                padding: "12px 32px",
                borderRadius: "25px",
                "&:hover": { backgroundColor: "#FFA726" },
              }}
            >
              Start with Data Preparation
            </Button>
            <Button
              variant="outlined"
              disabled
              onClick={() => navigate("/visualization")}
              sx={{
                borderColor: "#FFB74D",
                color: "#FFB74D",
                fontWeight: "700",
                textTransform: "none",
                padding: "12px 32px",
                borderRadius: "25px",
                "&:hover": {
                  backgroundColor: "#FFF8E1",
                  borderColor: "#FFA726",
                },
              }}
            >
              Go to Visualization
            </Button>
          </Box>
        </Box>

        {/* Dawg Illustration */}
        <Box
          component="img"
          src={dawg}
          alt="Dogs Illustration"
          sx={{
            width: { xs: "100%", md: "45%" },
            maxWidth: "600px",
            height: "auto",
          }}
        />
      </Box>
    </Box>
  );
};

export default LandingPage;
