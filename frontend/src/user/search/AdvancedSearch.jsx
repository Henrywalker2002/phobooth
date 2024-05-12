import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useLocation, useNavigate } from "react-router-dom";
import Filter from "./Filter";
import ItemList from "./ItemList";

function AdvancedSearch() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialFilter = location.state;
  const [filterVal, setFilterVal] = useState({ ...initialFilter });

  useEffect(() => {
    setFilterVal({ ...initialFilter });
    window.scrollTo(0, 0);
  }, []);
  console.log("initial", filterVal);
  return (
    <div>
      <Navbar />

      {/* Breadcumbs */}
      <Breadcrumbs
        separator={
          <NavigateNextIcon fontSize="small" sx={{ color: "#808080" }} />
        }
        aria-label="breadcrumb"
        sx={{
          marginTop: "30px",
          paddingLeft: "120px",
        }}
      >
        <Link
          component="button"
          underline="none"
          key="1"
          sx={{ color: "#808080" }}
          // href="/"
          onClick={() => navigate("/", { replace: true })}
        >
          <HomeOutlinedIcon />
        </Link>

        <Typography
          key="2"
          sx={{
            fontSize: "16px",
            color: "#3F41A6",
            fontWeight: "500",
          }}
        >
          Tìm kiếm nâng cao
        </Typography>
      </Breadcrumbs>

      <div className="flex justify-evenly items-start my-3">
        <Filter filterVal={filterVal} setFilterVal={setFilterVal} />
        <ItemList filterVal={filterVal} initialFilter={initialFilter} />
      </div>
    </div>
  );
}

export default AdvancedSearch;
