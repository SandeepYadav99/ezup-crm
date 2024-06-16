import { Switch, FormControlLabel } from "@mui/material";
import { useTheme } from "@mui/styles";
import React from "react";
import styled from "styled-components";

const CustomIosSwitch = ({ handleChange, label, value, ...rest }) => {
  const theme = useTheme();

  const BaseSwitch = styled(Switch)({
    width: 49,
    height: 22,
    padding: 0,
    display: 'flex',
   
    '& .MuiSwitch-switchBase': {
      padding: 2,
       transition: 'all 300ms !important',
      '&.Mui-checked': {
        transform: 'translateX(26px)',
       
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: theme.palette.switchTheme,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      }
    },
    '& .MuiSwitch-thumb': {
      width: 18,
      height: 18,
      borderRadius: '25px',
      backgroundColor: theme.palette.contact,
     
    },
    '& .MuiSwitch-track': {
      opacity: 1,
      borderRadius: '25px',
      //  transition: ' 0.3ms ease-out',
      // border: `1px solid ${theme.palette.text.primary}`,
      backgroundColor: theme.palette.swithcTrack,
      boxSizing: 'border-box',
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
    }
  });
  return (
    <FormControlLabel
      control={
        <BaseSwitch
          sx={{ m: 1 }}
          checked={value ? true : false}
          onChange={(e) => handleChange(e.target.checked)}
          
        />
      }
      label={label}
      {...rest}
    />
  );
};

export default CustomIosSwitch;
