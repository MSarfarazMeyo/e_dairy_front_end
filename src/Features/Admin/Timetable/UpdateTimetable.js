import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "@emotion/react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  styled,
  tableCellClasses,
} from "@mui/material";

import { CardWrapper } from "../../../Components/CardWrapper";
import Loading from "../../../Components/Loading";
import eDairyContext from "../../../context/eDairyContext";
import { GET_ALL_classes, UPDATE_BY_ID } from "../../../services/Classes";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const NUM_PERIODS = 7;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary[500],
    fontWeight: "bold",
  },
}));

export const UpdateTimetable = ({ data }) => {
  const theme = useTheme();
  const context = useContext(eDairyContext);
  const { selectedClass, setClasses, setSelectedClass } = context;
  const [tableData, setTableData] = useState(data);
  const [subjectsList, setSubjectsList] = useState(selectedClass?.subject);

  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  useEffect(() => {
    if (selectedClass) {
      setSubjectsList(selectedClass?.subject);
    }
  }, [selectedClass]);

  const handlePeriodChange = (dayIndex, periodIndex, value) => {
    setTableData((prevTableData) => {
      const updatedData = prevTableData.map((dayData) => ({
        day: dayData.day,
        periods: [...dayData.periods], // Make a deep copy of periods array
      }));
      updatedData[dayIndex].periods[periodIndex] = value;
      return updatedData;
    });
  };

  // Function to update the timetable

  const updateTT = (values) => {
    setisLoading(true);

    const dataobj = { id: selectedClass.id, timeTable: values };
    UPDATE_BY_ID(dataobj)
      .then(async (response) => {
        const data = await GET_ALL_classes();
        setClasses(data.data);
        toast.success(response.message);
        setSelectedClass(response.data);
      })
      .catch((error) => {
        const errorMessage =
          error?.error?.message ||
          error?.data?.error?.message ||
          "An error occurred.";
        toast.error(errorMessage); // Show error message using toast
      })
      .finally(() => {
        setisLoading(false);
      });
  };

  const handleSubmit = () => {
    // Prepare the data to be sent to the API
    const timetableData = tableData.map(({ day, periods }) => ({
      day,
      periods,
    }));
    // Call updateStaff function to handle form submission
    updateTT(timetableData);
  };

  function initializeTableData(data) {
    if (data && data?.length > 0) {
      // Pre-populate tableData with the provided data
      return data;
    } else {
      // Initialize tableData with empty values
      return DAYS.map((day) => ({
        day,
        periods: Array(NUM_PERIODS).fill(""),
      }));
    }
  }

  return (
    <CardWrapper title="Update Timetable">
      <ToastContainer /> {/* Container for displaying toast messages */}
      {isLoading ? (
        <Loading open={isLoading} /> // Show loading indicator while submitting data
      ) : (
        <>
          <Box sx={{ width: "100%", overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Day</StyledTableCell>
                  <StyledTableCell align="center">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          minWidth: "45px",
                        }}
                      >
                        Period 1
                      </span>
                      <span
                        style={{
                          fontSize: "10px",
                          minWidth: "60px",
                        }}
                      >
                        8am - 9am
                      </span>
                    </div>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          minWidth: "45px",
                        }}
                      >
                        Period 2
                      </span>
                      <span
                        style={{
                          fontSize: "10px",
                          minWidth: "60px",
                        }}
                      >
                        9am - 10am
                      </span>
                    </div>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          minWidth: "45px",
                        }}
                      >
                        Period 3
                      </span>
                      <span
                        style={{
                          fontSize: "10px",
                          minWidth: "60px",
                        }}
                      >
                        10am - 11pm
                      </span>
                    </div>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          minWidth: "45px",
                        }}
                      >
                        Period 4
                      </span>
                      <span
                        style={{
                          fontSize: "10px",
                          minWidth: "60px",
                        }}
                      >
                        11pm - 12pm
                      </span>
                    </div>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          minWidth: "45px",
                        }}
                      >
                        Period 5
                      </span>
                      <span
                        style={{
                          fontSize: "10px",
                          minWidth: "60px",
                        }}
                      >
                        12pm - 1pm
                      </span>
                    </div>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          minWidth: "45px",
                        }}
                      >
                        Period 6
                      </span>
                      <span
                        style={{
                          fontSize: "10px",
                          minWidth: "60px",
                        }}
                      >
                        1pm - 2pm
                      </span>
                    </div>
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((data, dayIndex) => (
                  <TableRow key={data.day}>
                    <TableCell>{data.day}</TableCell>
                    {data.periods.slice(0, 6).map((period, periodIndex) => (
                      <TableCell key={periodIndex}>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={period}
                          label="Subject"
                          onChange={(e) =>
                            handlePeriodChange(
                              dayIndex,
                              periodIndex,
                              e.target.value
                            )
                          }
                          sx={{ width: "100px" }}
                        >
                          <MenuItem value={"Break"}>Break</MenuItem>

                          {subjectsList &&
                            subjectsList?.length &&
                            subjectsList.map((item) => {
                              return <MenuItem value={item}>{item}</MenuItem>;
                            })}
                        </Select>

                        {/* <TextField
                          value={period}
                          onChange={(e) =>
                            handlePeriodChange(
                              dayIndex,
                              periodIndex,
                              e.target.value
                            )
                          }
                          required
                          sx={{ width: "100px" }}
                        /> */}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
            sx={{ mt: 2 }}
          >
            Update TimeTable
          </Button>
        </>
      )}
    </CardWrapper>
  );
};
