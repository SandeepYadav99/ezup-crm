import React from "react";
import styles from "../../Styles.module.css";
import { MenuItem, Tooltip, Typography } from "@mui/material";
import ShadowBox from "../../../../components/ShadowBox/ShadowBox";
import CustomTextField from "../../../../components/FormFields/TextField/TextField.component";
import CustomSelectField from "../../../../components/FormFields/SelectField/SelectField.component";
import { InfoOutlined as InfoIcon } from "@mui/icons-material";
const BusinessInfo = ({ errorData, changeTextData, onBlurHandler, form }) => {
  return (
    <ShadowBox className={styles.contact}>
      <div className={"headerFlex"}>
        <h4 className={"infoTitle"}>
          <Typography variant={"title"} className={"heading"}>
            Business Information
          </Typography>
          <Tooltip title="Info" aria-label="info" placement="right">
            <InfoIcon fontSize={"small"} />
          </Tooltip>
        </h4>
      </div>
      <div className={"formFlex"}>
        <div className={"formGroup"}>
          <CustomTextField
            type="name"
            isError={errorData?.business_name}
            errorText={errorData?.business_name}
            label={"Business Name"}
            value={form?.business_name}
            onTextChange={(text) => {
              changeTextData(text, "business_name");
            }}
          />
        </div>
        {console.log()}
        <div className={"formGroup"}>
          <CustomSelectField
            isError={errorData?.industry}
            errorText={errorData?.industry}
            label={"Industry"}
            value={form?.industry}
            handleChange={(value) => {
              changeTextData(value, "industry");
            }}
          >
            <MenuItem value="PHARMACEUTICALS">PHARMACEUTICALS</MenuItem>
            <MenuItem value="MANUFACTURING">MANUFACTURING</MenuItem>
            <MenuItem value="SERVICES">SERVICES</MenuItem>
            <MenuItem value="DOCTORS/HOSPITALS">DOCTORS/HOSPITALS</MenuItem>
          </CustomSelectField>
        </div>
      </div>
      <div className={"formFlex"}>
        <div className={"formGroup"}>
          <CustomTextField
            type="name"
            isError={errorData?.website}
            errorText={errorData?.website}
            label={"Website"}
            value={form?.website}
            onTextChange={(text) => {
              changeTextData(text, "website");
            }}
          />
        </div>
        <div className={"formGroup"}>
          <CustomSelectField
            isError={errorData?.buying_role}
            errorText={errorData?.buying_role}
            label={"Buying Role"}
            value={form?.buying_role}
            handleChange={(value) => {
              changeTextData(value, "buying_role");
            }}
          >
            <MenuItem value="CXO">CXO</MenuItem>
            <MenuItem value="INFLUENCER_IN_COMMERCIAL">
              INFLUENCER IN COMMERCIAL
            </MenuItem>
            <MenuItem value="INFLUENCER_IN_SOLUTION">
              INFLUENCER IN SOLUTION
            </MenuItem>
            <MenuItem value="INTRODUCER">INTRODUCER</MenuItem>
            <MenuItem value="NONE">NONE</MenuItem>
          </CustomSelectField>
        </div>
      </div>
      <div className={"formFlex"}>
        <div className={"formGroup"}>
          <CustomTextField
            type="name"
            isError={errorData?.company_size}
            errorText={errorData?.company_size}
            label={"Company Size"}
            value={form?.company_size}
            onTextChange={(text) => {
              changeTextData(text, "company_size");
            }}
          />
        </div>
        <div className={"formGroup"}></div>
      </div>
    </ShadowBox>
  );
};

export default BusinessInfo;
