import React, { memo } from "react";
import ShadowBox from "../../../../components/ShadowBox/ShadowBox";
import CustomTextField from "../../../../components/FormFields/TextField/TextField.component";
import styles from "../Style.module.css";
import CustomSelectField from "../../../../components/FormFields/SelectField/SelectField.component";
import { MenuItem, Typography } from "@mui/material";
import CustomDatePicker from "../../../../components/FormFields/DatePicker/CustomDatePicker";
import CustomCheckbox from "../../../../components/FormFields/CustomCheckbox";
import MultiComplete from "../../../../components/FormFields/AutoCompleteText/MultiComplete";
import { useTheme } from "@mui/styles";

const WorkInfoView = ({
  errorData,
  form,
  changeTextData,
  onBlurHandler,
  manager,
  department,
  id,
  designation,
}) => {
  const theme = useTheme();
  return (
    <>
      <ShadowBox className={styles.mainBox}>
        <div className={styles.subMain}>
        <div className={"headerFlex"}>
          <Typography
           sx={{
            marginTop:theme.spacing(3),
            marginBottom:theme.spacing(3),
            [theme.breakpoints.down("sm")]: {
              margin: "auto",
            },
          }}
            variant="h4"
            fontWeight={600}
            color={theme.palette.text.primary}
          >
            Work Information
          </Typography>
        </div>

        <div className={"formFlex"}>
          <div className={"formGroup"}>
            <CustomTextField
              isError={errorData?.employee_id}
              errorText={errorData?.employee_id}
              label={"Employee ID"}
              value={form?.employee_id}
              onTextChange={(text) => {
                changeTextData(text, "employee_id");
              }}
              // onBlur={() => {
              //   onBlurHandler("employee_id");
              // }}
            />
          </div>

          <div className={"formGroup"}>
            <MultiComplete
              isError={errorData?.department}
              // multiple
              autoSelect
              isArray
              AutoCompleteList={department}
              getOptionLabel={(option) => option}
              label={"Department"}
              defaultValue={form?.department}
              value={form?.department}
              onTextChange={(text) => {
                changeTextData(text, "department");
              }}
              className={styles.marginTop1}
            />
          </div>
        </div>

        <div className={"formFlex"}>
          <div className={"formGroup"}>
            <MultiComplete
              isError={errorData?.designation}
              // multiple
              autoSelect
              isArray
              AutoCompleteList={designation}
              getOptionLabel={(option) => option}
              label={"Designation"}
              defaultValue={form?.designation}
              value={form?.designation}
              onTextChange={(text) => {
                changeTextData(text, "designation");
              }}
            />
          </div>
          <div className={"formGroup"}>
            <CustomSelectField
              isError={errorData?.manager}
              errorText={errorData?.manager}
              label={"Manager"}
              className={styles.marginTop2}
              value={form?.manager}
              handleChange={(value) => {
                changeTextData(value, "manager");
              }}
            >
              {manager?.map((item) => {
                return (
                  <MenuItem
                    key={item?.id}
                    value={item?.id}
                  >{`${item?.name} (${item?.employee_id})`}</MenuItem>
                );
              })}
            </CustomSelectField>
          </div>
        </div>
        <div className={"formFlex"}>
          <div className={"formGroup"}>
            <CustomDatePicker
              clearable
              label={"Joining Date"}
              onChange={(value) => {
                changeTextData(value, "joining_date");
              }}
              // className={styles.dateContainer}
              value={form?.joining_date}
              isError={errorData?.joining_date}
              errorText={errorData?.joining_date}
            />
          </div>
          <div className={"formGroup"}>
            <CustomDatePicker
              clearable
              // className={styles.dateContainer}
              label={"End Date"}
              onChange={(value) => {
                changeTextData(value, "end_date");
              }}
              value={form?.end_date}
              isError={errorData?.end_date}
              errorText={errorData?.end_date}
            />
          </div>
        </div>
        <div className={"formGroup"}>
          <CustomCheckbox
            value={form?.userManage}
            handleChange={() => {
              changeTextData(!form?.userManage, "userManage");
            }}
            label={
              <Typography variant="body1" sx={{ cursor: "default" }}>
                User is a manager?
              </Typography>
            }
            checked={form?.userManage}
          />
        </div>
        <div className={"formGroup"}>
          {!id && (
            <CustomCheckbox
              className={styles.checkBoxmargin}
              checked={form?.invoiteToUser}
              value={form?.invoiteToUser}
              handleChange={() => {
                changeTextData(!form?.invoiteToUser, "invoiteToUser");
              }}
              label={
                <Typography variant="body1" sx={{ cursor: "default" }}>
                  Send Invite to user on email
                </Typography>
              }
            />
          )}
        </div>

        </div>
      </ShadowBox>
    </>
  );
};

export default memo(WorkInfoView);
