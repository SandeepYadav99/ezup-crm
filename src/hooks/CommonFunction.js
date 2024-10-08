import React from "react";

// First letter in Caps 
export default function capitalizeFirstLetter(str) {
    return str?.replace(/\b\w/g, function (match) {
        return match?.toUpperCase();
    });
}

// Remove Under Score and first letter in Caps 
export  const formatString = (inputString) => {
    if (!inputString) {
      return "";
    }
  
    return inputString
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };


   export  const formattedDescription =(details)=> details?.description
  ? details.description.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ))
  : null;


  export const formatPhoneNumber = (formattedValue) => {
    const countryCodeRegex = /\+(\d+)/;
    const match = formattedValue.match(countryCodeRegex);
    const countryCode = match ? match[1] : null;
    const restOfPhoneNumber = formattedValue
      .replace(countryCodeRegex, "")
      .replace(/-/g, "");
  
    const formattedPhoneNumber = countryCode
      ? `+${countryCode}${restOfPhoneNumber}`
      : formattedValue;
  
    return formattedPhoneNumber;
  };

  // if Have "LOW" or "low" output => Low

  export const  firstLeterConverter=(inputString)=> {
    if (!inputString) {
        return '';
    }
    return inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase();
}