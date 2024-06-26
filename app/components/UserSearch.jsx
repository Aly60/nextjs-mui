import React from "react";
import { Autocomplete, TextField } from "@mui/material";

export default function UserSearch({ users, onFilter }) {
  const handleSearchChange = (event, value) => {
    let filteredUsers = [];
    if (value) {
      filteredUsers = users
        .filter((user) =>
          user.name.toLowerCase().startsWith(value.toLowerCase())
        )
        .sort((a, b) => a.name.localeCompare(b.name));
    } else {
      filteredUsers = users
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name));
    }
    onFilter(filteredUsers);
  };

  const options = users
    .map((user) => user.name)
    .sort((a, b) => a.localeCompare(b));

  return (
    <div className="autocomplete-container">
      <Autocomplete
        freeSolo
        options={options}
        renderInput={(params) => (
          <TextField {...params} label="Search User" variant="outlined" />
        )}
        onInputChange={handleSearchChange}
      />
    </div>
  );
}
