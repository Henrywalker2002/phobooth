import React, { useState, useEffect } from "react";
import { Avatar, TextField, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import VerifyUploadImage from "./VerifyUploadImage";

const StyledTextField = styled(TextField)({
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
  const {payload, handleChangePayload, errorMsg} = props;

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
        />
      </Grid>
      
      <Grid item xs={6}>
        <div className="text-zinc-900 text-sm leading-5">Ngày cấp/Ngày đăng kí *</div>
        <StyledTextField 
          required
          variant="outlined"
          defaultValue={payload.license_date}
          error={errorMsg.license_date ? true : false}
          onChange={handleChangePayload("license_date")}
        />
      </Grid>
      <Grid item xs={6}>
        <div className="text-zinc-900 text-sm leading-5">Nơi cấp/Nơi đăng kí *</div>
        <StyledTextField 
          required
          variant="outlined"
          defaultValue={payload.license_issue}
          error={errorMsg.license_issue ? true : false}
          onChange={handleChangePayload("license_issue")}
        />
      </Grid>
    </Grid>
  );
}
