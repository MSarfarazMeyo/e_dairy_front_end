import React, { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  IconButton,
  Box,
  Dialog,
  DialogContent,
  Button,
  Avatar,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";

import { GET_ALL_students, DELETE_BY_ID } from "../../../services/Students";
import eDairyContext from "../../../context/eDairyContext";
import { CustomNoRowsOverlay } from "../../../Components/NoRowsOverlay";
import Loading from "../../../Components/Loading";
import { AddStudent } from "./AddStudent";
import stables from "../../../constants/stables";

// Users Data Component
//  Renders the users registered in the app
export const StudentsTable = () => {
  const context = useContext(eDairyContext);
  const { students, setStudents, selectedClass } = context;
  const [isLoading, setisLoading] = useState(false);
  const [editedItem, setEditedItem] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [classTeachers, setClassTeachers] = useState(students || []);

  useEffect(() => {
    if (selectedClass?.id) {
      const filteredTeachers = students?.filter(
        (item) => item?.class?.id == selectedClass?.id
      );
      setClassTeachers(filteredTeachers);
    } else {
      setClassTeachers(students);
    }
  }, [selectedClass, students]);

  const handleEdit = (item) => {
    setEditedItem(item);
    setEditDialogOpen(true);
  };

  // Close Dialog
  const handleSaveEdit = async () => {
    setEditDialogOpen(false);
  };

  //  Function to handle DELETE User
  const handleDelete = (id) => {
    // Alert to confirm delete
    const confirmDelete = window.confirm(
      "Do you really want to delete this item?"
    );
    //  If yes , Call the deleteStaffData mutation with the classId and id
    if (confirmDelete) {
      DELETE_BY_ID(id)
        .then(async (response) => {
          const data = await GET_ALL_students();
          data?.data && setStudents(data.data);
          toast.success(response.message);
        }) // Show success message using toast
        .catch((error) => {
          const errorMessage =
            error?.error?.message ||
            error?.data?.error?.message ||
            "An error occurred.";
          toast.error(errorMessage); // Show error message using toast
        });
    } else return;
  };

  // Column for Data-Grid
  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 200,
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <Avatar
            src={stables.UPLOAD_FOLDER_BASE_URL + params?.row?.profilePic}
            sx={{ width: 24, height: 24 }}
          >
            {params?.row?.name?.slice(0, 1)}
          </Avatar>

          <span>{params?.row?.name}</span>
        </div>
      ),
    },
    {
      field: "rollNumber",
      headerName: "rollNumber",
      width: 200,
    },

    {
      field: "class",
      headerName: "Class",
      width: 200,
      renderCell: (params) => <div>{params?.row?.class?.name}</div>,
    },

    {
      field: "parent",
      headerName: "Parent",
      width: 200,
      renderCell: (params) => <div>{params?.row?.parent?.name}</div>,
    },
    {
      field: "actions",
      headerName: "Actions",
      align: "center",
      headerAlign: "center",
      textAlign: "center",
      flex: 1,
      renderCell: (params) => (
        <div>
          <IconButton color="primary" onClick={() => handleEdit(params?.row)}>
            <Edit />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(params?.row?.id)}
          >
            <Delete />
          </IconButton>
        </div>
      ),
    },
  ];

  // Filtered array based on search term

  let content;

  // Show loading state while fetching data
  if (isLoading) {
    content = <Loading open={isLoading} />;
  }
  // Render the staff container if data is successfully fetched
  else {
    content = (
      <Box sx={{ height: "100%", width: "100%", marginTop: "20px" }}>
        <ToastContainer />
        <DataGrid
          style={{ padding: "20px" }}
          rows={classTeachers}
          columns={columns}
          rowsPerPageOptions={[5, 10, 20]}
          autoHeight
          disableSelectionOnClick
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
          }}
        />
        {/* ----- Dialog for displaying Edit User Form ------ */}
        <Dialog open={editDialogOpen} onClose={handleSaveEdit}>
          <DialogContent>
            <AddStudent subjectData={editedItem} />
          </DialogContent>
        </Dialog>
      </Box>
    );
    // Show error message if there's an error fetching data
  }
  return content;
};
