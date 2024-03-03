import React, { useEffect, useState } from "react";
import {
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Button,
} from "@mui/material";
import { RiSearchLine } from "react-icons/ri";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

function EditItemForPkg({ open, setOpen, type, itemList, setItemList }) {
  let title =
    type == "SERVICE"
      ? "DỊCH VỤ CHÍNH"
      : type == "PRODUCT"
      ? "HÀNG HÓA"
      : "DỊCH VỤ HỖ TRỢ";
  const axiosPrivate = useAxiosPrivate();
  const [selectList, setSelectList] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    setSelected([...itemList]);
  }, [itemList]);

  // selection list
  useEffect(() => {
    let slug = type == "PRODUCT" ? "/item-product/" : "/item-service/";
    axiosPrivate
      .get(slug)
      .then((res) => {
        console.log(res.data.results);
        if (type == "PRODUCT") setSelectList(res.data.results);
        else if (type == "SERVICE")
          setSelectList(
            res.data.results.filter((item) => item.type === "SERVICE")
          );
        else {
          setSelectList(
            res.data.results.filter((item) => item.type === "ACCESSORY")
          );
        }
      })
      .catch((err) => console.log(err));
  }, []);

  //   check selected item in selectList
  const isSelectedItem = (itemId) => {
    const result = itemList?.find((item) => item.id === itemId);
    if (result) return true;
    return false;
  };

  //   add + remove item in selected
  const updateSelectedList = (item) => {
    let newList = [...selected];
    newList.push(item);
    setSelected(newList);
  };

  const removeSelectedList = (id) => {
    const newList = selected.filter((item) => item.id !== id);
    setSelected(newList);
  };

  //   save update list in itemList
  const handleSaveSelected = () => {
    setItemList([...selected]);
    setOpen(false);
    setSelected([]);
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      sx={{
        "& .MuiDialog-paper": {
          maxWidth: "1500px",
          maxHeight: "700px",
        },
      }}
    >
      <DialogTitle>DANH SÁCH {title}</DialogTitle>
      <DialogContent dividers={true}>
        {/* Search */}
        <div className="flex gap-5 items-center w-fit mx-auto my-3">
          <TextField
            id="input-with-icon-textfield"
            placeholder="Tìm kiếm"
            sx={{
              "& .MuiInputBase-input": {
                padding: "10px 12px",
                width: "330px",
                height: "40px",
                boxSizing: "border-box",
              },
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton>
                    <RiSearchLine className="w-5 h-5" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />
        </div>

        {/* Tables */}
        <TableContainer
          component={Paper}
          sx={{
            width: "700px",
            margin: "20px auto",
            border: "1px solid #d6d3d1",
          }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead sx={{ bgcolor: "#E2E5FF" }}>
              <TableRow>
                <TableCell>
                  {/* <Checkbox inputProps={{ "aria-label": "Checkbox demo" }} /> */}
                </TableCell>
                <TableCell sx={{ color: "#3F41A6" }}>{title}</TableCell>

                <TableCell align="left" sx={{ color: "#3F41A6" }}>
                  DANH MỤC
                </TableCell>

                <TableCell align="left" sx={{ color: "#3F41A6" }}>
                  GIÁ (VNĐ)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectList?.length > 0 ? (
                selectList.map((item) => (
                  <TableRow
                    key={item.id}
                    // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell sx={{ width: "42px" }}>
                      <Checkbox
                        onChange={(e) => {
                          e.target.checked
                            ? updateSelectedList(item)
                            : removeSelectedList(item.id);
                        }}
                        disabled={isSelectedItem(item.id)}
                        inputProps={{ "aria-label": "controlled" }}
                        sx={{
                          "&.Mui-checked": {
                            color: "#3F41A6",
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <div className="items-stretch flex gap-5">
                        <img
                          loading="lazy"
                          srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/a97f9876005eb17efc67930c907f0a0f6a644b429c20721808ad7714be271a90?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                          className="aspect-square object-contain object-center w-[50px] overflow-hidden shrink-0 max-w-full"
                        />
                        <div className="text-zinc-900 text-base font-medium leading-6 self-center grow whitespace-nowrap my-auto">
                          {item.name}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell align="left">
                      <div className="w-18 h-7 text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-violet-50 self-stretch aspect-[2.3448275862068964] px-2 py-1">
                        {item.category?.title}
                      </div>
                    </TableCell>
                    {type === "PRODUCT" ? (
                      <TableCell align="left">{item.fixed_price}</TableCell>
                    ) : (
                      <TableCell align="left">
                        {item.min_price} - {item.max_price}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell>No Item</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Btn action */}
        <div className="flex gap-5 my-5 mx-auto w-fit">
          <Button
            variant="outlined"
            onClick={() => setOpen(false)}
            sx={{
              textTransform: "none",
              border: "1px solid #3F41A6",
              color: "#3F41A6",
              width: "80px",

              borderRadius: "20px",
              "&:hover": {
                border: "1px solid #3949AB",
              },
            }}
          >
            Hủy
          </Button>

          <Button
            variant="contained"
            onClick={() => handleSaveSelected()}
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
            Lưu thay đổi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EditItemForPkg;
