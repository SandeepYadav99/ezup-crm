import React, { useCallback, useEffect, useRef } from "react";
import { useState } from "react";
import {
  HexCodeValid,
  isAlphaNumChars,
  isDate,
  isEmail,
  validateUrl,
} from "../../../libs/RegexUtils";
import { useParams } from "react-router";

import SnackbarUtils from "../../../libs/SnackbarUtils";
import historyUtils from "../../../libs/history.utils";
import LogUtils from "../../../libs/LogUtils";

import Constants from "../../../config/constants";
import { parsePhoneNumber } from "libphonenumber-js";

import useDebounce from "../../../hooks/DebounceHook";
import {
  serviceCreateProviderUser,
  serviceGetProviderUserDetail,
  serviceProfileManager,
  serviceProviderProfileGetKeyword,
  serviceUpdateProviderUser,
} from "../../../services/ProviderUser.service";

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
  };

  const [form, setForm] = useState({ ...initialForm });
  const [errorData, setErrorData] = useState({});
  const [images, setImages] = useState(null);
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const codeDebouncer = useDebounce(form?.contact, 6000);
  const [manager, setManager] = useState([]);
  const [department, setDepartment] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [listData, setListData] = useState({
    ADMIN: [],
    CITY_CHAPTERS: [],
    EVENTS: [],
    ADMIN_CHAPTERS: [],
    CHAPTERS: [],
  });

  // useEffect(() => {
  //   serviceGetList([
  //     "ADMIN",
  //     "CITY_CHAPTERS",
  //     "EVENTS",
  //     "ADMIN_CHAPTERS",
  //     "CHAPTERS",
  //   ]).then((res) => {
  //     if (!res.error) {
  //       setListData(res.data);
  //     }
  //   });
  // }, []);
  useEffect(() => {
    serviceProfileManager({}).then((res) => {
      if (!res?.error) {
        const data = res?.data;
        setManager(data);
      }
    });
  }, []);

  useEffect(() => {
    serviceProviderProfileGetKeyword({}).then((res) => {
      if (!res?.error) {
        const data = res?.data;
        setDepartment(data);
      }
    });
  }, []);
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
            role: data?.role,
            // type: string;
            employee_id: data?.employee_id,
            // joining_date: data?.joining_date,
            department: data?.department,
            designation: data?.designation,
            manager: data?.manager,
            // end_date: data?.end_date,
            userManage: data?.is_manager,

            invoiteToUser: data?.is_primary_user,

            // is_access_invite: data?.is_access_invite,
            // is_active: data?.status === Constants.GENERAL_STATUS.ACTIVE,
          };

          setForm(formData);
          setImages(data?.image);
        } else {
          SnackbarUtils.error(res?.message);
        }
      });
    }
  }, [id]);

  // const checkCodeValidation = useCallback(() => {
  //   "serviceUpdateAdminUserSearch"({
  //     contact: form?.contact,
  //     id: id ? id : "",
  //   }).then((res) => {
  //     if (!res.error) {
  //       const data = res?.data;

  //       // if (data?.full_contact === form?.contact) {
  //       //   setIsContactInList(true);
  //       // }
  //       if (data) {
  //         const tForm = {
  //           ...form,
  //           contact: data?.full_contact,
  //           email: data?.email,
  //           reg_id: data?.reg_id,
  //           name2: data?.name,
  //           member_id: data?.member?.id,
  //           title: data?.title,
  //           company_name:data?.member
  //           ?.name

  //         };
  //         setForm(tForm);
  //       } else {
  //         if (data?.contact !== form?.contact) {
  //           // setIsContactInList(false);
  //         }
  //         setForm({
  //           ...form,
  //           id: "",
  //         });
  //       }
  //     }
  //   });
  // }, [form, id, form?.contact]);

  // useEffect(() => {
  //   if (codeDebouncer) {
  //     checkCodeValidation();
  //   }
  // }, [codeDebouncer]);

  const checkFormValidation = useCallback(() => {
    const errors = { ...errorData };
    let required = [
      "name",
      "email",
      "contact",
      "userName",
      "role",
      "employee_id",
      "joining_date",
      "department",
      "designation",
      "manager",
      "end_date",
    ];
    if (!id) {
      required.push("image");
    }
    required.forEach((val) => {
      if (
        (!form?.[val] && parseInt(form?.[val]) != 0) ||
        (Array.isArray(form?.[val]) && form?.[val]?.length === 0)
      ) {
        errors[val] = true;
      }
      if (val === "contact" && form?.contact) {
        const phoneNumber = parsePhoneNumber(form?.contact);

        if (phoneNumber) {
          if (phoneNumber.isValid() === false) {
            errors.contact = "Invalid Number";
          }
        } else {
          errors.contact = "Invalid Number";
        }
      }
    });

    if (form?.email && !isEmail(form?.email)) {
      errors.email = true;
    }
    // if (form?.url && !validateUrl(form?.url)) {
    //   errors.url = true;
    //   SnackbarUtils.error("Please Enter the Valid Url");
    // }
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
        t[fieldName] = text;
      } else if (fieldName === "contact") {
        t[fieldName] = text;
      } else if (fieldName === "userName") {
        t[fieldName] = text;
      } else if (fieldName === "email") {
        t[fieldName] = text;
      } else if (fieldName === "contact") {
        t[fieldName] = text;
      } else if (fieldName === "role") {
        t[fieldName] = text;
      } else if (fieldName === "department") {
        t[fieldName] = text;
      } else {
        t[fieldName] = text;
      }

      setForm(t);
      shouldRemoveError && removeError(fieldName);
    },
    [removeError, form, setForm]
  );
  console.log(form, "Form");
  const submitToServer = useCallback(
    (status) => {
      if (!isSubmitting) {
        setIsSubmitting(true);
        const fd = new FormData();

        const formDataFields = {
          name: form?.name,
          image: form?.image,
          contact: form?.contact,
          role: "5e186e7276f01e25bc9311a0",
          email: form?.email,
          employee_id: form?.employee_id,
          joining_date: form?.joining_date,
          exit_date: form?.end_date,
          department: form?.department,
          designation: form?.designation,
          manager: form?.manager,
          user_name: form?.userName,
          is_primary_user: form?.invoiteToUser,
          is_manager: form?.userManage,
          country_code: 91,
        };

        for (const field in formDataFields) {
          if (formDataFields.hasOwnProperty(field)) {
            fd.append(field, formDataFields[field]);
          }
        }

        let req;
        if (id) {
          fd.append("id",id)
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
          setIsSubmitting(false);
        });
      }
    },
    [form, isSubmitting, setIsSubmitting]
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
    // isContactInList,
    isOpen,
    manager,
    department,
  };
}

export default useUserCreateHook;
