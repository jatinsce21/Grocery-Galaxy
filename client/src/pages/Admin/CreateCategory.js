import React, { useEffect, useState } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";

import CategoryForm from "../../components/Forms/CategoryForm";
import {
  Box,
  Button,
  Container,
  Modal,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { CgEditBlackPoint } from "react-icons/cg";
import { MdDelete, MdOutlineModeEdit } from "react-icons/md";
const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");

  //handle Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("http://localhost:5000/api/v1/category/create-category", {
        name,
      });
      if (data?.success) {
        toast.success(`${name} is created`);
        setName("");
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      // console.log(error);
      toast.error("somthing went wrong in input form");
    }
  };

  //get all cat
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/v1/category/all-category");
      if (data.success) {
        setCategories(data.allCategories);
        // console.log(data);
      }
    } catch (error) {
      // console.log(error);
      toast.error("Something went wrong in getting catgeory");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  //update category
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/v1/category/update-category/${selected._id}`,
        { name: updatedName }
      );
      if (data.success) {
        toast.success(`${updatedName} is updated`);
        setSelected(null);
        setUpdatedName("");
        setVisible(false);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Somtihing went wrong");
    }
  };
  //delete category
  const handleDelete = async (pId) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:5000/api/v1/category/delete-category/${pId}`
      );
      if (data.success) {
        toast.success(`category is deleted`);

        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Somtihing went wrong");
    }
  };
  return (
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

        <Box width={"70%"}>
          <Paper elevation={2} sx={{ padding: 3 }}>
            <Typography variant="h5">Manage Category</Typography>

            <CategoryForm
              handleSubmit={handleSubmit}
              value={name}
              setValue={setName}
            />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categories?.map((c) => (
                    <TableRow key={c._id}>
                      <TableHead>{c.name}</TableHead>

                      <TableCell>
                        <Button
                          endIcon={<MdOutlineModeEdit />}
                          variant="contained"
                          onClick={() => {
                            setVisible(true);
                            setUpdatedName(c.name);
                            setSelected(c);
                          }}
                          sx={{ mr: 2 }}
                        >
                          Edit
                        </Button>

                        <Button
                          endIcon={<MdDelete />}
                          variant="outlined"
                          color="error"
                          onClick={() => {
                            handleDelete(c._id);
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          <Modal onClose={() => setVisible(false)} footer={null} open={visible}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                border: "2px solid #000",
                boxShadow: 24,
                p: 4,
              }}
            >  <CategoryForm
              value={updatedName}
              setValue={setUpdatedName}
              handleSubmit={handleUpdate}
            /></Box>
          
          </Modal>
        </Box>
      </Stack>
    </Container>
  );
};

export default CreateCategory;
