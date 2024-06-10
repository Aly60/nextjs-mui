"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Avatar,
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";
import axios from "axios";
import moment from "moment";

export default function UserForm({ userId }) {
  const [user, setUser] = useState({
    name: "",
    phone: "",
    address: "",
    status: "",
    date: "",
    picture: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  // fetch user data
  useEffect(() => {
    if (userId) {
      setLoading(true);
      axios
        .get(`http://localhost:3001/users/${userId}`)
        .then((response) => {
          const userData = response.data;
          // format the date
          setUser({
            ...userData,
            date: moment(userData.date).format("YYYY-MM-DD"),
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setError("Failed to fetch user data.");
          setLoading(false);
        });
    }
  }, [userId]);
  // handle input change
  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };
  // handle file upload
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // convert file to base64
    const reader = new FileReader();

    reader.onloadend = () => {
      setUser((prevUser) => ({ ...prevUser, picture: reader.result }));
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };
  // handle submit
  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    // handle user creation or update
    const url = userId
      ? `http://localhost:3001/users/${userId}`
      : "http://localhost:3001/users";
    const method = userId ? "put" : "post";
    // send the user data to the server
    axios[method](url, user)
      .then(() => {
        setLoading(false);
        setSuccess(true);
        setError(null);
        if (!userId) {
          setUser({
            name: "",
            phone: "",
            address: "",
            status: "",
            date: "",
            picture: "",
          });
        }
        setTimeout(() => {
          setSuccess(false);
        }, 2500);
      })
      .catch((error) => {
        setLoading(false);
        setSuccess(false);
        setError(userId ? "Failed to update user" : "Failed to create user");
        console.log(error);
      });
  };

  return (
    <Box
      component={Paper}
      elevation={3}
      sx={{
        p: 4,
        maxWidth: 500,
        mx: "auto",
        mt: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        {userId ? "Edit User" : "Create User"}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <TextField
          label="Name"
          name="name"
          value={user.name}
          onChange={handleChange}
          margin="normal"
          required
          fullWidth
        />
        <TextField
          label="Phone"
          name="phone"
          value={user.phone}
          onChange={handleChange}
          margin="normal"
          required
          fullWidth
        />
        <TextField
          label="Address"
          name="address"
          value={user.address}
          onChange={handleChange}
          margin="normal"
          required
          fullWidth
        />
        <TextField
          label="Status"
          name="status"
          value={user.status}
          onChange={handleChange}
          margin="normal"
          required
          fullWidth
        />
        <TextField
          label="Date"
          name="date"
          type="date"
          value={user.date}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          margin="normal"
          required
          fullWidth
        />
        <Button variant="contained" component="label" sx={{ mt: 2, mb: 2 }}>
          Upload Picture
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
        {user.picture && (
          <Avatar
            src={user.picture}
            alt={user.name}
            sx={{ width: 100, height: 100, mb: 2 }}
          />
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Submit"}
        </Button>
        {success && (
          <Typography variant="body1" color="success" sx={{ mt: 2 }}>
            {userId ? "User updated successfully" : "User created successfully"}
          </Typography>
        )}
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
