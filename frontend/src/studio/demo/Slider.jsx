import React, { useState } from "react";
import { Box, IconButton, MobileStepper } from "@mui/material";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";

function Slider({ step, setStep, currentDemo, setCurrentDemo, imageList, maxSteps}) {
  const handleNext = () => {
    setCurrentDemo(imageList[step + 1]);
    setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setCurrentDemo(imageList[step - 1]);
    setStep((prevStep) => prevStep - 1);
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
          disabled={step === 0}
        >
          <KeyboardArrowLeftOutlinedIcon />
        </IconButton>

        {/* Image */}
        <img
          loading="lazy"
          srcSet={currentDemo?.image?.full_size}
          className="max-w-[912px] max-h-[600px]"
        />

        <IconButton
          sx={{
            margin: 3,
            "&:hover": {
              bgcolor: "#E6E6E6",
            },
          }}
          onClick={handleNext}
          disabled={step === maxSteps - 1}
        >
          <KeyboardArrowRightOutlinedIcon />
        </IconButton>
      </Box>

      {/* pagination */}
      <div className="flex max-w-[140px] mx-auto">
        <IconButton onClick={handleBack} disabled={step === 0}>
          <KeyboardArrowLeftOutlinedIcon sx={{ color: "#3F41A6" }} />
        </IconButton>
        <MobileStepper
          variant="text"
          steps={maxSteps}
          position="static"
          activeStep={step}
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
        <IconButton onClick={handleNext} disabled={step === maxSteps - 1}>
          <KeyboardArrowRightOutlinedIcon sx={{ color: "#3F41A6" }} />
        </IconButton>
      </div>
    </div>
  );
}

export default Slider;
