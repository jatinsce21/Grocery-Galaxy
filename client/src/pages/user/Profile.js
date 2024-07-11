import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../../context/auth";
import UserMenu from "../../components/Layout/UserMenu";
import { Box, Button, Container, Paper, Stack, TextField, Typography } from "@mui/material";
import { FaSave } from "react-icons/fa";
const Profile = () => {
  //context
  const [auth, setAuth] = useAuth();
  //state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  //get user data
  useEffect(() => {
    const { email, name, phone, address } = auth?.user;
    setName(name);
    setPhone(phone);
    setEmail(email);
    setAddress(address);
  }, [auth?.user]);

  // form function
  const handleSubmit = async (e) => {

    e.preventDefault();
    
    if(name==="" || address==="" ){
      toast.error("All fields are required")
      return ;
    }
    try {
      const { data } = await axios.put("http://localhost:5000/api/v1/auth/profile", {
        name,
        email,
        // password,
        phone,
        address,
      });
      if (data?.errro) {
        toast.error(data?.error);
      } else {
        setAuth({ ...auth, user: data?.updatedUser });
        let ls = localStorage.getItem("auth");
        ls = JSON.parse(ls);
        ls.user = data.updatedUser;
        localStorage.setItem("auth", JSON.stringify(ls));
        toast.success("Profile Updated Successfully");
      }
    } catch (error) {
      // console.log(error);
      toast.error("Something went wrong");
    }
  };
  return (
<>
<Container>
     
      <Stack marginBlock={5} direction={"row"} alignItems={"center"} justifyContent={"center"} flexWrap={"wrap"} gap={5}>
        <UserMenu />
    
      <Box width={"70%"}>
        <Paper elevation={2} sx={{padding:3}}>
          <Stack gap={2}>
            <Typography variant="h5">User Profile</Typography>
            <TextField 
            required
              type="text"
              label="Enter your name"
              value={name}
                 onChange={(e) => setName(e.target.value)}
            />
            <TextField 
             type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    label="Your Email"
                    disabled
            />
            <TextField 
            label="Enter your Phone"
           type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
            />
            <TextField 
            label="Enter your Address"
            required
            type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
            />
            <Button variant="contained" endIcon={<FaSave/>} onClick={handleSubmit}>
              submit
            </Button>
            
          </Stack>
        </Paper>
      </Box>
  </Stack>
    
    </Container>
</>

  );
};

export default Profile;