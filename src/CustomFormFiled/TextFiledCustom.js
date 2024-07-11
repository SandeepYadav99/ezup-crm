import { InputLabel, TextField, Typography } from "@mui/material";
import { useTheme } from "@mui/styles";
import React, { useCallback } from "react";

const TextFiledCustom = ({
  onTextChange,
  disabled,
  isError,
  isCurser,
  ...rest
}) => {
  const handleChange = useCallback(
    (e) => {
      onTextChange && onTextChange(e.target.value);
    },
    [onTextChange]
  );

  return (
    <TextField
      disabled={disabled}
      error={isError}
      onChange={handleChange}
      variant={"outlined"}
      margin={"dense"}
      size="small"
      fullWidth
      {...rest}
    />
  );
};

export default TextFiledCustom;
