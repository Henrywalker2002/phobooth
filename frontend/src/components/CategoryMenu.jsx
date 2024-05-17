import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import AutoFixHighOutlinedIcon from "@mui/icons-material/AutoFixHighOutlined";
import VideoCameraBackOutlinedIcon from "@mui/icons-material/VideoCameraBackOutlined";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { useState } from "react";

export function CategoryMenu({ categories, handleClose, anchorEl }) {
  const navigate = useNavigate();
  console.log(categories);

  const handleClick = (code_name) => {
    handleClose();
    navigate("/advanced-search", {
      state: { category: code_name },
      replace: true,
    });
  };

  const CategoryMenuChild = ({ childList }) => {
    const [anchorChild, setAnchorChild] = useState(null);
    const handleClickChild = (event) => {
      setAnchorChild(event.currentTarget);
    };

    const handleCloseChild = () => {
      setAnchorChild(null);
    };
    return (
      <div>
        <IconButton>
          <ArrowRightIcon fontSize="small" onClick={handleClickChild} />
        </IconButton>

        <Menu
          id="category-menu-child"
          anchorEl={anchorChild}
          open={Boolean(anchorChild)}
          onClose={() => handleCloseChild()}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          {childList.map((category, i) => (
            <MenuItem key={i} onClick={() => handleClick(category.code_name)}>
              <ListItemIcon sx={{ color: "#3F41A6" }}>
                <FiberManualRecordIcon sx={{ height: 13, width: 13 }} />
              </ListItemIcon>
              <ListItemText sx={{ minWidth: "150px" }}>
                {category.title}
              </ListItemText>
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  };

  return (
    <Menu
      id="category-menu"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={() => handleClose()}
      MenuListProps={{
        "aria-labelledby": "basic-button",
      }}
    >
      {categories.map((category, i) => (
        <MenuItem
          key={i}
          onClick={() => {
            if (category.categories.length <= 1)
              handleClick(category.categories[0].code_name);
          }}
        >
          <ListItemIcon sx={{ color: "#3F41A6" }}>
            {category.label === "Chụp ảnh" ? (
              <CameraAltOutlinedIcon fontSize="small" />
            ) : category.label === "In ảnh" ? (
              <PrintOutlinedIcon fontSize="small" />
            ) : category.label === "Sửa ảnh" ? (
              <AutoFixHighOutlinedIcon fontSize="small" />
            ) : category.label === "Quay phim" ? (
              <VideoCameraBackOutlinedIcon fontSize="small" />
            ) : category.label === "Danh mục khác" ? (
              <WidgetsOutlinedIcon fontSize="small" />
            ) : category.label === "Hàng hóa" ? (
              <Inventory2OutlinedIcon fontSize="small" />
            ) : null}
          </ListItemIcon>
          <ListItemText sx={{ minWidth: "150px" }}>
            {category.label}
          </ListItemText>
          {category.categories.length > 1 && (
            <CategoryMenuChild childList={category.categories} />
          )}
        </MenuItem>
      ))}
    </Menu>
  );
}
