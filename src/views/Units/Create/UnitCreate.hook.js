import React, { useCallback, useEffect, useRef } from "react";
import { useState } from "react";
import { useParams } from "react-router";
import SnackbarUtils from "../../../libs/SnackbarUtils";
import historyUtils from "../../../libs/history.utils";
import LogUtils from "../../../libs/LogUtils";
import {
  serviceCreateUnit,
  serviceUpdateUnit,
  serviceDeleteUnit,
  serviceGetUnitDetails,
} from "../../../services/Unit.service";
import { actionDeleteProduct} from "../../../actions/Product.action";

import { useDispatch, useSelector } from "react-redux";
  
function useUnitCreateHook({handleToggle, editData, id}) {
 
  const initialForm = {
    name: "",
    is_general: false,
    is_active: true,
    
  };

  const [form, setForm] = useState({ ...initialForm });
  //const [editData, setEditData] = useState(null);
 
  const [errorData, setErrorData] = useState({});
  const [images, setImages] = useState(null);
  //const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const [listData, setListData] = useState({
    ROLES: [],
    UNITS: [],
  });
 
  const checkFormValidation = useCallback(() => {
    const errors = { ...errorData };
    let required = ["name"];
    
    required.forEach((val) => {
      if (
        (!form?.[val] && parseInt(form?.[val]) != 0) ||
        (Array.isArray(form?.[val]) && form?.[val]?.length === 0)
      ) {
        errors[val] = true;
      }
    });
    if (form?.name?.length < 2) {
      errors["name"] = true;
    }
    if (form?.code?.length < 2) {
      errors["code"] = true;
    }
    Object.keys(errors).forEach((key) => {
      if (!errors[key]) {
        delete errors[key];
      }
    });
    return errors;
  }, [form, errorData]);

  const removeError = useCallback(
    (title) => {
      const temp = JSON.parse(JSON.stringify(errorData));
      temp[title] = false;
      setErrorData(temp);
    },
    [setErrorData, errorData]
  );
  
  const changeTextData = useCallback(
    // (text, fieldName) => {
    //   let shouldRemoveError = true;
    //   const t = { ...form };
      (value, fieldName) => {
        let updatedForm = { ...form };
    
       
        if (fieldName === "is_general") {
          updatedForm.is_general = value; 
        } else {
          updatedForm[fieldName] = value;
        }
    
        setForm(updatedForm); 
        removeError(fieldName); 
      },
    [removeError, form, setForm]
  );
 
 console.log("id before useEffect: ", id);
  
  useEffect(() => {
    console.log("Inside useEffect with id:", id);
    if (id) {
      serviceGetUnitDetails({ id: id }).then((res) => {
        console.log("API Response:", res);
        if (!res.error) {
          const data = res?.data;
  
          const formData = {
            ...form,
            name: data?.name,
            is_general: data?.is_general,
            is_active: data?.is_active,
           
            
          };
  
          setForm(formData);
         
        } else {
          SnackbarUtils.error(res?.message);
        }
      });
     
    }
  }, [id]);
  
  console.log("updated form",form);
  const submitToServer = useCallback(
    () => {
      if (!isSubmitting) {
        setIsSubmitting(true);
  
      
        const errors = {};
        if (!form.name.trim()) {
          errors.name = "Unit Name is required";
        }
       
        if (Object.keys(errors).length > 0) {
          setErrorData(errors);
          setIsSubmitting(false); 
          return;
        }
  
      
        const formData = {
          name: form.name.trim(),
          is_general: form.is_general,
          is_active: form.is_active,
        };

        let req;
        if (id) {
          formData.append("id", id);
          //formData.id = id;
          req = serviceUpdateUnit(formData);
        } else {
         
          req = serviceCreateUnit(formData);
        }
  
        req.then((res) => {
          if (!res.error) {
            
            handleToggle();
            //historyUtils.push("/unit");
            window.location.reload();
           
          } else {
            
            SnackbarUtils.error(res.message);
          }
          setIsSubmitting(false); 
        });
      }
    },
    [form, isSubmitting, setIsSubmitting, setErrorData, id, editData]
  );
 
  const onBlurHandler = useCallback(
    (type) => {
      if (form?.[type]) {
        changeTextData(form?.[type].trim(), type);
      }
    },
    [changeTextData]
  );

  const handleSubmit = useCallback(
    async (status) => {
      const errors = checkFormValidation();
      LogUtils.log("errors==>", errors);
      if (Object.keys(errors)?.length > 0) {
        setErrorData(errors);
        return true;
      }
      submitToServer(status);
    },
    [checkFormValidation, setErrorData, form, submitToServer]
  );

  // const handleDelete = useCallback(
  //   (id) => {
  //     dispatch( actionDeleteProduct(id));
  //     setEditData(null);
  //   },
  //   [setEditData]
  // );
  return {
    form,
    errorData,
    listData,
    changeTextData,
    onBlurHandler,
    removeError,
    handleSubmit,
    isSubmitting,
    images,
    id,
    //handleDelete,
  };
}

export default useUnitCreateHook;
