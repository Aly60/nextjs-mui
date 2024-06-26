"use client";
import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Avatar,
  TextField,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import axios from "axios";
import UserSearch from "./UserSearch";
import moment from "moment";
import "../globals.css";

const columns = [
  { field: "id", headerName: "ID", width: 120, editable: false },
  { field: "name", headerName: "Name", width: 150, editable: true },
  { field: "phone", headerName: "Phone", width: 150, editable: true },
  { field: "address", headerName: "Address", width: 150, editable: true },
  { field: "status", headerName: "Status", width: 150, editable: true },
  {
    field: "date",
    headerName: "Date",
    width: 150,
    editable: true,
    renderCell: (params) => {
      const date = moment(params.value, "YYYY-MM-DD", true);
      return date.isValid() ? date.format("YYYY-MM-DD") : "Invalid Date";
    },
  },
  {
    field: "picture",
    headerName: "Picture",
    width: 100,
    editable: true,
    renderCell: (params) => (
      <Avatar
        src={params.row.picture}
        alt={params.row.name}
        style={{ width: 45, height: 45 }}
      />
    ),
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 150,
    renderCell: (params) => (
      <>
        {editingId === params.row.id ? (
          <>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleSave(params.row)}
              style={{ marginRight: 5 }}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleCancel()}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button
            variant="contained"
            size="small"
            onClick={() => handleEdit(params.row.id)}
          >
            Edit
          </Button>
        )}
      </>
    ),
  },
];

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3001/users")
      .then((response) => {
        let data = response.data.map((user) => ({
          ...user,
          date: moment(user.date).isValid()
            ? moment(user.date).format("YYYY-MM-DD")
            : "Invalid Date",
        }));

        // Retrieve local storage edits
        const localEdits =
          JSON.parse(localStorage.getItem("editedUsers")) || {};
        data = data.map((user) =>
          localEdits[user.id] ? { ...user, ...localEdits[user.id] } : user
        );

        setUsers(data);
        setFilteredUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data.");
        setLoading(false);
      });
  }, []);

  const handleFilter = (filteredUsers) => {
    setFilteredUsers(filteredUsers);
  };

  const handleDateChange = (event) => {
    const date = moment(event.target.value, "YYYY-MM-DD", true);
    if (event.target.name === "startDate") {
      setStartDate(date.isValid() ? date.format("YYYY-MM-DD") : "");
      if (!date.isValid() || (endDate && date.isAfter(endDate))) {
        setEndDate("");
      } else if (startDate && date.isBefore(startDate)) {
        setEndDate("");
      }
    } else {
      setEndDate(date.isValid() ? date.format("YYYY-MM-DD") : "");
    }
  };

  const filterByDate = (users) => {
    if (!startDate && !endDate) return users;
    return users.filter((user) => {
      const userDate = moment(user.date, "YYYY-MM-DD", true);
      return (
        (!startDate || userDate.isSameOrAfter(startDate)) &&
        (!endDate || userDate.isSameOrBefore(endDate))
      );
    });
  };

  const handleClearDates = () => {
    setStartDate(null);
    setEndDate(null);
    setFilteredUsers(users);
  };

  useEffect(() => {
    if (!startDate && !endDate) {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(filterByDate(users));
    }
  }, [startDate, endDate, users]);

  const handleEdit = (id) => {
    setEditingId(id);
    setOriginalData(users.find((user) => user.id === id));
  };

  const handleCancel = () => {
    if (originalData) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === originalData.id ? originalData : user
        )
      );
      setFilteredUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === originalData.id ? originalData : user
        )
      );
      setOriginalData(null);
    }
    setEditingId(null);
  };

  const handleSave = async (user) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/users/${user.id}`,
        user
      );
      console.log("Successfully updated user on the server", response);

      // Store the edited data in local storage
      const localEdits = JSON.parse(localStorage.getItem("editedUsers")) || {};
      localEdits[user.id] = user;
      localStorage.setItem("editedUsers", JSON.stringify(localEdits));

      // Update the state to reflect the edited data
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === user.id ? user : u))
      );
      setFilteredUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === user.id ? user : u))
      );
      setEditingId(null);
      setOriginalData(null);
    } catch (error) {
      console.error("Failed to update the user", error);
      setError("Failed to update the user.");
    }
  };

  const handleInputChange = (id, field, value) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, [field]: value } : user
      )
    );
  };

  return (
    <div className="container">
      <div className="search-bar">
        <UserSearch users={users} onFilter={handleFilter} />
        <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
          <TextField
            name="startDate"
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            onChange={handleDateChange}
            value={startDate || ""}
            sx={{ marginRight: 1 }}
          />
          <TextField
            name="endDate"
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            onChange={handleDateChange}
            value={endDate || ""}
            disabled={!startDate}
            error={endDate && moment(endDate).isBefore(startDate)}
            helperText={
              endDate && moment(endDate).isBefore(startDate)
                ? "End date cannot be before start date"
                : ""
            }
          />
          <Button
            variant="contained"
            sx={{ marginLeft: 1 }}
            onClick={handleClearDates}
          >
            Clear Dates
          </Button>
        </Box>
      </div>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      ) : (
        <Box className="data-grid-container" sx={{ marginTop: 2 }}>
          <DataGrid
            rows={filteredUsers}
            columns={columns.map((col) =>
              col.field === "actions"
                ? {
                    ...col,
                    renderCell: (params) => (
                      <>
                        {editingId === params.row.id ? (
                          <>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleSave(params.row)}
                              style={{ marginRight: 5 }}
                            >
                              Save
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleCancel()}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleEdit(params.row.id)}
                          >
                            Edit
                          </Button>
                        )}
                      </>
                    ),
                  }
                : col
            )}
            pageSize={5}
            pagination
            pageSizeOptions={[5, 10, 20, 30, 40, 100]}
          />
        </Box>
      )}
    </div>
  );
}
