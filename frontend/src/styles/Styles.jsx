import styled from "@emotion/styled";
import { Step, TextField } from "@mui/material";

export const ColoredInput = styled(TextField)({
  "& .MuiInput-underline:after": {
    borderBottomColor: "#3F41A6",
  },
  "& .MuiFormLabel-root .Mui-focused": {
    color: "#000",
  },
});

export const ColoredStep = styled(Step)({
  "& .css-1rwiq4e-MuiStep-root": {
    width: "300px",
  },
  "& .MuiStepLabel-root .Mui-completed": {
    color: "#3F41A6", // circle color (COMPLETED)
  },
  "& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel": {
    color: "#3F41A6", // Just text label (COMPLETED)
  },
  "& .MuiStepLabel-root .Mui-active": {
    color: "#3F41A6", // circle color (ACTIVE)
  },
  "& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel": {
    color: "#00000099", // Just text label (ACTIVE)
  },
  "& .MuiStepLabel-root .Mui-active .MuiStepIcon-text": {
    fill: "#fff", // circle's number (ACTIVE)
  },
});
