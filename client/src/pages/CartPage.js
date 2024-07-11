import React, { useEffect, useState } from "react";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import toast from "react-hot-toast";
import axios from "axios";
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
  useMediaQuery,
} from "@mui/material";
import { AiOutlineShoppingCart } from "react-icons/ai";

const CartPage = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Calculate total price
  const totalPrice = () => {
    return cart
      .reduce((total, item) => total + item.price, 0)
      .toLocaleString("en-IN");
  };

  // Remove item from cart
  const removeCartItem = (pid) => {
    const updatedCart = cart.filter((item) => item._id !== pid);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Get payment gateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/v1/product/braintree/token"
      );
      setClientToken(data.clientToken);
    } catch (error) {
      toast.error("Failed to get payment token");
    }
  };

  useEffect(() => {
    getToken();
  }, [auth?.token]);

  // Handle payments
  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/product/braintree/payment",
        {
          nonce,
          cart,
        }
      );
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed Successfully");
    } catch (error) {
      toast.error("Payment Failed");
      setLoading(false);
    }
  };

  const matches = useMediaQuery("(min-width:1024px)");

  return (
    <Container>
      <Stack marginBlock={5}>
        <Typography variant="h4" textAlign={"center"}>
          {`Hello ${auth?.token && auth?.user?.name}`}
        </Typography>
        <Typography textAlign={"center"} variant="h6">
          {cart.length
            ? `You have ${cart.length} items in your cart ${
                auth?.token ? "" : "please login to checkout"
              }`
            : "Your Cart Is Empty"}
        </Typography>
      </Stack>
      <Stack
        justifyContent={"center"}
        alignItems={"center"}
        marginBlock={5}
        direction={"row"}
        gap={7}
        flexWrap={"wrap-reverse"}
      >
        <Stack
          direction={"row"}
          flexWrap={"wrap"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={3}
        >
          {cart.map((p) => (
            <Card key={p._id} sx={{ width: 300 }}>
              <CardMedia
                sx={{ height: 150 }}
                image={`http://localhost:5000/api/v1/product/product-photo/${p._id}`}
                title={p.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {p.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {p.description.substring(0, 30)}...
                </Typography>
                <Typography variant="body2">Price: ₹{p.price}</Typography>
              </CardContent>
              <CardActions sx={{ p: 1 }}>
                <Button
                  endIcon={<AiOutlineShoppingCart />}
                  variant="outlined"
                  onClick={() => removeCartItem(p._id)}
                >
                  Remove
                </Button>
              </CardActions>
            </Card>
          ))}
        </Stack>
        {cart.length > 0 && (
          <Stack
            width={!matches ? "100%" : "30%"}
            gap={2}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Typography variant="h4">Cart Summary</Typography>
            <Typography variant="h5">Total | Checkout | Payment</Typography>
            <Typography variant="h5">Total: ₹{totalPrice()}</Typography>
            {auth?.user?.address ? (
              <Stack gap={2} alignItems={"center"}>
                <Typography>Your Current Address</Typography>
                <Typography>{auth?.user?.address}</Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate("/dashboard/user/profile")}
                >
                  Update Address
                </Button>
              </Stack>
            ) : (
              <Box>
                {auth?.token ? (
                  <Button onClick={() => navigate("/dashboard/user/profile")}>
                    Update Address
                  </Button>
                ) : (
                  <Button
                    onClick={() => navigate("/login", { state: "/cart" })}
                  >
                    Please Login to checkout
                  </Button>
                )}
              </Box>
            )}
            <Box>
              {!clientToken || !cart.length ? (
                ""
              ) : (
                <>
                  <DropIn
                    options={{
                      authorization: clientToken,
                      paypal: {
                        flow: "vault",
                      },
                    }}
                    onInstance={(instance) => setInstance(instance)}
                  />
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handlePayment}
                    disabled={loading || !instance || !auth?.user?.address}
                  >
                    {loading ? "Processing ...." : "Make Payment"}
                  </Button>
                </>
              )}
            </Box>
          </Stack>
        )}
      </Stack>
    </Container>
  );
};

export default CartPage;
