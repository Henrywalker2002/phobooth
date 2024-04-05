import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  MenuItem,

  IconButton,
} from "@mui/material";
import axios from "../../api/axios";
import { FaXmark } from "react-icons/fa6";

function EditAddress({ open, setOpen, address, handleUpdateAddress }) {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [newAddress, setNewAddress] = useState({});

  // setup address
  useEffect(() => {

    axios
      .get("province/?limit=63&offset=0")
      .then((res) => {
        // console.log(res);
        setProvinces(res.data.results);
      })

      .then(() => {
        axios

          .get(`province/${address?.province?.code_name}/`)

          .then((res) => {
            // console.log(res);
            setDistricts(res.data.districts);
            return res.data.districts;
          })
          .then((distlist) => {
            setWards(

              distlist?.find((dist) => dist.code === address.district.code)
                ?.wards
            );
          });
      })

      .then(() => {
        setNewAddress({
          ...address,
        });
      })
      .catch((err) => console.log(err));
    console.log(address);
    console.log(districts);
    console.log(wards);

  }, []);


  const handleUpdateProv = async (prov) => {
    try {
      const res = await axios.get(`province/${prov.code_name}/`);
      // console.log(res);
      setDistricts(res.data.districts);

      setNewAddress({
        ...newAddress,
        province: prov,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateDist = (district) => {

    setWards(districts?.find((dist) => dist.code === district.code)?.wards);
    setNewAddress({
      ...newAddress,
      district: district,
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

      <DialogTitle>
        <div className=" shadow-sm bg-white flex items-center justify-between gap-16 rounded-lg ">
          <div className="text-indigo-800 text-xl font-semibold leading-9 whitespace-nowrap">
            Cập nhật địa chỉ nhận hàng
          </div>
          <IconButton
            onClick={() => {
              setOpen(false);
            }}
          >
            <FaXmark />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent dividers={true}>
        <div className="flex items-center gap-5 mb-5">
          <TextField
            id="outlined-select-provinces"
            label="Tỉnh thành"
            defaultValue={address?.province?.code}
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
            defaultValue={address?.district?.code}
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
            defaultValue={address?.ward?.code}
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
                onClick={() => setNewAddress({ ...newAddress, ward: ward })}
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
            defaultValue={address?.street}
            onChange={(e) =>
              setNewAddress({ ...newAddress, street: e.target.value })
            }
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
              handleUpdateAddress(newAddress);
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
