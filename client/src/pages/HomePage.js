import React, { useState, useEffect } from "react";

import axios from "axios";
// import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import toast from "react-hot-toast";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import { AiOutlineArrowRight, AiOutlineShoppingCart } from "react-icons/ai";

const HomePage = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useCart();
  const [auth, setauth] = useAuth();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  //get all cat
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/v1/category/all-category");
      if (data?.success) {
        setCategories(data?.allCategories);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  //get products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:5000/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      // console.log(error);
    }
  };

  //getTOtal COunt
  const getTotal = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/v1/product/product-count");
      setTotal(data?.total);
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);
  //load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:5000/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      // console.log(error);
      setLoading(false);
    }
  };

  // filter by cat

  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };
  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  const filterProduct = async () => {
    try {
      const { data } = await axios.post("http://localhost:5000/api/v1/product/product-filters", {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      
    }
  };
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      // console.log(error);
    }
  };
  return (
    <>
      <Stack direction={"row"} m={2} flexWrap={"wrap"}>
        <Stack mr={10} mt={5} gap={3}>
          <Stack>
            <Typography sx={{ color: "green" }} marginBlock={3}>
              Filter By Category
            </Typography>
            {categories?.map((c) => (
              <FormControlLabel
              key={c.name}
                control={
                  <Checkbox
                    key={c._id}
                    onChange={(e) => handleFilter(e.target.checked, c._id)}
                  />
                }
                label={c.name}
              />
            ))}
          </Stack>

          <Stack>
           
          </Stack>

          <Button
            variant="contained"
            color="error"
            // onClick={() => setChecked([])}
            onClick={() => window.location.reload()}
          >
            RESET FILTERS
          </Button>
        </Stack>

        <Container sx={{ justifyContent: "center" }}>
          {" "}
          <Typography mt={5} variant="h3" textAlign={"center"}>
            All Products
          </Typography>{" "}
          <Stack
            mt={5}
            direction={"row"}
            gap={7}
            flexWrap={"wrap"}
            alignItems={"center"}
          >
            {products?.map((p) => (
              <Card sx={{ width: 300 ,p:3}} key={p._id}>
                <CardMedia
                  sx={{ height: 150 }}
                  image={`http://localhost:5000/api/v1/product/product-photo/${p._id}`}
                  title={p.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {p.name}
                  </Typography>
                  <Typography gutterBottom component="div">
                    Price : ₹ {p.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {p.description.substring(0, 50)}...
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 1 }}>
                  <Button
                    variant="outlined"
                    endIcon={<AiOutlineArrowRight/>}
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    Details
                  </Button>
                  {auth?.token && (
                    <>
                      {cart.some((item) => item._id === p._id) ? (
                        <Button
                          variant="contained"
                          // endIcon={cart}
                          endIcon={<AiOutlineShoppingCart />}
                          onClick={() => {
                            removeCartItem(p._id);
                          }}
                        >
                          REMOVE
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          endIcon={<AiOutlineShoppingCart />}
                          onClick={() => {
                            setCart([...cart, p]);
                            localStorage.setItem(
                              "cart",
                              JSON.stringify([...cart, p])
                            );
                            toast.success("Item added to cart");
                          }}
                        >
                          ADD
                        </Button>
                      )}
                    </>
                  )}
                </CardActions>
              </Card>
            ))}
          </Stack>
          {products && products.length < total && (
            <Button
              sx={{ marginTop: 3 }}
              variant="outlined"
              onClick={(e) => {
                e.preventDefault();
                setPage(page + 1);
              }}
            >
              {loading ? "Loading ..." : "More"}
            </Button>
          )}
        </Container>
     </Stack>

    </>
  );
};

export default HomePage;
