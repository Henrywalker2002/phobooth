import React, {useState} from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  Divider,
  TextField,
} from "@mui/material";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {useNavigate} from "react-router-dom";

export default function DeniedDialog(props) {
  const { open, setOpen, id, name } = props;
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [payload, setPayload] = useState({
    status: "REJECTED",
    denied_reason: "denied_reason",
  });

  const sendDenied = async () => {
    await axiosPrivate.patch(`/studio-document/${id}/`, payload)
    .then((response) => {
        navigate(`/admin/verify-studio`);
    })
    .catch((error) =>{
        console.error(error);
    });
  }

  return (
    <Dialog open={open}>
      <DialogContent>
        <div className="text-indigo-800 text-xl font-semibold leading-9 whitespace-nowrap w-full justify-center items-start">
          Từ chối xác thực
        </div>
        <Divider />
        <div>
          <Typography display="inline">Studio: </Typography>
          <Typography
            display="inline"
            sx={{
              fontSize: "13px",
              color: "rgba(63, 65, 166, 1)",
              fontWeight: "500",
              textAlign: "center",
            }}
          >
            {name}
          </Typography>
        </div>
        <div>
          <Typography>Lý do từ chối: </Typography>
          <TextField
            style={{ width: '500px' }}
            variant="outlined"
            required
            multiline
            rows={4}
            fullWidth
            placeholder="Ghi lý do của bạn"
            onChange={(event) => {
                setPayload({ ...payload, denied_reason: event.target.value });
            }}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          sx={{
            textTransform: "none",
            color: "#3F41A6",
            border: "1px solid #3F41A6",
            width: "fit-content",
            padding: "5px 15px",
            borderRadius: "20px",
            "&:hover": {
              border: "1px solid #3949AB",
            },
          }}
          onClick={() => {
            setOpen(false);
          }}
        >
          Huỷ
        </Button>
        <Button
          variant="contained"
          sx={{
            textTransform: "none",
            bgcolor: "#3F41A6",
            width: "fit-content",
            padding: "5px 15px",
            borderRadius: "20px",
            "&:hover": {
              bgcolor: "#3949AB",
            },
          }}
            onClick={() => {
                sendDenied();
                setOpen(false);
            }}
        >
          Từ chối
        </Button>
      </DialogActions>
    </Dialog>
  );
}
