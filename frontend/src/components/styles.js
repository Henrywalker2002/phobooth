import styled from "@emotion/styled";
import { TextField } from "@mui/material";


export const ColoredInput = styled(TextField)({
    "& .MuiInput-underline:after": {
        borderBottomColor: "#3F41A6",
    },
    "& .MuiFormLabel-root .Mui-focused": {
        color: "#000",
    },
});