import {

  CircularProgress,
  MenuItem,

  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CustomTextField from "../../../FormFields/TextField.component";
import styles from "./Style.module.css";
import useAddTaskCreate from "./AddTaskCreateHook";



import ShadowBox from "../../../components/ShadowBox/ShadowBox";
import {
 
  PrimaryButton,
} from "../../../components/Buttons/PrimaryButton";
import MultiComplete from "../../../components/FormFields/AutoCompleteText/MultiComplete";
import CustomDatePicker from "../../../components/FormFields/DatePicker/CustomDatePicker";
import CustomMultiComplete from "../../../components/FormFields/AutoCompleteText/MultiComplete";
import CustomSelectField from "../../../components/FormFields/SelectField/SelectField.component";

const AddTaskCreate = ({
  handleSideToggle,
  isSidePanel,
  handleCreatedTask,
  profileDetails,
}) => {
  const {
    form,
    errorData,
    handleSubmit,
    onBlurHandler,
    changeTextData,
    isSubmitting,
    categoryLists,
    filteredUsers,
    filteredTask,
    filteredAssignedTo,
    fetchedAssignedUser,
    helperText,
  } = useAddTaskCreate({
    handleSideToggle,
    isSidePanel,
    handleCreatedTask,
    profileDetails,
  });

  return (
    <div className={styles.mainContainer}>
      <ShadowBox width={"100%"}>
        <div className={styles.headerFlex}>
          <h4 className={styles.infoTitle}>
            <Typography fontSize={18} fontWeight={600}>
              Task Details
            </Typography>
            {/* <Tooltip title="Info" aria-label="info" placement="right">
              <InfoIcon fontSize={"small"} />
            </Tooltip> */}
          </h4>
        </div>

        <div>
          <div className={"formFlex"}>
            <div className={"formGroup"}>
              <CustomMultiComplete
                // multiple
                showImage
                AutoCompleteList={filteredAssignedTo || form.assigned_to || []}
                label="Assigned To"
                error={errorData?.assigned_to}
                getOptionLabel={(option) => option.email}
                value={form.assigned_to || fetchedAssignedUser || []}
                onTextChange={(text) => {
                  changeTextData(text, "assigned_to");
                }}
                enableField={["image", "email"]}
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
              <CustomDatePicker
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
             
              {/* <CustomMultiComplete
                multiple
                // showImage
                AutoCompleteList={filteredUsers || []}
                label="Task Category"
                error={errorData?.category}
                isArray={true}
                value={form?.category}
                onTextChange={(value) => {
                  changeTextData(value, "category");
                }}
                 enableField={["name"]}
              /> */}
               <MultiComplete
                    isError={errorData?.category}
                    multiple
                    isArray
                    AutoCompleteList={filteredUsers ? filteredUsers : []}
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
                // multiple
                showImage
                AutoCompleteList={filteredUsers || []}
                label="Associated User (Optional)"
                error={errorData?.associated_user}
                getOptionLabel={(option) => option.name}
                value={form.associated_user || []}
                onTextChange={(text) => {
                  changeTextData(text, "associated_user");
                }}
                enableField={["name"]}
              />
            </div>
          </div>
          <div className={"formFlex"}>
            <div className={"formGroup"}>
              <CustomMultiComplete
                // multiple
                showImage
                AutoCompleteList={filteredTask || []}
                label="Associated Task (Optional)"
                error={errorData?.associated_task}
                getOptionLabel={(option) => option.name}
                value={form.associated_task || []}
                onTextChange={(text) => {
                  changeTextData(text, "associated_task");
                }}
                enableField={["name"]}
              />
            </div>
          </div>
        </div>
      </ShadowBox>
      <div style={{ float: "right", marginTop: "15px" }}>
        <PrimaryButton
          onClick={() => {
            handleSubmit();
          }}
        >
          {isSubmitting ? (
            <CircularProgress color="success" size="20px" />
          ) : (
            "ADD"
          )}
        </PrimaryButton>
      </div>
    </div>
  );
};

export default AddTaskCreate;
