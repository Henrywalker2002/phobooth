import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { Alert } from "@mui/material";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Alert variant="outlined" severity="error">
        Bạn không thể truy cập vào trang này.
      </Alert>
      <Button
        variant="outlined"
        onClick={() => navigate(-1)}
        sx={{
          marginRight: "20px",
          borderRadius: "43px",
          borderColor: "#3F41A6",
          color: "#3F41A6",
          padding: "0 30px",
          textTransform: "none",
          width: "120px",
          "&:hover": {
            bgcolor: "#F6F5FB",
            borderColor: "#3F41A6",
          },
        }}
      >
        Quay lại
      </Button>
    </div>
  );
};

export default Unauthorized;
