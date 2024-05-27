import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Alert, Button, Snackbar } from "@mui/material";
import { FaArrowRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import Err401Dialog from "../../components/Err401Dialog";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Carousel from "./Carousel";
import ItemCard from "../../components/ItemCard";
import { useCookies } from "react-cookie";

function Home() {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const list2 = ["Phổ biến", "Đề xuất", "Gần đây"];

  const [itemList, setItemList] = useState([]);

  const [openErr401, setOpenErr401] = useState(false);
  const [openSBar, setOpenSBar] = useState(false);
  const [cookies] = useCookies(["accInfo"]);
  console.log(cookies);

  if (cookies.accInfo) {
    if (cookies.accInfo.role[0].code_name === "admin") {
      navigate("/admin");
    }
  }

  useEffect(() => {
    axios
      .get("/item/?limit=4&offset=0")
      .then((res) => setItemList(res.data.results))
      .catch((err) => console.log(err));
  }, []);

  // Add to cart
  const handleAddToCart = (id) => {
    axiosPrivate
      .post(
        "/cart/",
        { item: id, number: 1 },
        {
          headers: {
            ...axiosPrivate.defaults.headers,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        // console.log(res);
        setOpenSBar(true);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 401) setOpenErr401(true);
      });
  };

  // Close SnackBar Success
  const handleCloseSBar = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSBar(false);
  };

  return (
    <div>
      <Navbar />

      {/* content */}
      <Carousel handleAddToCart={handleAddToCart} />

      {/* Các danh sách */}
      <div className="my-10 flex flex-col gap-10 max-sm:hidden">
        {list2.map((item, index) => (
          <div className="flex flex-col items-center" key={index}>
            <div className="justify-between items-stretch flex w-[90%] gap-5 pl-5">
              <div className="text-zinc-900 text-2xl font-semibold leading-10">
                {item}
              </div>
              <div className="justify-center items-stretch flex gap-3 rounded-[43px] self-start">
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
                  }}
                >
                  Xem tất cả
                </Button>
              </div>
            </div>
            <div className="w-[90%] mt-2 px-5">
              <div className="flex justify-between">
                {itemList.map((item, index) => (
                  <ItemCard
                    key={index}
                    item={item}
                    handleAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add to cart successfully */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openSBar}
        autoHideDuration={2000}
        onClose={handleCloseSBar}
      >
        <Alert
          onClose={handleCloseSBar}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Đã thêm vào giỏ hàng !
        </Alert>
      </Snackbar>

      {/* Err 401 Dialog */}
      <Err401Dialog open={openErr401} setOpen={setOpenErr401} />

      <Footer />
    </div>
  );
}

export default Home;
