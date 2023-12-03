import styled from "@emotion/styled";
import { TextField, createTheme } from "@mui/material";

export const ColoredInput = styled(TextField)({
  "& .MuiInput-underline:after": {
    borderBottomColor: "#3F41A6",
  },
  "& .MuiFormLabel-root .Mui-focused": {
    color: "#000",
  },
});

export const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#E6E6E6",
            },
            "&:hover fieldset": {
              borderColor: "#3F41A6",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#3F41A6",
            },
          },
        },
      },
    },
  },
});
