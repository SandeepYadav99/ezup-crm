/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from "react";

import { useDispatch } from "react-redux";
import SnackbarUtils from "../../../libs/SnackbarUtils";
import {
  serviceResetPassword,
  serviceResetProfilePassword,
} from "../../../services/index.services";
import history from "../../../libs/history.utils";
import {
  useLocation,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { validatePassword } from "../../../libs/RegexUtils";

const initialForm = {
  password: "",
  confirm_password: "",
};

const useFirstResetPassowrd = ({ open, email, handleClose }) => {
  const [isLoading] = useState(false);

  const [errorData, setErrorData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ ...initialForm });

  const location = useLocation();
console.log(location)
  const getQueryParams = (search) => {
    return new URLSearchParams(search);
  };

  const queryParams = getQueryParams(location.search);
  console.log(queryParams)
  const tokenData = queryParams.get("token");
  const emailDataName = queryParams.get("email");
  const UserName = queryParams.get("name");
console.log(UserName)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(
      (prevShowConfirmPassword) => !prevShowConfirmPassword
    );
  };

  useEffect(() => {
    if (!open) {
      handleReset();
    }
  }, [open]);

  const checkFormValidation = useCallback(() => {
    const errors = { ...errorData };
    let required = ["password", "confirm_password"];
    required.forEach((val) => {
      if (
        !form?.[val] ||
        (Array.isArray(form?.[val]) && form?.[val].length === 0)
      ) {
        errors[val] = true;
      } else if (["code"].indexOf(val) < 0) {
        delete errors[val];
      }
    });
    if (!form?.password) {
      SnackbarUtils.error("New password field cannot be empty");
    } else {
      if (!validatePassword(form.password)) {
        errors.password = true;
        SnackbarUtils.error(
          "Password must contain at least one letter and one number"
        );
      }
      if (form?.password && form.password.length < 8) {
        errors.password = true;
        SnackbarUtils.error("Password must be at least 8 characters");
      }
    }

    if (
      form.confirm_password &&
      form?.password &&
      form.password !== form.confirm_password
    ) {
      errors.confirm_password = true;
      SnackbarUtils.error("Password doesn't match");
    }
    Object.keys(errors).forEach((key) => {
      if (!errors[key]) {
        delete errors[key];
      }
    });
    return errors;
  }, [form, errorData]);

  const submitToServer = useCallback(async () => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = {
        password: form?.password,
        token: tokenData,
      };
      const res = await serviceResetPassword(formData);
      if (!res.error) {
        history.push("/login");
        SnackbarUtils.success("Password Changed Successfully");
      } else {
        SnackbarUtils.error(res.message);
      }
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  }, [form, isSubmitting, setIsSubmitting]);

  const handleSubmit = useCallback(async () => {
    const errors = checkFormValidation();

    if (Object.keys(errors).length > 0) {
      setErrorData(errors);
    } else {
      await submitToServer();
    }
  }, [checkFormValidation, setErrorData, form, submitToServer]);

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
      if (fieldName === "password") {
        t[fieldName] = text;
      } else {
        t[fieldName] = text;
      }

      setForm(t);
      shouldRemoveError && removeError(fieldName);
    },
    [removeError, form, setForm]
  );

  const onBlurHandler = useCallback(
    (type) => {
      if (form?.[type]) {
        changeTextData(form?.[type].trim(), type);
      }
    },
    [changeTextData]
  );

  const handleReturn = () => {
    history.push("/login");
  };

  const handleReset = useCallback(() => {
    setForm({ ...initialForm });
    setErrorData({});
    setShowConfirmPassword(false);
    setShowPassword(false);
  }, [form, setForm]);

  return {
    form,
    changeTextData,
    onBlurHandler,
    removeError,
    handleSubmit,
    isLoading,
    isSubmitting,
    errorData,
    showConfirmPassword,
    showPassword,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleReturn,
    UserName,
    emailDataName,
  };
};

export default useFirstResetPassowrd;
