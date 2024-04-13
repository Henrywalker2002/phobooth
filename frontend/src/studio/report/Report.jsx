import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import StudioNavbar from "../../components/StudioNavbar";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Widgets from "./Widgets";
import ItemTable from "./ItemTable";
import ComplainTable from "./ComplainTable";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useCookies } from "react-cookie";

function Report() {
  const navigate = useNavigate();
  const [studioInfor, setStudioInfor] = useState({});
  const [cookies, setCookie] = useCookies(["userInfo"]);
  const axiosPrivate = useAxiosPrivate();
  var studioCodeName = cookies?.userInfo?.studio?.code_name;

  useEffect(() => {
    axiosPrivate.get(`/studio/${studioCodeName}`).then((res) => {
      setStudioInfor(res.data);
    }).catch((res) => {
      console.log(res.data);
    });
  }, []);
  return (
    <div>
      <StudioNavbar />
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
          onClick={() => navigate("/studio", { replace: true })}
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
          Báo cáo kinh doanh
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <div className="text-indigo-800 text-2xl font-semibold flex justify-center whitespace-nowrap ">
        Báo cáo kinh doanh
      </div>
      <Widgets studioInfor={studioInfor} setStudioInfor={setStudioInfor}/>
      <div className="w-full flex flex-col gap-5 items-center">
        <ItemTable studioInfor={studioInfor} setStudioInfor={setStudioInfor}/>

        <ComplainTable studioInfor={setStudioInfor}/>
      </div>
    </div>
  );
}

export default Report;
