import React, { useState, useEffect } from "react";

import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AdminMenu from "../../components/Layout/AdminMenu";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Stack,
  Typography,
} from "@mui/material";
const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  //getall products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/v1/product/get-product");
      setProducts(data.products);
    } catch (error) {
      // console.log(error);
      toast.error("Someething Went Wrong");
    }
  };

  //lifecycle method
  useEffect(() => {
    getAllProducts();
  }, []);
  return (
    <>
      <Container>
        <Stack
          marginBlock={5}
          direction={"row"}
          alignItems={"center"}
          justifyContent={"center"}
          flexWrap={"wrap"}
          gap={5}
        >
          <AdminMenu />

          <Stack
            width={"60%"}
            marginBlock={2}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Box
              sx={{
                overflow: "scroll",
                textAlign:"center",
                
              }}
              height={"80vh"}
              width={"100%"}
            >
            <Typography variant="h5" textAlign={"center"}>All Products</Typography>
              {products?.map((p) => (
                <Card s sx={{ maxWidth: 400, marginBlock: 2 }}>
                  <CardMedia
                    sx={{ height: 150 }}
                    image={`http://localhost:5000/api/v1/product/product-photo/${p._id}`}
                    title="Product Image"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {p.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {p.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      onClick={() =>
                        navigate(`/dashboard/admin/product/${p.slug}`)
                      }
                    >
                      View
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Box>
          </Stack>
        </Stack>
      </Container>
    
    </>
  );
};

export default Products;
