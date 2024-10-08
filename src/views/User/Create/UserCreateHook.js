import React, { useCallback, useEffect, useMemo, useReducer } from "react";
import { useState } from "react";
import { isAlphaNum, isEmail, isSpace } from "../../../libs/RegexUtils";
import { useParams } from "react-router";

import SnackbarUtils from "../../../libs/SnackbarUtils";
import historyUtils from "../../../libs/history.utils";
import LogUtils from "../../../libs/LogUtils";

import parsePhoneNumberFromString from "libphonenumber-js";

import {
  serviceCreateProviderUser,
  serviceGetProviderUserDetail,
  serviceProfileManager,
  serviceProviderIsExist,
  serviceProviderProfileGetKeyword,
  serviceUpdateProviderUser,
} from "../../../services/ProviderUser.service";
import { serviceGetList } from "../../../services/index.services";
import debounce from "lodash.debounce";

function useUserCreateHook() {
  const initialForm = {
    name: "",
    userName: "",
    image: "",
    contact: "",
    email: "",
    role: "",
    type: "",
    employee_id: "",
    // password: "1231231admin",
    joining_date: "",
    department: "",
    designation: "",
    manager: "",
    end_date: "",
    userManage: false,
    invoiteToUser: false,
    status: "",
  };
  const initialState = {
    manager: [],
    department: [],
    ROLES: [],
    images: null,
    isSubmitting: false,
    designation: [],
  };
  const [form, setForm] = useState({ ...initialForm });
  const [errorData, setErrorData] = useState({});
  const { id } = useParams();

  const userData = localStorage.getItem("user");
  const userObject = JSON.parse(userData);

  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_MANAGER":
        return { ...state, manager: action.payload };
      case "SET_DEPARTMENT":
        return { ...state, department: action.payload };
      case "SET_DESIGNATION":
        return { ...state, designation: action.payload };
      case "ROLES":
        return { ...state, ROLES: action.payload };
      case "IMAGES":
        return { ...state, images: action.payload };
      case "IS_SUBMITING":
        return { ...state, isSubmitting: action.payload };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    Promise.all([
      serviceGetList(["ROLES"]),
      serviceProfileManager({}),
      serviceProviderProfileGetKeyword({
        query: "",
        type: "DEPARTMENT",
      }),
      serviceProviderProfileGetKeyword({
        query: "",
        type: "DESIGNATION",
      }),
    ]).then(([rolesRes, managerRes, departmentRes, designationRes]) => {
      if (!rolesRes.error) {
        dispatch({ type: "ROLES", payload: rolesRes.data });
      }
      if (!managerRes.error) {
        dispatch({ type: "SET_MANAGER", payload: managerRes.data });
      }
      if (!departmentRes.error) {
        dispatch({ type: "SET_DEPARTMENT", payload: departmentRes.data });
      }
      if (!designationRes.error) {
        dispatch({ type: "SET_DESIGNATION", payload: designationRes.data });
      }
    });
  }, []);

  const checkForUserInfo = useCallback(
    (data, fieldName, errorArr) => {
      if (data) {
        let filteredForm = { id: id ? id : userObject?.user_id };
        if (fieldName === "userName") {
          filteredForm["user_name"] = data;
        } else {
          filteredForm[fieldName] = data;
        }

        let req = serviceProviderIsExist({
          ...filteredForm,
        });
        req.then((res) => {
          if (!res.error) {
            const errors = JSON.parse(JSON.stringify(errorArr));
            if (res.data.is_exists) {
              if (fieldName === "employee_id") {
                errors[fieldName] = `Employee code already exist`;
              }
              if (fieldName === "email") {
                errors[fieldName] = `Email already exist`;
              }
              if (fieldName === "userName") {
                errors[fieldName] = `Username already exists`;
              }
              setErrorData(errors);
            } else {
              delete errors[fieldName];
              setErrorData(errors);
            }
          }
        });
      }
    },
    [id]
  );

  const checkUserInfoDebouncer = useMemo(() => {
    return debounce((e, fieldName, errorArr) => {
      checkForUserInfo(e, fieldName, errorArr);
    }, 1000);
  }, [checkForUserInfo]);

  useEffect(() => {
    if (id) {
      serviceGetProviderUserDetail({ id: id }).then((res) => {
        if (!res.error) {
          const data = res?.data;

          const formData = {
            ...form,
            name: data?.name,
            userName: data?.user_name,
            contact: data?.contact,
            email: data?.email,
            role: data?.role?.id,
            employee_id: data?.employee_id,
            joining_date: data?.joining_date,
            department: data?.department,
            designation: data?.designation,
            manager: data?.manager?.id,
            end_date: data?.exit_date,
            userManage: data?.is_manager,
            invoiteToUser: data?.is_primary_user,
            status: data?.status,
          };

          setForm(formData);
          dispatch({ type: "IMAGES", payload: data?.image });
          // setImages(data?.image);
        } else {
          SnackbarUtils.error(res?.message);
        }
      });
    }
  }, [id]);

  const checkFormValidation = useCallback(() => {
    const errors = { ...errorData };
    let required = [
      "name",
      "email",
      "contact",
      "userName",
      "status",
      // "role",
      ...(userObject?.user_id === id
        ? []
        : [
            "employee_id",
            // "end_date",
            // "joining_date",
            // "department",
            //  "designation",
            // "manager",
          ]),
    ];
    // if (!id) {
    //   required.push("image");
    // }
    required.forEach((val) => {
      if (
        (!form?.[val] && parseInt(form?.[val]) != 0) ||
        (Array.isArray(form?.[val]) && form?.[val]?.length === 0)
      ) {
        errors[val] = true;
      }

      if (val === "contact" && form?.contact) {
        const phoneNumber = parsePhoneNumberFromString(form.contact);

        if (phoneNumber) {
          if (phoneNumber?.isValid() === false) {
            errors.contact = true;
            SnackbarUtils.error("Invalid contact");
          }
        } else {
          errors.contact = true;
          SnackbarUtils.error("Invalid contact");
        }
      }
    });
   
    if (form?.name && form?.name?.trim().length < 2) {
      errors.name = true;
    }
    if (form?.userName && form?.userName?.trim().length < 2) {
      errors.userName = true;
    }
    if (form?.employee_id?.trim().length < 2) {
      errors.employee_id = true;
    }
    if (form?.designation && form?.designation?.trim().length < 2) {
      errors.designation = true;
    }
    if (form?.designation && form?.designation?.length > 40) {
      errors.designation =
        "Designation length must be  less than or equal to 40 characters ";
    }
    if (form?.department && form?.department?.trim().length < 2) {
      errors.department = true;
    }
    if (form?.department && form?.department?.length > 40) {
      errors.department =
        "Department length must be  less than or equal to 40 characters ";
    }
    if (form?.email && !isEmail(form?.email)) {
      errors.email = true;
    }

    if (form?.joining_date && form?.end_date) {
      const joinDate = new Date(form?.joining_date).getTime();
      const endDate = new Date(form?.end_date).getTime();

      if (joinDate > endDate) {
        errors.end_date = SnackbarUtils.error(
          "Joining date should not be greater than end date"
        );
        errors.end_date = true;
      }
    }
  
    Object.keys(errors).forEach((key) => {
      if (!errors[key]) {
        delete errors[key];
      }
    });
    return errors;
  }, [form, errorData, form?.country_code]);
  const removeError = useCallback(
    (title) => {
      const temp = JSON.parse(JSON.stringify(errorData));
      temp[title] = false;
      setErrorData(temp);
    },
    [setErrorData, errorData]
  );

  const changeTextData = useCallback(
    (text, fieldName) => {
      let shouldRemoveError = true;
      const t = { ...form };
      if (fieldName === "name") {
        if (!text || text.length <= 40) {
          t[fieldName] = text?.trimStart();
        }
      } else if (fieldName === "userName") {
        if (!text || (isAlphaNum(text) && text?.length <= 20)) {
          t[fieldName] = text?.toLowerCase()?.trimStart();
        }
      } else if (fieldName === "email") {
        if (text?.length <= 70) {
          t[fieldName] = text;
        }
      } else if (fieldName === "employee_id") {
        if (!text || (!isSpace(text) && text?.length <= 20)) {
          t[fieldName] = text;
        }
      } else if (fieldName === "department") {
      
        t[fieldName] = text?.toLowerCase();
        
      } else if (fieldName === "designation") {
      
        t[fieldName] = text?.toLowerCase();
     
      } else {
        t[fieldName] = text;
      }
      if (["email", "employee_id", "userName"].includes(fieldName)) {
        checkUserInfoDebouncer(text, fieldName, errorData);
      }
      setForm(t);
      shouldRemoveError && removeError(fieldName);
    },
    [removeError, form, setForm]
  );

  const submitToServer = useCallback(
    (status) => {
      if (!state?.isSubmitting) {
        dispatch({ type: "IS_SUBMITING", payload: true });

        const fd = new FormData();

        const formDataFields = {
          name: form?.name,
          image: form?.image,
          contact: form?.contact,
          email: form?.email,
          user_name: form?.userName,
          is_primary_user: true,
          status: form?.status,
          // email_send: form?.invoiteToUser,
          employee_id: form?.employee_id || userObject?.employee_id,
          country_code: 91,
        };
        // if (form?.manager ) {
        //   formDataFields.manager = form?.manager;
        // }
        // if (form?.role) {
        //   formDataFields.role_id = form?.role;
        // }
        if (userObject?.user_id !== id) {
          formDataFields.joining_date = form?.joining_date || "";
          formDataFields.exit_date = form?.end_date || "";
          formDataFields.department = form?.department ? form?.department : "";
          formDataFields.designation = form?.designation
            ? form?.designation
            : "";
          formDataFields.role_id = form?.role || "";
          formDataFields.manager = form?.manager || "";
          formDataFields.send_email = id ? false : form?.invoiteToUser;
          formDataFields.is_manager = form?.userManage;
        }

        for (const field in formDataFields) {
          if (formDataFields.hasOwnProperty(field)) {
            fd.append(field, formDataFields[field]);
          }
        }

        let req;
        if (id) {
          fd.append("id", id);
          // fd.append("image", images ? images : null);
          req = serviceUpdateProviderUser(fd);
        } else {
          req = serviceCreateProviderUser(fd);
        }
        req.then((res) => {
          if (!res.error) {
            historyUtils.goBack();
          } else {
            SnackbarUtils.error(res?.message);
          }
          dispatch({ type: "IS_SUBMITING", payload: false });
        });
      }
    },
    [form, state, checkFormValidation, setErrorData]
  );

  const onBlurHandler = useCallback(
    (type) => {
      // if (form?.[type]) {
      //   changeTextData(form?.[type].trim(), type);
      // }
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
    [checkFormValidation, setErrorData, form, submitToServer, state]
  );

  return {
    form,
    errorData,
    listData: state?.ROLES,
    changeTextData,
    onBlurHandler,
    removeError,
    handleSubmit,
    isSubmitting: state?.isSubmitting,
    images: state?.images,
    id,

    userId: userObject?.user_id,
    manager: state.manager,
    department: state.department,
    designation: state.designation,
  };
}

export default useUserCreateHook;
