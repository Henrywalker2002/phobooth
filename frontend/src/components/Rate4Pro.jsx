import React, { useState } from 'react';
import { Box, Typography, styled, Rating, Grid, Avatar, Button, Pagination } from "@mui/material";
// import { styled } from "@mui/system";

// Styled button component
const StyledButton = styled('button')(({ selected }) => ({
  color: selected ? "#3F41A6" : "#6b7280",
  backgroundColor: "transparent",
  borderBottom: selected? "3px solid #3F41A6" : "none",
  cursor: "pointer",
  "&:hover": {
    color: "#3F41A6",
  },
  fontSize: "25px",
  fontWeight: "600",
  padding: "0px 50px",
  zIndex: "0", // Đảm bảo phần border-bottom của button đè lên phần của box
}));

// Styled wrapper div for buttons
const ButtonWrapper = styled('div')({
  borderBottom: "2px solid #6b7280",
  position: "relative", // Đảm bảo phần border-bottom của button đè lên phần của box
});
const Title1 = styled(Typography)({
    fontSize: "22px",
    fontWeight: 500
})
const Title2 = styled(Typography)({
    fontSize: "22px",
    fontWeight: 400,
    color: "#808080",
    paddingTop: "20px",
    lineHeight: "27px"
})
const ButRate = styled(Button)({
    border: "1px solid #3f41a6",
    borderRadius: "4px",
    backgroundColor: "#f6f5fb",
    color: "#3f41a6",
    fontSize: "16px",
    fontWeight: "700",
    textTransform: "none",
    width: "120px",
    margin: "0 2vh 0 2vh"
})

function Rate4Pro() {
  const [selectedButton, setSelectedButton] = useState('description');

  // Các hàm xử lý khi nhấn các nút
  const handleDescriptionClick = () => {
    setSelectedButton('description');
  };

  const handleInfoClick = () => {
    setSelectedButton('info');
  };

  const handleRatingClick = () => {
    setSelectedButton('rating');
  };

  return (
    <Box sx={{padding: "10px 10vh", position: "relative", zIndex: "0"}}>
      {/* Div bao bọc chứa các button và đường gạch chân */}
      <ButtonWrapper>
        {/* Mỗi button sử dụng component StyledButton */}
        <StyledButton selected={selectedButton === 'description'} onClick={handleDescriptionClick}>Mô tả</StyledButton>
        <StyledButton selected={selectedButton === 'info'} onClick={handleInfoClick}>Thông tin</StyledButton>
        <StyledButton selected={selectedButton === 'rating'} onClick={handleRatingClick}>Đánh giá (100)</StyledButton>
      </ButtonWrapper>
      <div>
        {selectedButton === 'description' && <Description />}
        {selectedButton === 'info' && <Info />}
        {selectedButton === 'rating' && <Rated />}
      </div>
    </Box>
  );
}

// Component hiển thị khi các nút được chọn
function Description() {
  return (
    <Box sx={{padding: "30px 0"}}>
        <Title1>
            Maecenas lacinia felis nec placerat sollicitudin. Quisque placerat dolor at scelerisque imperdiet. Phasellus tristique felis dolor.
        </Title1>
        <Title2>
        Mauris pretium elit a dui pulvinar, in ornare sapien euismod. Nullam interdum nisl ante, id feugiat quam euismod commodo. Sed ultrices lectus ut iaculis rhoncus. Aenean non dignissim justo, at fermentum turpis. Sed molestie, ligula ut molestie ultrices, tellus ligula viverra neque, malesuada consectetur diam sapien volutpat risus.
Quisque eget tortor lobortis, facilisis metus eu, elementum est. Nunc sit amet erat quis ex convallis suscipit. ur ridiculus mus.
        </Title2>
    </Box>
  );
}

