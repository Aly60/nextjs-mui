
import React from "react";
import { Autocomplete, TextField } from "@mui/material";

export default function UserSearch({ users, onFilter }) {
  const handleSearchChange = (event, value) => {
    if (value) {
      const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(value.toLowerCase())
      );
      onFilter(filteredUsers);
    } else {
      onFilter(users);
    }
  };

  return (
    <div className="autocomplete-container">
      <Autocomplete
        freeSolo
        options={users.map((user) => user.name)}
        renderInput={(params) => (
          <TextField {...params} label="Search User" variant="outlined" />
        )}
        onInputChange={handleSearchChange}
      />
    </div>
  );
}
