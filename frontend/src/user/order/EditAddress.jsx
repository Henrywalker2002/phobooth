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
import axios from "../../api/axios";
import { useLayoutEffect } from "react";

function EditAddress({ open, setOpen, newAdress, setNewAddress }) {
  const [cookies] = useCookies(["accInfo"]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [address, setAddress] = useState({});

  // setup address
  // const setUpInitialAddress = () => {
  //   if (cookies.userInfo.address !== null) {
  //     axios
  //       .get(`province/${cookies.userInfo.address.province.code_name}/`)
  //       .then((res) => {
  //         // console.log(res);
  //         setDistricts(res.data.districts);
  //         return res.data.districts;
  //       })
  //       .then((distlist) => {
  //         setWards(
  //           distlist?.find(
  //             (dist) => dist.code === cookies.userInfo.address.district.code
  //           )?.wards
  //         );
  //       })
  //       .then(() => {
  //         axios
  //           .get("province/?limit=63&offset=0")
  //           .then((res) => {
  //             // console.log(res);
  //             setProvinces(res.data.results);
  //           })
  //           .catch((err) => console.log(err));
  //       })
  //       .then(() => {
  //         setAddress({
  //           street: cookies.userInfo.address.street,
  //           ward: cookies.userInfo.address.ward.code,
  //           district: cookies.userInfo.address.district.code,
  //           province: cookies.userInfo.address.province.code,
  //         });
  //       })
  //       .then(() => console.log(address))
  //       .catch((err) => console.log(err));
  //   }
  // };
  useLayoutEffect(() => {
    axios
      .get("province/?limit=63&offset=0")
      .then((res) => {
        // console.log(res);
        setProvinces(res.data.results);
      })

      .then(() => {
        axios
          .get(`province/${newAdress?.province?.code_name}/`)
          .then((res) => {
            // console.log(res);
            setDistricts(res.data.districts);
            return res.data.districts;
          })
          .then((distlist) => {
            setWards(
              distlist?.find((dist) => dist.code === newAdress.district.code)
                ?.wards
            );
          });
      })
      .catch((err) => console.log(err));
    console.log(address);
    console.log(districts);
    console.log(wards);
  }, [newAdress]);

  const handleUpdateProv = async (prov) => {
    try {
      const res = await axios.get(`province/${prov.code_name}/`);
      // console.log(res);
      setDistricts(res.data.districts);
      setAddress({
        ...address,
        province: prov.code,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateDist = (district) => {
    setWards(
      address.distlist?.find((dist) => dist.code === district.code)?.wards
    );
    setAddress({
      ...address,
      district: district.code,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setDistricts([]);
        setWards([]);
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
            defaultValue={newAdress?.province?.code}
            select
            sx={{
              width: "200px",

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
            defaultValue={newAdress?.district?.code}
            select
            sx={{
              width: "200px",
              marginY: "10px",
            }}
          >
            <MenuItem value="">--Chọn quận huyện--</MenuItem>
            {districts?.map((dist, index) => (
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
            select
            defaultValue={newAdress?.ward?.code}
            sx={{
              width: "200px",
              marginY: "10px",
            }}
          >
            <MenuItem value="">--Chọn phường xã--</MenuItem>
            {wards?.map((ward, index) => (
              <MenuItem
                key={index}
                value={ward.code}
                onClick={() => setAddress({ ...address, ward: ward.code })}
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
            defaultValue={newAdress?.street}
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
              console.log(address);
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
