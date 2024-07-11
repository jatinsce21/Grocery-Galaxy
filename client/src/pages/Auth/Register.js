import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FaSave } from "react-icons/fa";
// import Layout from '../../components/Layout/Layout'

const Register = () => {
  const navigate = useNavigate();

  const islogin = async () => {
    const data = localStorage.getItem("auth");
    if (data) {
      const token = await JSON.parse(data);
      const response = await axios.get(
        "http://localhost:5000/api/v1/auth/user-auth",
        {
          headers: {
            Authorization: `${token.token}`,
          },
        }
      );
      // console.log(response);
      if (response?.data?.ok) {
        navigate("/");
      }
    }
  };
  useEffect(() => {
    islogin();
  });

  const [loading, setloading] = useState(false);
  const [formdata, setformdata] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    answer: "",
  });

  const submitHandler = async (e) => {
    setloading(true);
    e.preventDefault();
    // console.log(formdata);
    try {
      const name = formdata.name;
      const email = formdata.email;
      const password = formdata.password;
      const address = formdata.address.toLowerCase();
      const answer = formdata.answer;
      const role = formdata.role;
      const res = await axios.post(
        "http://localhost:5000/api/v1/auth/register",
        {
          name,
          email,
          password,
          address,
          answer,
          role,
        }
      );
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        setloading(false);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      setloading(false);
    }
  };

  const changeHandler = (event) => {
    setformdata({
      ...formdata,
      [event.target.name]: event.target.value,
    });
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <form
          style={{ background: "#ffffff", padding: "3% 10%" }}
          onSubmit={submitHandler}
        >
          <Stack direction="column" spacing={2}>
            <Box>
              <Typography className="text-border" variant="h4">
                Register
              </Typography>
            </Box>
            <TextField
              required
              name="email"
              type="email"
              id="outlined-basic"
              label="Email"
              placeholder="Email"
              variant="outlined"
              onChange={changeHandler}
              value={formdata.email}
            />
            <TextField
              required
              name="name"
              id="outlined-basic"
              label="Name"
              placeholder="Enter Name"
              type="text"
              variant="outlined"
              onChange={changeHandler}
              value={formdata.name}
            />
            <TextField
              required
              name="address"
              id="outlined-basic"
              label="Address"
              placeholder="Enter Address"
              type="text"
              variant="outlined"
              onChange={changeHandler}
              value={formdata.address}
            />
            {/* <Typography>Enter the name of your favourite Place</Typography>{" "} */}
            <TextField
              required
              name="answer"
              id="outlined-basic"
              label="Your Favourite Place"
              placeholder="For Password Recovery"
              type="text"
              variant="outlined"
              onChange={changeHandler}
              value={formdata.answer}
            />
            <TextField
              required
              name="password"
              id="outlined-basic"
              label="Password"
              placeholder="Password"
              type="password"
              variant="outlined"
              value={formdata.password}
              onChange={changeHandler}
            />
            <Button
              color="success"
              type="submit"
              variant="contained"
              disabled={loading}
              endIcon={!loading && <FaSave />}
            >
              {loading ? <CircularProgress size={24} /> : "Submit"}
            </Button>
            <Typography>
              Already have an Account ?{" "}
              <span
                style={{ color: "blue", cursor: "pointer" }}
                onClick={() => navigate("/login")}
              >
                Login here
              </span>
            </Typography>
          </Stack>
        </form>
      </Box>
    </>
  );
};

export default Register;
