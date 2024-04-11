import React from "react";
import { TextField, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

export const StyledTextField = styled(TextField)({
  width: "90%",
  marginTop: "10px",
  borderRadius: "5px",
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderRadius: "5px",
    },
  },
  "& .MuiOutlinedInput-input": {
    padding: "15.5px 14px",
  },

  "& .MuiInputLabel-formControl": {
    top: "-6px",
  },
});

export default function VerifyForm(props) {
  const { payload, setPayload, handleChangePayload, errorMsg } = props;

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <div className="text-zinc-900 text-sm leading-5">
          Tên người đại diện pháp lý của Studio *
        </div>
        <StyledTextField
          required
          variant="outlined"
          defaultValue={payload.friendly_name}
          error={errorMsg.friendly_name ? true : false}
          onChange={handleChangePayload("friendly_name")}
          helperText={errorMsg.friendly_name ?? ""}
        />
      </Grid>
      <Grid item xs={6}>
        <div className="text-zinc-900 text-sm leading-5">Email *</div>
        <StyledTextField
          required
          variant="outlined"
          defaultValue={payload.email}
          error={errorMsg.email ? true : false}
          onChange={handleChangePayload("email")}
          helperText={errorMsg.email ?? ""}
        />
      </Grid>

      <Grid item xs={6}>
        <div className="text-zinc-900 text-sm leading-5">Số điện thoại *</div>
        <StyledTextField
          required
          variant="outlined"
          defaultValue={payload.phone}
          error={errorMsg.phone ? true : false}
          onChange={handleChangePayload("phone")}
          helperText={errorMsg.phone ?? ""}
        />
      </Grid>
      <Grid item xs={6}>
        <div className="text-zinc-900 text-sm leading-5">Số CCCD/CMND *</div>
        <StyledTextField
          required
          variant="outlined"
          defaultValue={payload.license_number}
          error={errorMsg.license_number ? true : false}
          onChange={handleChangePayload("license_number")}
          helperText={errorMsg.license_number ?? ""}
        />
      </Grid>

      <Grid item xs={6}>
        <div className="text-zinc-900 text-sm leading-5">
          Ngày cấp/Ngày đăng kí *
        </div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            slotProps={{
              textField: {
                error: errorMsg.license_date ? true : false,
              },
            }}
            id="license_date"
            name="license_date"
            sx={{
              width: "90%",
              marginTop: "10px",
              borderRadius: "5px",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderRadius: "5px",
                },
              },
              "& .MuiOutlinedInput-input": {
                padding: "15.5px 14px",
              },

              "& .MuiInputLabel-formControl": {
                top: "-6px",
              },
            }}
            format="DD-MM-YYYY"
            onChange={(value) => {
              if (value)
                setPayload({
                  ...payload,
                  license_date: value.format("YYYY-MM-DD"),
                });
            }}
            defaultValue={dayjs(payload.license_date)}
          />
        </LocalizationProvider>
      </Grid>
      <Grid item xs={6}>
        <div className="text-zinc-900 text-sm leading-5">
          Nơi cấp/Nơi đăng kí *
        </div>
        <StyledTextField
          required
          variant="outlined"
          defaultValue={payload.license_issue}
          error={errorMsg.license_issue ? true : false}
          onChange={handleChangePayload("license_issue")}
          helperText={errorMsg.license_issue ?? ""}
        />
      </Grid>
    </Grid>
  );
}
