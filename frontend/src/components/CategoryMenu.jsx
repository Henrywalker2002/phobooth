import { Button, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";

export function CategoryMenu({ categories, handleClose, anchorEl }) {
  const navigate = useNavigate();

  const handleClick = (code_name) => {
    handleClose();
    navigate("/advanced-search", { state: { category: code_name }, replace: true});
  }

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
      {categories.map((category) => (
        <MenuItem key={category.id} onClick={() => handleClick(category.code_name)}>
          {category.title}
        </MenuItem>
      ))}
    </Menu>
  );
}