import {
  Avatar,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";

import styles from "./Style.module.css";
import ShadowBox from "../../../../components/ShadowBox/ShadowBox";
import { PrimaryButton } from "../../../../components/Buttons/PrimaryButton";
import MultiComplete from "../../../../components/FormFields/AutoCompleteText/MultiComplete";
import CustomMultiComplete from "../../../../components/FormFields/AutoCompleteText/MultiComplete";
import CustomSelectField from "../../../../components/FormFields/SelectField/SelectField.component";
import { useTheme } from "@mui/styles";
import useAddTaskUpdate from "./UpdateDetailHook";
import CustomDateTimePicker from "../../../../components/FormFields/DatePicker/CustomDateTimePicker";
import CustomTextField from "../../../../components/FormFields/TextField/TextField.component";

const AddTaskUpdate = ({
  handleSideToggle,
  isSidePanel,
  handleCreatedTask,
  empId,
  details,
}) => {
  const {
    form,
    errorData,
    handleSubmit,
    onBlurHandler,
    changeTextData,
    isSubmitting,

    filteredUsers,
    filteredTask,
    filteredAssignedTo,
   
    categoryLists,

    
  } = useAddTaskUpdate({
    handleSideToggle,
    isSidePanel,
    handleCreatedTask,
    empId,
    details,
  });
  const theme = useTheme();
  return (
    <div className={styles.mainContainer}>
      <ShadowBox width={"100%"}>
        <div className={styles.headerFlex}>
          <h4 className={styles.infoTitle}>
            <Typography fontSize={18} fontWeight={600}>
              Task Details
            </Typography>
          </h4>
        </div>

        <div>
          <div className={"formFlex"}>
            <div className={"formGroup"}>
              <CustomMultiComplete
                AutoCompleteList={filteredAssignedTo || []} 
             
                getOptionLabel={(option) =>
                  `${option?.name} (${option?.email})`
                }
                value={form.assigned_to}
                onTextChange={(text) => {
                  changeTextData(text, "assigned_to");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={errorData?.assigned_to}
                    variant="outlined"
                    label="Assigned To"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <img
                          src={form?.assigned_to?.image}
                          crossOrigin="anonymous"
                          className={styles.avatorImage}
                          alt=".."
                        />
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <img
                      src={option?.image}
                      crossOrigin="anonymous"
                      className={styles.avatorImage}
                      alt=".."
                    />
                    <div>{`${option?.name} (${option?.email})`}</div>
                  </li>
                )}
              />
            </div>
          </div>
          <div className={"formFlex"}>
            <div className={"formGroup"}>
              <CustomTextField
                isError={errorData?.title}
                errorText={errorData?.title}
                label={"Task Title"}
                value={form?.title}
                onTextChange={(text) => {
                  changeTextData(text, "title");
                }}
                onBlur={() => {
                  onBlurHandler("title");
                }}
              />
            </div>
          </div>

          <div className={"formFlex"}>
            <div className={"formGroup"}>
              <CustomTextField
                isError={errorData?.description}
                errorText={errorData?.description}
                label={"Description"}
                value={form?.description}
                onTextChange={(text) => {
                  changeTextData(text, "description");
                }}
                onBlur={() => {
                  onBlurHandler("description");
                }}
                multiline
                rows={3}
              />
            </div>
          </div>

          <div className={"formFlex"}>
            <div className={"formGroup"}>
              <CustomDateTimePicker
                clearable
                label={"Due Date"}
                onChange={(date) => {
                  changeTextData(date, "due_date");
                }}
                className={styles.dateContainer}
                value={form?.due_date}
                isError={errorData?.due_date}
                //  helperText={helperText}
              />
            </div>
          </div>

          <div className="formFlex">
            <div className={"formGroup"}>
              <MultiComplete
                isError={errorData?.category}
                multiple
                isArray
                AutoCompleteList={categoryLists || []}
                getOptionLabel={(option) => option}
                label="Task Category"
                defaultValue={form?.category}
                value={form?.category}
                onTextChange={(value) => {
                  changeTextData(value, "category");
                }}
              />
              <label className={styles.paragraph}>
                Please press enter to add a category if not found in the search
                results.
              </label>
            </div>
          </div>

          <div className={"formFlex"}>
            <div className={"formGroup"}>
              <CustomSelectField
                isError={errorData?.type}
                errorText={errorData?.type}
                label={"Task Type"}
                value={form?.type}
                handleChange={(value) => {
                  changeTextData(value, "type");
                }}
              >
                <MenuItem value="DISCUSS">Discuss</MenuItem>
              </CustomSelectField>
            </div>
          </div>
          <div className={"formFlex"}>
            <div className={"formGroup"}>
              <CustomSelectField
                isError={errorData?.priority}
                errorText={errorData?.priority}
                label={"Category "}
                value={form?.priority}
                handleChange={(value) => {
                  changeTextData(value, "priority");
                }}
              >
                <MenuItem value="HIGH">High</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="LOW">Low</MenuItem>
              </CustomSelectField>
            </div>
          </div>
          <div className={"formFlex"}>
            <div className={"formGroup"}>
              <CustomMultiComplete
                getOptionLabel={(option) =>
                  `${option?.name || ""} ${
                    option?.email ? `(${option?.email})` : ""
                  }`
                }
                AutoCompleteList={filteredUsers || []}
                // label="Associated User (Optional)"
                isError={errorData?.associated_user}
                value={form.associated_user } //  fetchedUser
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Associated User (Optional)"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          {form?.associated_user?.image  ? (
                            <img
                              src={
                                form?.associated_user?.image 
                              }
                              crossOrigin="anonymous"
                              className={styles.avatorImage}
                              alt=".."
                            />
                          ) : (
                            <Avatar
                              src=""
                              sx={{
                                height: "25px",
                                width: "25px",
                                borderRadius: "25px",
                              }}
                            />
                          )}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <img
                      src={option?.image}
                      crossOrigin="anonymous"
                      className={styles.avatorImage}
                      alt=".."
                    />
                    <div>{`${option?.name} (${option?.email})`}</div>
                  </li>
                )}
                onTextChange={(text) => {
                  changeTextData(text, "associated_user");
                }}
                // disableClearable
              />
            </div>
          </div>
          <div className={"formFlex"}>
            <div className={"formGroup"}>
              <CustomMultiComplete
                isError={errorData?.associated_task}
                AutoCompleteList={filteredTask}
                value={form.associated_task}
                onTextChange={(text) => {
                  changeTextData(text, "associated_task");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Associated Task (Optional)"
                  />
                )}
                getOptionLabel={(option) => option?.title || ""}
              />
             
            </div>
          </div>
        </div>
      </ShadowBox>
      <div className={styles.actionButton}>
        <PrimaryButton
          onClick={() => {
            handleSubmit();
          }}
        >
          {isSubmitting ? (
            <CircularProgress color="success" size="20px" />
          ) : (
            "UPDATE"
          )}
        </PrimaryButton>
      </div>
    </div>
  );
};

export default AddTaskUpdate;
