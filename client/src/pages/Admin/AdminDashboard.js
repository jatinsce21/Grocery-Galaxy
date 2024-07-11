import React from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import { useAuth } from "../../context/auth";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";

const AdminDashboard = () => {
  const [auth] = useAuth();
  return (
    
    <Container>
    <Stack height={"50vh"} direction={"row"} alignItems={"center"} justifyContent={"center"} flexWrap={"wrap"} gap={5}>
    <AdminMenu />
  
    <Box width={"70%"}>
      <Paper elevation={2} sx={{padding:3}}>
        <Typography variant="h5" marginBlock={1}> Admin Name : {auth?.user?.name}</Typography>
        <Typography variant="h5" marginBlock={1}> Admin Email : {auth?.user?.email}</Typography>
        <Typography variant="h5" marginBlock={1}> Admin Address : {auth?.user?.address}</Typography>
      </Paper>
    </Box>
</Stack>
  </Container>
   
  );
};

export default AdminDashboard;