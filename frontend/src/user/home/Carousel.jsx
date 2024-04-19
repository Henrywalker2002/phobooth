import {
  Box,
  CircularProgress,
  IconButton,
  MobileStepper,
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import { RiSearchLine } from "react-icons/ri";
import AddIcon from "@mui/icons-material/Add";
import { FaArrowRight } from "react-icons/fa6";
import ItemPage from "./ItemPage";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

function Carousel({ handleAddToCart }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [countStep, setCountStep] = useState(1);
  const [itemList, setItemList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(""); //code_name

  const handleGetItems = async (category) => {
    setIsLoading(true);
    setActiveStep(0);
    setActiveCategory(category);
    try {
      const res = await axios.get(
        `/item/?limit=6&offset=0&category=${category}`
      );
      console.log(res.data);
      let count =
        Math.floor(res.data.count / 6) < 1
          ? 1
          : Math.floor(res.data.count / 6) > 3
          ? 3
          : Math.floor(res.data.count / 6);
      // console.log(count, activeStep);
      setCountStep(count);

      setItemList(res.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleGetCategory = async () => {
      try {
        let res = await axios.get("/category");
        // console.log(res.data);
        setCategories(res.data.results);
        await handleGetItems(res.data.results[0]?.code_name);
      } catch (error) {
        console.log(error);
      }
    };
    handleGetCategory();
  }, []);

  const handleNext = () => {
    if (itemList.next !== null) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      axios
        .get(itemList.next)
        .then((res) => {
          console.log(res.data);
          let currcount =
            Math.floor(res.data.count / 6) < 1
              ? 1
              : Math.floor(res.data.count / 6) > 3
              ? 3
              : Math.floor(res.data.count / 6);
          if (currcount !== countStep) setCountStep(currcount);
          console.log(countStep, activeStep);
          setItemList(res.data);
        })
        .catch((err) => console.log(err));
    }
  };

  const handleBack = () => {
    if (itemList.previous !== null) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
      axios
        .get(itemList.previous)
        .then((res) => {
          console.log(res.data);
          let currcount =
            Math.floor(res.data.count / 6) < 1
              ? 1
              : Math.floor(res.data.count / 6) > 3
              ? 3
              : Math.floor(res.data.count / 6);
          if (currcount !== countStep) setCountStep(currcount);
          console.log(countStep, activeStep);
          setItemList(res.data);
        })
        .catch((err) => console.log(err));
    }
  };
  return (
    <div className="bg-indigo-200 flex flex-col items-center px-5 max-sm:hidden">
      <div className="w-full max-w-[1320px] mt-10 mb-14">
        <div className="gap-5 flex">
          <div className="flex flex-col justify-center items-stretch w-[18%]">
            <Button
              variant="contained"
              startIcon={<RiSearchLine className="w-5 h-5 mx-auto" />}
              onClick={() => navigate("/advanced-search/")}
              sx={{
                marginX: "auto",
                marginBottom: "20px",
                textTransform: "none",
                bgcolor: "#3F41A6",
                width: "fit-content",
                paddingX: "20px",
                borderRadius: "20px",
                "&:hover": {
                  bgcolor: "#3949AB",
                },
              }}
            >
              Tìm kiếm nâng cao
            </Button>
            <Paper>
              <MenuList dense sx={{ padding: 0 }}>
                {categories.length > 0
                  ? categories.map((category) => (
                      <MenuItem
                        key={category.id}
                        onClick={() => handleGetItems(category.code_name)}
                        sx={{
                          height: "50px",
                          "&:hover": {
                            bgcolor: "#99A3FF",
                          },
                          bgcolor:
                            activeCategory === category.code_name
                              ? "#99A3FF"
                              : "",
                        }}
                      >
                        <ListItemText inset>{category.title}</ListItemText>
                      </MenuItem>
                    ))
                  : "Empty"}

                <Divider />
                <MenuItem
                  sx={{ height: "50px" }}
                  onClick={() => navigate("/advanced-search/")}
                >
                  <ListItemIcon>
                    <AddIcon fontSize="medium" />
                  </ListItemIcon>
                  <ListItemText>Xem tất cả danh mục</ListItemText>
                </MenuItem>
              </MenuList>
            </Paper>
          </div>
          <div className="flex flex-col items-stretch w-[1000px] ml-5">
            <div className="flex flex-col">
              <div className="justify-center items-stretch flex max-w-full gap-3 mr-16 rounded-[43px] self-end">
                <Button
                  endIcon={
                    <FaArrowRight style={{ width: "18px", height: "18px" }} />
                  }
                  onClick={() => navigate("/advanced-search/")}
                  sx={{
                    textTransform: "none",
                    color: "#3F41A6",
                    width: "140px",
                    height: "35px",
                    borderRadius: "5px",
                    fontSize: "15px",
                    "&:hover": {
                      color: "#1A237E",
                      bgcolor: "transparent",
                    },
                    marginBottom: "20px",
                  }}
                >
                  Xem tất cả
                </Button>
              </div>

              {isLoading ? (
                <CircularProgress color="inherit" />
              ) : (
                <div className="flex flex-col  gap-5">
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      alignContent: "center",
                      justifyContent: "center",
                      height: "450px",
                    }}
                  >
                    <IconButton
                      sx={{
                        margin: 3,
                        "&:hover": {
                          bgcolor: "#E6E6E6",
                        },
                      }}
                      onClick={handleBack}
                      disabled={activeStep === 0}
                    >
                      <KeyboardArrowLeftOutlinedIcon />
                    </IconButton>

                    {/* Items */}
                    <ItemPage
                      itemList={itemList.results}
                      handleAddToCart={handleAddToCart}
                    />

                    <IconButton
                      sx={{
                        margin: 3,
                        "&:hover": {
                          bgcolor: "#E6E6E6",
                        },
                      }}
                      onClick={handleNext}
                      disabled={activeStep === countStep - 1}
                    >
                      <KeyboardArrowRightOutlinedIcon />
                    </IconButton>
                  </Box>

                  {/* pagination */}
                  <MobileStepper
                    variant="dots"
                    steps={countStep ? countStep : 1}
                    position="static"
                    activeStep={activeStep}
                    sx={{
                      bgcolor: "transparent",
                      width: "fit-content",
                      margin: "0 auto",
                      color: "#3F41A6",
                      ".css-26w9jf-MuiMobileStepper-dot": {
                        bgcolor: "#3F41A6",
                      },
                      marginTop: "20px",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Carousel;
