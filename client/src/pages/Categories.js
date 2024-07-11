import { useNavigate } from "react-router-dom";
import useCategory from "../hooks/useCategory";
import { Box, Button, Grid, Typography } from "@mui/material";

const Categories = () => {
  const navigate = useNavigate();
  const categories = useCategory();

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f4f4f4",
      }}
    >
      <Box sx={{ width: "80%" }}>
        <Grid
          container
          spacing={3}
          alignItems="center"
          justifyContent="center"
        >
          {categories.map((c) => (
            <Grid item xs={12} sm={6} md={4} key={c.slug}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ height: "100%", fontSize: "1.5rem" }}
                onClick={() => navigate(`/category/${c.slug}`)}
              >
                <Typography sx={{ fontWeight: "bold" }}>
                  {c.name}
                </Typography>
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Categories;
