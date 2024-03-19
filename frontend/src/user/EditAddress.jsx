import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { useCookies } from "react-cookie";
import axios from "../api/axios";

function EditAddress({ open, setOpen, setNewAddress }) {
  const [cookies] = useCookies(["accInfo"]);
  const [provinces, setProvinces] = useState([]);
  const [address, setAddress] = useState({});

  // get province list
  useEffect(() => {
    axios
      .get("province/?limit=63&offset=0")
      .then((res) => {
        // console.log(res);
        setProvinces(res.data.results);
      })
      .catch((err) => console.log(err));
  }, []);

  // setup address
  const setUpInitialAddress = () => {
    if (cookies.userInfo.address !== null) {
      let distlist = [];
      let wardlist = [];
      axios
        .get(`province/${cookies.userInfo.address.province.code_name}/`)
        .then((res) => {
          // console.log(res);
          distlist = res.data.districts;
          return distlist;
        })
        .then((distlist) => {
          wardlist = distlist?.find(
            (dist) => dist.code === cookies.userInfo.address.district.code
          )?.wards;
        })
        .then(() => {
          setAddress([
            {
              street: cookies.userInfo.address.street,
              ward: cookies.userInfo.address.ward,
              district: cookies.userInfo.address.district,
              province: cookies.userInfo.address.province,
              distlist: distlist,
              wardlist: wardlist,
            },
          ]);
        })
        .catch((err) => console.log(err));
    }
  };
  useEffect(() => {
    setUpInitialAddress();
  }, []);

  const handleUpdateProv = async (prov) => {
    try {
      const res = await axios.get(`province/${prov.code_name}/`);
      // console.log(res);
      setAddress({
        ...address,
        province: prov,
        distlist: res.data.districts,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateDist = (district) => {
    setAddress({
      ...address,
      district: district,
      wardlist: address.distlist?.find((dist) => dist.code === district.code)
        ?.wards,
    });
  };

  const handleUpdateOtherInfo = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      sx={{
        "& .MuiDialog-paper": {
          maxWidth: "1500px",
          maxHeight: "700px",
          width: "fit-content",
        },
      }}
    >
      <DialogTitle>Cập nhật địa chỉ nhận hàng</DialogTitle>
      <DialogContent dividers={true}>
        <div className="flex items-center gap-5 mb-5">
          <TextField
            id="outlined-select-provinces"
            label="Tỉnh thành"
            value={
              address.province
                ? address.province?.code
                : cookies.userInfo.address.province.code
            }
            select
            sx={{
              width: "150px",
              marginY: "10px",
            }}
          >
            <MenuItem value="">--Chọn tỉnh thành--</MenuItem>
            {provinces?.map((prov, index) => (
              <MenuItem
                key={index}
                value={prov.code}
                onClick={() => handleUpdateProv(prov)}
              >
                {prov.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            id="outlined-select-districts"
            label="Quận huyện"
            variant="outlined"
            defaultValue={cookies.userInfo.address.district.code}
            select
            sx={{
              width: "150px",
              marginY: "10px",
            }}
          >
            <MenuItem value="">--Chọn quận huyện--</MenuItem>
            {address?.distlist?.map((dist, index) => (
              <MenuItem
                key={index}
                value={dist.code}
                onClick={() => handleUpdateDist(dist)}
              >
                {dist.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Phường xã"
            variant="outlined"
            name="ward"
            defaultValue={cookies.userInfo.address.ward.code}
            select
            sx={{
              width: "150px",
              marginY: "10px",
            }}
          >
            <MenuItem value="">--Chọn phường xã--</MenuItem>
            {address?.wardlist?.map((ward, index) => (
              <MenuItem
                key={index}
                value={ward.code}
                onClick={() => setAddress({ ...address, ward: ward })}
              >
                {ward.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            id="outlined-basic"
            label="Số nhà, đường"
            variant="outlined"
            name="street"
            value={
              address.street ? address.street : cookies.userInfo.address.street
            }
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
            sx={{
              width: "200px",
              marginY: "10px",
            }}
          />
        </div>

        {/* Btn action */}
        <div className="flex gap-5  mx-auto w-fit">
          <Button
            variant="contained"
            onClick={() => {
              setNewAddress({ ...address });
            }}
            sx={{
              textTransform: "none",
              bgcolor: "#3F41A6",
              width: "120px",

              borderRadius: "20px",
              "&:hover": {
                bgcolor: "#3949AB",
              },
            }}
          >
            Cập nhật
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EditAddress;
