import React from "react";
import { Autocomplete, TextField } from "@mui/material";

export default function UserSearch({ users, onFilter }) {
  const handleSearchChange = (event, value) => {
    if (value) {
      const filteredUsers = users
        .filter((user) =>
          user.name.toLowerCase().startsWith(value.toLowerCase())
        )
        .sort((a, b) => a.name.localeCompare(b.name));
      onFilter(filteredUsers);
    } else {
      const sortedUsers = users.sort((a, b) => a.name.localeCompare(b.name));
      onFilter(sortedUsers);
    }
  };

  return (
    <div className="autocomplete-container">
      <Autocomplete
        freeSolo
        options={users
          .map((user) => user.name)
          .sort((a, b) => a.localeCompare(b))}
        renderInput={(params) => (
          <TextField {...params} label="Search User" variant="outlined" />
        )}
        onInputChange={handleSearchChange}
      />
    </div>
  );
}
