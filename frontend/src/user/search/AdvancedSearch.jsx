import React from "react";
import Navbar from "../../components/Navbar";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useNavigate } from "react-router-dom";
import Filter from "./Filter";
import ItemList from "./ItemList";

function AdvancedSearch() {
  const navigate = useNavigate();
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

      <div className="flex gap-20 items-start px-[125px] my-5">
        <Filter />
        <ItemList />
      </div>
    </div>
  );
}

export default AdvancedSearch;