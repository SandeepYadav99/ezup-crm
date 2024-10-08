
import * as React from "react";
import { styled } from "@mui/material/styles";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { useTheme } from "@mui/styles";

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 49,
  height: 22,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 3,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(26px)",
      color: theme.palette.text.primary,
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.switchTheme,
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      // color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      // color:
      //   theme.palette.mode === "light"
      //     ? theme.palette.grey[100]
      //     : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 15,
    height: 15,
    borderRadius: "20px",
    backgroundColor: theme.palette.contact,
  
  },
  "& .MuiSwitch-track": {
    borderRadius: "25px",
    backgroundColor: theme.palette.swithcTrack,
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

export default function CustomIosSwitch({
  handleChange,
  label,
 
  ...rest
}) {
  const theme = useTheme();
  return (
    <FormGroup>
      <FormControlLabel
        control={
          <IOSSwitch
            sx={{ m: 1 }}
           
            onChange={(e) => handleChange(e.target.checked)}
            theme={theme}
            // defaultChecked
          />
        }
        label={label}
        {...rest}
      />
    
    </FormGroup>
  );
}
