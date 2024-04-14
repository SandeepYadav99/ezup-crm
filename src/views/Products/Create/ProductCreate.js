import React from "react";

import styles from "./Style.module.css";
import { ButtonBase, Typography } from "@mui/material";

import { PrimaryButton, ActionButton, OutlineButton } from "../../../components/Buttons/PrimaryButton";
// import WorkInfoView from "./Component/WorkInfoView";
import ProductInformation from "./Components/ProductInformation";
import ProductCommercials from "./Components/ProductCommercials";
import Settings from "./Components/Settings";
import { ArrowBackIos } from "@mui/icons-material";
import history from "../../../libs/history.utils";
import useProductCreateHook from "./ProductCreateHook";

const ProductCreate = ({}) => {
  const {
    errorData,
    changeTextData,
    form,
    onBlurHandler,
    handleSubmit,
    image,
    id,
    images,
    manager,
    department,
    listData,
  } = useProductCreateHook();

  return (
    <>
      <div className={styles.outerFlex1}>
        <div className={styles.iconButton}>
          <ButtonBase onClick={() => history.goBack()}>
            <ArrowBackIos fontSize={"small"} />{" "}
          </ButtonBase>
          <Typography variant={"h4"}>{id ? "Update" : "Create"} Product</Typography>
        </div>
      </div>
      <ProductInformation
        errorData={errorData}
        form={form}
        image={image}
        changeTextData={changeTextData}
        // handleSubmit={handleSubmit}
        onBlurHandler={onBlurHandler}
        listData={listData}
      />
     
      <ProductCommercials
        errorData={errorData}
        form={form}
       
        changeTextData={changeTextData}
        
        onBlurHandler={onBlurHandler}
        manager={manager}
        department={department}
      />
      <Settings
        errorData={errorData}
        form={form}
       
        changeTextData={changeTextData}
        
        onBlurHandler={onBlurHandler}
        manager={manager}
        department={department}
      />
     <div className={styles.buttonContainer}>
      <div className={styles.cancelButton}>
        
        <ActionButton sx={{ mt: 4 }}>CANCEL</ActionButton>
      </div>

      <div className={styles.saveButton}>
        <PrimaryButton color={"primary"} sx={{ mt: 4 }} onClick={handleSubmit}>
          {/* {isSubmitting ? ( */}
          {/* <CircularProgress color="success" size="20px" />
              ) : (  */}
          CREATE
          {/* )} */}
        </PrimaryButton>
      </div>
      </div>
    </>
  );
};

export default ProductCreate;
