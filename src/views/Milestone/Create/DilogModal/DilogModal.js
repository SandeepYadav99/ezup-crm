import React from "react";
import { Button, ButtonBase } from '@mui/material';
import { Close } from '@mui/icons-material';
import Slide from "@mui/material/Slide";
import Dialog from "@mui/material/Dialog";
import styles from "./Style.module.css";
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  flex: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    color: "blue",
    textDecoration: "underline",
  },
  textField: {
    width: "100%",
  },
  closeBtn: {
    position: "absolute",
    right: "10px",
    top: "10px",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DeleteModal = ({ isOpen, handleToggle, suspendItem, empId }) => {
  const classes = useStyles();

  return (
    <div>
      <Dialog
        onBackdropClick={() => {}}
        keepMounted
        // fullWidth={true}
        maxWidth={"sm"}
        TransitionComponent={Transition}
        open={isOpen}
        onClose={handleToggle}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className={styles.resetPasswordWrapper}>
          {/* <div className={styles.resetWrapper}>
            <ButtonBase
              classes={{ root: classes.closeBtn }}
              onClick={handleToggle}
            >
              <Close />
            </ButtonBase>
          </div> */}
          <div >
            <h2 className={styles.heading}>Are You Sure</h2>
          </div>
            <div>
              <p className={styles.des}>
                Do you really want to delete the item?
              </p>
            </div>

          <div className={styles.printFlex}>
            <div>
              <Button onClick={handleToggle} color="primary">
                Disagree
              </Button>
              <Button onClick={suspendItem} color="primary">
                Agree{" "}
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default DeleteModal;
