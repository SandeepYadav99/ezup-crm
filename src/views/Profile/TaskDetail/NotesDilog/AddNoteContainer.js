import { Typography } from "@mui/material";

import React, { memo, useMemo } from "react";
import NotesDilog from "./NotesDilog";
import useNotesDilogHook from "./NotesDilogHook";
import NoteItem from "./NoteItems";
import { PrimaryButton } from "../../../../components/Buttons/PrimaryButton";

const AddNoteContainer = ({ details, styles, classes }) => {
  const {
    form,
    toggleAcceptDialog,
    isAcceptPopUp,
    changeTextData,
    handleSubmit,
    noteDetails,
    errorData,
    isSubmitting,
  } = useNotesDilogHook();

  const noteLists = useMemo(() => {
    if (noteDetails?.length > 0) {
      return noteDetails?.map((note, index) => (
        <NoteItem key={index} note={note} styles={styles} classes={classes} />
      ));
    }
  }, [noteDetails]);
  
  const isNotNotes = !noteLists;
  return (
 
      <div className={styles.newContainer}>
        <div className={styles.notesContainer}>
          <Typography variant="h5">Notes</Typography>
         
            <PrimaryButton
              // className={styles.addTask}
              onClick={toggleAcceptDialog}
              // icon={<Add fontSize={"small"} />}
              paddingLR={2}
            >
              <Typography variant={"h6"} fontWeight={"600"} color={"#FFFFFF"}>
                ADD NOTES
              </Typography>
            </PrimaryButton>
        
        </div>
        {/* <div className={styles.gaps} /> */}
        <NotesDilog
          isOpen={isAcceptPopUp}
          handleToggle={toggleAcceptDialog}
          form={form}
          isSubmitting={isSubmitting}
          changeTextData={changeTextData}
          handleSubmit={handleSubmit}
          errorData={errorData}
          onBlurHandler
        />

        {noteLists}
        {isNotNotes && (
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Notes not available!
          </Typography>
        )}
      </div>

  );
};

export default memo(AddNoteContainer);
