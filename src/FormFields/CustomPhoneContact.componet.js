import { useTheme } from "@emotion/react";

import React, { useCallback } from "react";

import PhoneInput from "react-phone-input-2";

const CustomPhoneContactField = ({
  isError,
  errorText,
  icon,
  label,
  onChange,
  onTextChange,
  inputProps,
  value,
  inputStyle,
  isValid,
  onMount,
  ...rest
}) => {
  // const handleChange = useCallback(
  //   (e) => {
  //     onChange && onChange(e);
  //     onTextChange && onTextChange(e);
  //   },
  //   [onChange, onTextChange]
  // );
  const theme = useTheme();

  const handleChange = useCallback(
    (value, country, e, formattedValue) => {
      const countryCodeRegex = /\+(\d+)/;
      const match = formattedValue.match(countryCodeRegex);
      const countryCode = match ? match[1] : null;
      const restOfPhoneNumber = formattedValue
        .replace(countryCodeRegex, "")
        .replace(/-/g, "");

      const formattedPhoneNumber = countryCode
        ? `+${countryCode} ${restOfPhoneNumber}`
        : formattedValue;

      onTextChange && onTextChange(formattedPhoneNumber);
      onChange && onChange(formattedPhoneNumber, country, e, formattedValue);
    },
    [onChange, onTextChange]
  );

 
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <PhoneInput
        defaultErrorMessage={isError}
        inputProps={{
          name: "Phone No",
        }}
        country={"in"}
        // country={country_code ? country_code.toLowerCase() : 'us'}
        value={value}
        onChange={handleChange}
        inputStyle={{
          width: "100%",
          border: errorText ? "1px solid red" : "1px solid #ccc",
          color: theme.palette.text.primary,
          background:theme.palette.tableHeadColor,
          marginTop: theme.spacing(2),
        }}
        dropdownStyle={{
          backgroundColor: theme.palette.background?.paper,
        }}
       
        specialLabel={
          <span
            style={{
              color: theme.palette.text.primary,
              background:theme.palette.tableHeadColor,
              position: "absolute",
              top: theme.spacing(-0.1),
              left: theme.spacing(2),
              display: "block",
            }}
          >
            Contact
          </span>
        }
        isValid={isValid}
        {...rest}
      />
      {errorText ? (
        <span style={{ color: "red", textAlign: "right", fontSize: "12px" }}>
          {errorText}
        </span>
      ) : (
        <span></span>
      )}
    </div>
  );
};

export default CustomPhoneContactField;
