import React, { useEffect, useState } from "react";
import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  Radio,
  RadioGroup,
  Button,
} from "@mui/material";
import { FaXmark } from "react-icons/fa6";
import axios from "../../api/axios";

function Filter({ open, setOpen, orders, setFilterOrders }) {
  const [studioList, setStudioList] = useState([]);
  const statusList = [
    { label: "Đã đặt", value: "ORDERED" },
    { label: "Đang tiến hành", value: "IN_PROCESS" },
    { label: "Vận chuyển", value: "SHIPPING" },
    { label: "Hoàn thành", value: "COMPLETED" },
    { label: "Hủy đơn", value: "CANCELED" },
  ];
  const [filterStatus, setFilterStatus] = useState([]);
  const [filterStudio, setFilterStudio] = useState([]);
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    axios
      .get("/studio/")
      .then((res) => {
        console.log(res.data);
        setStudioList(res.data.results);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleChangeStatus = (e, value) => {
    if (e.target.checked) {
      let newList = [...filterStatus];
      newList.push(value);
      setFilterStatus(newList);
    } else {
      let newList = filterStatus.filter((status) => status !== value);
      setFilterStatus(newList);
    }
  };

  const handleChangeStudio = (e, studioId) => {
    if (e.target.checked) {
      let newList = [...filterStudio];
      newList.push(studioId);
      setFilterStudio(newList);
    } else {
      let newList = filterStudio.filter((id) => id !== studioId);
      setFilterStudio(newList);
    }
  };

  // Filter List
  const handleFilterOrders = () => {
    let newOrderList = [...orders];

    if (filterStatus?.length > 0) {
      newOrderList = newOrderList.filter((order) =>
        filterStatus.includes(order?.status)
      );
    }
    if (filterStudio?.length > 0) {
      console.log(newOrderList);
      newOrderList = newOrderList.filter((order) =>
        filterStudio.includes(order?.studio.id)
      );
    }
    // if (filter.sort_by !== undefined) {

    // }
    console.log(newOrderList);
    return newOrderList;
  };

  const handleSaveFilter = () => {
    console.log("status", filterStatus);
    console.log("studio", filterStudio);
    console.log("sort by", sortBy);
    setFilterOrders(handleFilterOrders());
    setOpen(false);
  };

  return (
    <Dialog
      sx={{ minWidth: "300px" }}
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <DialogTitle>
        <div className="w-[350px] shadow-sm bg-white flex items-center justify-between gap-16 rounded-lg ">
          <div className="text-indigo-800 text-xl font-semibold leading-9 whitespace-nowrap">
            Bộ lọc
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

      <DialogContent
        dividers={true}
        sx={{ "&::-webkit-scrollbar": { display: "none" } }}
      >
        <div className="flex flex-col gap-4 px-7">
          <div className="flex flex-col gap-2 justify-between  text-base leading-6 ">
            <div className="flex-auto text-[#1A1A1A] text-lg font-medium">
              Trạng thái :
            </div>
            <FormGroup>
              {statusList.map((status, i) => (
                <FormControlLabel
                  key={i}
                  sx={{
                    color: "#666",

                    "& .MuiTypography-root": {
                      fontSize: "14px",
                    },
                  }}
                  control={
                    <Checkbox
                      onChange={(e) => handleChangeStatus(e, status.value)}
                      sx={{
                        "&.Mui-checked": {
                          color: "#3F41A6",
                        },
                      }}
                    />
                  }
                  label={status.label}
                />
              ))}
            </FormGroup>
          </div>

          <div className="flex flex-col gap-2 justify-between  text-base leading-6 ">
            <div className="flex-auto text-[#1A1A1A] text-lg font-medium">
              Nhà cung cấp (Studio) :
            </div>
            <FormGroup>
              {studioList?.length > 0
                ? studioList.map((studio, i) => (
                    <FormControlLabel
                      key={i}
                      sx={{
                        color: "#666",

                        "& .MuiTypography-root": {
                          fontSize: "14px",
                        },
                      }}
                      control={
                        <Checkbox
                          onChange={(e) => handleChangeStudio(e, studio.id)}
                          sx={{
                            "&.Mui-checked": {
                              color: "#3F41A6",
                            },
                          }}
                        />
                      }
                      label={studio.friendly_name}
                    />
                  ))
                : "Chưa có Studio nào!"}
            </FormGroup>
          </div>

          <div className="flex flex-col gap-2 justify-between  text-base leading-6 ">
            <div className="flex-auto text-[#1A1A1A] text-lg font-medium">
              Sắp xếp theo :
            </div>
            <FormControl>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="sort-by"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <FormControlLabel
                  value="newest"
                  control={
                    <Radio
                      sx={{
                        "&.Mui-checked": {
                          color: "#3F41A6",
                        },
                      }}
                    />
                  }
                  label="Mới nhất"
                  sx={{
                    color: "#666",

                    "& .MuiTypography-root": {
                      fontSize: "14px",
                    },
                  }}
                />
                <FormControlLabel
                  value="oldest"
                  control={
                    <Radio
                      sx={{
                        "&.Mui-checked": {
                          color: "#3F41A6",
                        },
                      }}
                    />
                  }
                  label="Cũ nhất"
                  sx={{
                    color: "#666",

                    "& .MuiTypography-root": {
                      fontSize: "14px",
                    },
                  }}
                />
              </RadioGroup>
            </FormControl>
          </div>
        </div>
      </DialogContent>

      <DialogActions>
        <div className="flex gap-5 justify-center mx-auto my-2">
          <Button
            variant="outlined"
            onClick={() => {
              setFilterOrders([]);
              setFilterStatus([]);
              setFilterStudio([]);
              setSortBy("");
            }}
            sx={{
              textTransform: "none",
              border: "1px solid #3F41A6",
              color: "#3F41A6",
              width: "120px",

              borderRadius: "20px",
              "&:hover": {
                border: "1px solid #3949AB",
              },
            }}
          >
            Hủy bộ lọc
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveFilter}
            sx={{
              textTransform: "none",
              bgcolor: "#3F41A6",
              width: "fit-content",
              padding: "5px 20px",
              borderRadius: "20px",
              "&:hover": {
                bgcolor: "#3949AB",
              },
            }}
          >
            Lọc danh sách
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}

export default Filter;
