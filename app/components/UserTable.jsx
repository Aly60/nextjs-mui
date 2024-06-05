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
import Link from "next/link";
import axios from "axios";
import UserSearch from "./UserSearch";
import moment from "moment";
import "../globals.css";

const columns = [
  { field: "id", headerName: "ID", width: 120 },
  { field: "name", headerName: "Name", width: 150 },
  { field: "phone", headerName: "Phone", width: 150 },
  { field: "address", headerName: "Address", width: 150 },
  { field: "status", headerName: "Status", width: 150 },
  {
    field: "date",
    headerName: "Date",
    width: 150,
    renderCell: (params) => {
      const date = moment(params.value, "YYYY-MM-DD");
      return date.isValid() ? date.format("YYYY-MM-DD") : "Invalid Date";
    },
  },
  {
    field: "picture",
    headerName: "Picture",
    width: 100,
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
      <Link href={`/${params.row.id}`}>
        <button className="MuiButtonBase-root">View Details</button>
      </Link>
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

  useEffect(() => {
    axios
      .get("http://localhost:3001/users")
      .then((response) => {
        //format the dates and invalid
        const data = response.data.map((user) => ({
          ...user,
          date: moment(user.date, "YYYY-MM-DD").isValid()
            ? moment(user.date).format("YYYY-MM-DD")
            : "Invalid Date",
        }));
        setUsers(data);
        setFilteredUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Failed to fetch data.");
        setLoading(false);
      });
  }, []);
  //update filterd users on search input
  const handleFilter = (filteredUsers) => {
    setFilteredUsers(filteredUsers);
  };
  // handle the update for the start date and end date
  const handleDateChange = (event) => {
    const date = moment(event.target.value);
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
  //filter users based on the date range
  const filterByDate = (users) => {
    if (!startDate && !endDate) return users;
    return users.filter((user) => {
      const userDate = moment(user.date, "YYYY-MM-DD");
      return (
        (!startDate || userDate.isSameOrAfter(startDate)) &&
        (!endDate || userDate.isSameOrBefore(endDate))
      );
    });
  };
  // clear the filters and reset the users
  const handleClearDates = () => {
    setStartDate(null);
    setEndDate(null);
    setFilteredUsers(users);
  };
  //update  filtered users when the date range or users change
  useEffect(() => {
    if (!startDate && !endDate) {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(filterByDate(users));
    }
  }, [startDate, endDate, users]);

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
            columns={columns}
            pageSize={5}
            pagination
            pageSizeOptions={[5, 10, 20, 30, 40]}
          />
        </Box>
      )}
    </div>
  );
}
