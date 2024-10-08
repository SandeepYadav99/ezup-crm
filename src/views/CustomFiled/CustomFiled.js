import React from "react";
import CustomTextField from "../../components/FormFields/TextField/TextField.component";

import ShadowBox from "../../components/ShadowBox/ShadowBox";
import { MenuItem, Typography } from "@mui/material";
import { useTheme } from "@mui/styles";
import CustomSelectField from "../../components/FormFields/SelectField/SelectField.component";
import useCustomFiledHook from "./CustomFiledHook";
import ChildrenIncludesComponent from "../../components/includes/ChildrenIncludes.component";
import { PrimaryButton } from "../../components/Buttons/PrimaryButton";
import styles from "./Style.module.css";

const CustomFiled = () => {
  const theme = useTheme();
  const { form, errorData, changeTextData, handleSubmit, dropDownRef } =
    useCustomFiledHook();
  return (
    <ShadowBox width={"100%"}>
      <div>
        <Typography fontWeight={600} variant="h5">
          Custom Field
        </Typography>
      </div>
      <div className="formFlex">
        <div className="formGroup">
          <CustomTextField
            isError={errorData?.name}
            errorText={errorData?.name}
            label={"Name"}
            value={form?.name}
            handleChange={(value) => {
              changeTextData(value, "name");
            }}
          />
        </div>
      </div>
      <div className="formFlex">
        <div className="formGroup">
          <div className={styles.internalName}>
            <CustomTextField
              isError={errorData?.internalName}
              errorText={errorData?.internalName}
              label={"Internal name"}

              value={form?.internalName}
              handleChange={(value) => {
                changeTextData(value, "internalName");
              }}
            />
          </div>
        </div>
      </div>
      <div className="formFlex">
        <div className="formGroup">
          <CustomSelectField
            name={"Field Type"}
            label={"Field Type"}
            isError={errorData?.fieldType}
            errorText={errorData?.fieldType}
            value={form?.fieldType}
            handleChange={(value) => {
              changeTextData(value, "fieldType");
            }}
          >
            <MenuItem value="TEXT_FIELD">Text Field</MenuItem>
            <MenuItem value="DROPDOWN">Dropdown</MenuItem>
          </CustomSelectField>
        </div>
      </div>
      {form?.fieldType === "DROPDOWN" && (
        <div className="formFlex">
          <div className="formGroup">
            {" "}
            <ChildrenIncludesComponent ref={dropDownRef} />
          </div>
        </div>
      )}
      {form?.fieldType === "TEXT_FIELD" && (
        <div className="formFlex">
          <div className="formGroup">
            <CustomTextField
              isError={errorData?.textFiled}
              errorText={errorData?.textFiled}
              label={
                <Typography sx={{ mt: theme.spacing(-0.5) }}>
                  Text Filed
                </Typography>
              }
              value={form?.textFiled}
              handleChange={(value) => {
                changeTextData(value, "textFiled");
              }}
            />
          </div>
        </div>
      )}

      <div className={styles.actionButton}>
        <PrimaryButton
          onClick={() => {
            handleSubmit();
          }}
        >
          SAVE
        </PrimaryButton>
      </div>
    </ShadowBox>
  );
};

export default CustomFiled;
