import React, { useEffect, useState } from 'react';
import { Box, Typography, styled, Rating, Grid, Avatar, Button, Pagination } from "@mui/material";
import axios from '../api/axios';

// Styled button component
const StyledButton = styled('button')(({ selected }) => ({
  color: selected ? "#3F41A6" : "#6b7280",
  backgroundColor: "transparent",
  borderBottom: selected ? "3px solid #3F41A6" : "none",
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

const handleDate = (date) => {
  const newDate = new Date(date);
  return newDate.toLocaleDateString();

}

const rateComponent = (rate) => {
  return (
    <Box sx={{ padding: "20px", borderBottom: "1px solid #808080" }}>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ marginRight: 1 }} srcSet={rate.user?.avatar} />
          <Grid container direction="column">
            <Typography variant="body1" >{rate.user?.full_name}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', marginBottom: 1 }}>{handleDate(rate.created_at)}</Typography>
          </Grid>
          <Typography variant="h6" style={{ color: "#3F41A6", marginRight: "10px" }}>{rate.star}</Typography>
          <Rating value={rate.star} readOnly sx={{ marginLeft: 'auto', color: "#3F41A6" }} />
        </Box>
        <Typography variant="body2" sx={{ marginTop: 1 }}>{rate.comment}</Typography>
      </Box>
    </Box>
  )
}

function RateOfItem({ item_id, star, description }) {
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
    <Box sx={{ padding: "10px 10vh", position: "relative", zIndex: "0" }}>
      {/* Div bao bọc chứa các button và đường gạch chân */}
      <ButtonWrapper>
        {/* Mỗi button sử dụng component StyledButton */}
        <StyledButton selected={selectedButton === 'description'} onClick={handleDescriptionClick}>Mô tả</StyledButton>
        <StyledButton selected={selectedButton === 'info'} onClick={handleInfoClick}>Thông tin</StyledButton>
        <StyledButton selected={selectedButton === 'rating'} onClick={handleRatingClick}>Đánh giá</StyledButton>
      </ButtonWrapper>
      <div>
        {selectedButton === 'description' && <Description description={description}/>}
        {selectedButton === 'info' && <Info />}
        {selectedButton === 'rating' && <Rated star={star} item_id={item_id} />}
      </div>
    </Box>
  );
}

// Component hiển thị khi các nút được chọn
function Description({description}) {
  if (!description) return (<Box></Box>);
  let array = description.split("\n");
  return (
    <Box sx={{ padding: "30px 0" }}> 
      {array.map((text) => {
        return (
          <Title1>
            {text}
          </Title1>
        )
      })}
    </Box>
  );
}

function Info() {
  return (
    <Box sx={{ padding: "30px 0" }}>
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

function Rated({ star, item_id }) {
  const averageRating = star;
  const [rates, setRates] = useState([]);
  const limit = 3;
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [count, setCount] = useState(0);
  const [starFilter, setStarFilter] = useState(null);
  useEffect(() => {
    const params = starFilter ? { star: starFilter } : {};
    axios.get(`rate/?item_id=${item_id}&limit=${limit}&offset=${(page - 1) * 10}/`, {params : params})
      .then((res) => {
        setRates(res.data.results)
        setTotalPage(Math.ceil(res.data.count / limit))
        setCount(res.data.count)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [page, starFilter])

  // Hàm xử lý khi người dùng chọn rating từ 1 đến 5 sao
  const handleRatingSelect = (rating) => {
    // Xử lý khi người dùng chọn một rating cụ thể
    let star = rating[0];
    if (rating === "Tất cả") {
      setStarFilter(null);
    }
    else {
      star = parseInt(star);
      setStarFilter(star);
    }
  };
  return (
    <Box sx={{ padding: "30px 0" }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {/* Phần bên trái với thông tin về rating */}
          <Box sx={{ padding: "20px" }}>
            <Grid container style={{ display: "flex", alignItems: "center", marginBottom: "20px", paddingLeft: "15px" }}>
              <Grid sx={2} md={0.7}>
                <Typography variant="h6" style={{ color: "#3F41A6" }}>{averageRating}</Typography>
              </Grid>
              <Grid sx={2} md={6.5}>
                <Rating
                  name="text-feedback"
                  value={averageRating}
                  readOnly
                  precision={0.5}
                  style={{ color: "#3F41A6" }}
                />
              </Grid>
              <Grid sx={2} md={3}>
                <Typography variant="h6">{count} đánh giá</Typography>
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
                {["4 sao", "5 sao", "Tất cả"].map((rating) => (
                  <ButRate key={rating} onClick={() => handleRatingSelect(rating)}>
                    {rating}
                  </ButRate>
                ))}
              </Box>
            </Box>

          </Box>
        </Grid>
        <Grid item xs={12} md={6} >
          {/* Bắt đầu map */}
          {rates.map((rate) => {
            return rateComponent(rate);
          })}
          {/*Kết thúc map */}
          <Box sx={{ marginTop: "10px", justifyContent: "center", display: "flex" }}>
            <Pagination
              count={totalPage} // Tổng số trang
              page={page} // Trang hiện tại
              onChange={(event, value) => { setPage(value) }}
              variant="outlined" // Kiểu hiển thị (outlined hoặc standard)
              sx={{ "& .Mui-selected": { backgroundColor: '#3F41A6', color: "#fff" } }}
            />
          </Box>
        </Grid>

      </Grid>
    </Box>
  );
}

export default RateOfItem;