function Info() {
  return (
    <Box sx={{padding: "30px 0"}}>
        <Title1>
            Maecenas lacinia felis nec placerat sollicitudin. Quisque placerat dolor at scelerisque imperdiet. Phasellus tristique felis dolor.
        </Title1>
        <Title2>
        Mauris pretium elit a dui pulvinar, in ornare sapien euismod. Nullam interdum nisl ante, id feugiat quam euismod commodo. Sed ultrices lectus ut iaculis rhoncus. Aenean non dignissim justo, at fermentum turpis. Sed molestie, ligula ut molestie ultrices, tellus ligula viverra neque, malesuada consectetur diam sapien volutpat risus.
        Quisque eget tortor lobortis, facilisis metus eu, elementum est. Nunc sit amet erat quis ex convallis suscipit. ur ridiculus mus.
        </Title2>
    </Box>
  );
}

function Rated() {
    const averageRating = 4.5;
  const totalReviews = 100;

  // Hàm xử lý khi người dùng chọn rating từ 1 đến 5 sao
  const handleRatingSelect = (rating) => {
    // Xử lý khi người dùng chọn một rating cụ thể
  };
  return (
    <Box sx={{padding: "30px 0"}}>
        <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        {/* Phần bên trái với thông tin về rating */}
        <Box sx={{ padding: "20px" }}>
            <Grid  container style={{display: "flex", alignItems: "center", marginBottom: "20px", paddingLeft: "15px"}}>
                <Grid sx={2} md={0.7}>
                    <Typography variant="h6" style={{color: "#3F41A6"}}>{averageRating}</Typography>
                </Grid>
                <Grid sx={2} md={6.5}>
                    <Rating
                        name="text-feedback"
                        value={averageRating}
                        readOnly
                        precision={0.5}
                        style={{color: "#3F41A6"}}
                    />
                </Grid>
                <Grid sx={2} md={3}>
                    <Typography variant="h6">100 đánh giá</Typography>
                </Grid>
            </Grid>
          {/* Button cho mỗi rating từ 1 đến 5 */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", width: "80%", marginBottom: "20px" }}>
                {["1 sao", "2 sao", "3 sao"].map((rating) => (
                <ButRate key={rating} onClick={() => handleRatingSelect(rating)}>
                    {rating} 
                </ButRate>
                ))}
            </Box>          
            <Box sx={{ display: "flex", justifyContent: "space-between", width: "80%" }}>
                {["4 sao" ,"5 sao", "Tất cả"].map((rating) => (
                <ButRate key={rating} onClick={() => handleRatingSelect(rating)}>
                    {rating} 
                </ButRate>
                ))}
            </Box>
            </Box>

        </Box>
      </Grid>
      <Grid item xs={12} md={6} >
        <Box sx={{ padding: "20px", borderBottom: "1px solid #808080"}}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ marginRight: 1 }} />
                <Grid container direction="column">
                    <Typography variant="body1" >John Doe</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', marginBottom: 1 }}>Ngày đánh giá</Typography>
                </Grid>
                <Typography variant="h6" style={{color: "#3F41A6", marginRight: "10px"}}>5</Typography>
                <Rating value={5} readOnly sx={{ marginLeft: 'auto', color: "#3F41A6" }} />
                </Box>
                <Typography variant="body2" sx={{ marginTop: 1 }}>Great product!</Typography>
            </Box>
        </Box>
        {/* Bắt đầu map */}
        <Box sx={{ padding: "20px", borderBottom: "1px solid #808080"}}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ marginRight: 1 }} />
                <Grid container direction="column">
                    <Typography variant="body1" >John Doe</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', marginBottom: 1 }}>Ngày đánh giá</Typography>
                </Grid>
                <Typography variant="h6" style={{color: "#3F41A6", marginRight: "10px"}}>5</Typography>
                <Rating value={5} readOnly sx={{ marginLeft: 'auto', color: "#3F41A6" }} />
                </Box>
                <Typography variant="body2" sx={{ marginTop: 1 }}>Great product!</Typography>
            </Box>
        </Box>
        {/*Kết thúc map */}
            <Box sx={{marginTop: "10px", justifyContent: "center", display: "flex"}}>
                <Pagination
                    count={3} // Tổng số trang
                    page={1} // Trang hiện tại
                    variant="outlined" // Kiểu hiển thị (outlined hoặc standard)
                    sx={{ "& .Mui-selected": { backgroundColor: '#3F41A6', color: "#fff" } }}
                />
            </Box>        
        </Grid>
       
        </Grid>        
    </Box>
  );
}

export default Rate4Pro;
