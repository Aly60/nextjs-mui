import React from "react";
import { Box, Typography } from "@mui/material";

const ErrorComponent = ({ message }) => (
  <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
    <Typography color="error">{message}</Typography>
  </Box>
);

export default ErrorComponent;
