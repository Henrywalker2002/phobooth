import React, { useState } from "react";
import { Box, IconButton, MobileStepper } from "@mui/material";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";

function Slider() {
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = 10;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  return (
    <div className="flex flex-col gap-3 self-center w-full">
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          alignContent: "center",
          justifyContent: "center",
          height: "fit-content",
        }}
      >
        <IconButton
          sx={{
            margin: 3,
            "&:hover": {
              bgcolor: "#E6E6E6",
            },
          }}
          onClick={handleBack}
          disabled={activeStep === 0}
        >
          <KeyboardArrowLeftOutlinedIcon />
        </IconButton>

        {/* Image */}
        <img
          loading="lazy"
          srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/b6f2d4c62d75f90d2d26db579cd855e4925b60ae95005b84704f064348164aa1?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/b6f2d4c62d75f90d2d26db579cd855e4925b60ae95005b84704f064348164aa1?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/b6f2d4c62d75f90d2d26db579cd855e4925b60ae95005b84704f064348164aa1?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/b6f2d4c62d75f90d2d26db579cd855e4925b60ae95005b84704f064348164aa1?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/b6f2d4c62d75f90d2d26db579cd855e4925b60ae95005b84704f064348164aa1?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/b6f2d4c62d75f90d2d26db579cd855e4925b60ae95005b84704f064348164aa1?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/b6f2d4c62d75f90d2d26db579cd855e4925b60ae95005b84704f064348164aa1?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/b6f2d4c62d75f90d2d26db579cd855e4925b60ae95005b84704f064348164aa1?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
          className="w-[800px] h-[400px]"
        />

        <IconButton
          sx={{
            margin: 3,
            "&:hover": {
              bgcolor: "#E6E6E6",
            },
          }}
          onClick={handleNext}
          disabled={activeStep === maxSteps - 1}
        >
          <KeyboardArrowRightOutlinedIcon />
        </IconButton>
      </Box>

      {/* pagination */}
      <div className="flex max-w-[140px] mx-auto">
        <IconButton onClick={handleBack} disabled={activeStep === 0}>
          <KeyboardArrowLeftOutlinedIcon sx={{ color: "#3F41A6" }} />
        </IconButton>
        <MobileStepper
          variant="text"
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          sx={{
            bgcolor: "transparent",
            width: "fit-content",
            margin: "0",
            color: "#3F41A6",
            "&.MuiMobileStepper-dotActive": {
              bgcolor: "#3F41A6",
            },
          }}
        />
        <IconButton onClick={handleNext} disabled={activeStep === maxSteps - 1}>
          <KeyboardArrowRightOutlinedIcon sx={{ color: "#3F41A6" }} />
        </IconButton>
      </div>
    </div>
  );
}

export default Slider;
