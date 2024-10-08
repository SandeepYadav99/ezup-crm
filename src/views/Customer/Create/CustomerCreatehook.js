import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "react-router";
import { serviceProviderIsExist } from "../../../services/ProviderUser.service";
import { isEmail, validateUrl } from "../../../libs/RegexUtils";
import SnackbarUtils from "../../../libs/SnackbarUtils";
import historyUtils from "../../../libs/history.utils";
import LogUtils from "../../../libs/LogUtils";
import useDebounce from "../../../hooks/DebounceHook";
import history from "../../../libs/history.utils";
import RouteName from "../../../routes/Route.name";
import { leadOwnerList } from "../../../helper/Helper";
import { cleanContactNumber, removeUnderScore } from "../../../helper/Helper";
import {
  serviceContactCheck,
  serviceCreateContact,
  serviceCreateCustomer,
  serviceUpdateContact,
} from "../../../services/Contact.service";
import {
  serviceGetTagList,
  serviceGetUnitsList,
} from "../../../services/index.services";
import { serviceGetTagsList } from "../../../services/Blogs.service";
import { serviceGetList } from "../../../services/index.services";
import debounce from "lodash.debounce";

const initialForm = {
  prefix: "",
  full_name: "",
  gender: "NOT_PREFER",
  country_code: "",
  contact: "",
  email: "",
  source: "",
  notes: "",
  lead_owner: "",
  lead_stage: "",
  dob: "",
  doa: "",
  interested_products: [],
  tags: "",
};
const sourceDDValues = [
  "Website",
  "Social",
  "Affilate",
  "Referal",
  "Call",
  "Database",
  "Other",
];
const ContactCreatehook = () => {
  const [form, setForm] = useState({ ...initialForm });
  const [confirmPopUp, setConfirmPopUp] = useState(false);
  const [errorData, setErrorData] = useState({});
  const [source, setSource] = useState([...sourceDDValues]);
  const emailDebouncer = useDebounce(form.email, 500);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagList, setTagList] = useState([]);
  const [LeadOwnerData, setLeadOwnerData] = useState([]);
  const [associateTagsData, setAssociateTagsData] = useState([]);
  const [listData, setListData] = useState({
    PRODUCTS: [],
  });


  const { id } = useParams();
  useEffect(() => {
    
      
      setLeadOwnerData([...leadOwnerList]);
  
  }, []);
  useEffect(() => {
    (async () => {
      const promises = await Promise.allSettled([
        serviceGetTagsList(),
        serviceGetList(["PRODUCTS"]),
      ]);
      const tagList = promises[0]?.value?.data || [];
      const ProductList = promises[1]?.value?.data;
      console.log("Tag List:", tagList); 
    console.log("Product List:", ProductList);
       setAssociateTagsData([...tagList]);
      setListData(ProductList);
    })();
  }, []);
  // useEffect(() => {
  //   if (isOpen) {
   
  //     setLeadOwnerData([...leadOwnerList]);
  //   }
  // }, [isOpen]);
  const handleDialogClose = () => {
    setConfirmPopUp(false);
  };
  console.log("form", form);
  const checkFormValidation = useCallback(() => {
    const errors = { ...errorData };
    let required = [
      "email",
      "contact",
      "full_name",
      // "lead_stage"
    ];
    required.forEach((val) => {
      if (
        (!form?.[val] && parseInt(form?.[val]) !== 0) ||
        (Array.isArray(form?.[val]) && form?.[val]?.length === 0)
      ) {
        errors[val] = true;
      }
    });

    if (form?.email && !isEmail(form?.email)) {
      errors.email = true;
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
  const checkForCandidateInfo = (data) => {
    if (data?.contact || data?.email) {
      let req = serviceContactCheck({
        email: data?.email,
        id: id,
      });
      req.then((res) => {
        console.log("SALARY: ", res)
        if (!res.error) {
          const salaryData = res.data;
          console.log("SALARY: ", salaryData)
          if(salaryData?.is_exists){
            setConfirmPopUp(true)
          }
          // setCandidateData([...salaryData]);
          // if (salaryData?.length > 0) {
          //   setIsDialog(true);
          // }
        }
      });
    }
  };
  const checkCandidateExistDebouncer = useMemo(() => {
    return debounce((e) => {
      checkForCandidateInfo(e);
    }, 1000);
  }, []);
  const changeTextData = useCallback(
    (text, fieldName) => {
      let shouldRemoveError = true;
      const t = { ...form };
      if (fieldName === "full_name") {
        const alphabeticText = text.replace(/[^a-zA-Z\s]/g, "");
        if (alphabeticText.length <= 60) {
          t[fieldName] = alphabeticText;
        }
      } else if (fieldName === "interested_products") {
       
        t[fieldName] = text;
      } else {
        t[fieldName] = text;
      }

      setForm(t);
      if (["email"]?.includes(fieldName)) {
        checkCandidateExistDebouncer(t);
      }
      shouldRemoveError && removeError(fieldName);
    },
    [removeError, form, setForm, checkCandidateExistDebouncer]
  );

  const submitToServer = useCallback(() => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      const updatedFd = {};
      Object.keys({ ...initialForm }).forEach((key) => {
        if (key === "interested_products") {
          const getId =
            form[key]?.length > 0 ? form[key]?.map((item) => item?.id) : [];
          updatedFd[key] = getId;
        } else if (key === "tags") {
          updatedFd[key] = form[key]?.length > 0 ? form[key]?.join(",") : "";
        } else {
          updatedFd[key] = form[key];
        }
      });
      const cleanContact = cleanContactNumber(form?.contact);
      const contactValues = cleanContact.length ? cleanContact?.split(" ") : [];
      console.log(">>>>>", { updatedFd, form }, cleanContact?.split(" "));
      const serviceCall = form.id ? serviceUpdateContact : serviceCreateCustomer;
      serviceCall({
        ...updatedFd,
        country_code: contactValues?.length > 0 ? contactValues[0] : "",
        contact: contactValues?.length > 1 ? contactValues?.[1] : "",
      }).then((res) => {
        if (!res.error) {
          SnackbarUtils.success("Request Approved");
          historyUtils.goBack();
          // historyUtils.push(RouteName.CLAIMS_LIST);
        } else {
          SnackbarUtils.error(res?.message);
        }
        setIsSubmitting(false);
      });
    }
  }, [form, isSubmitting, setIsSubmitting]);
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
    [checkFormValidation, setErrorData, form]
  );

  const handleCancel = useCallback(() => {
    history.push(RouteName.CUSTOMER_LIST);
  }, []);

  return {
    form,
    errorData,
    source,
    changeTextData,
    handleSubmit,
    handleCancel,
    listData,
    confirmPopUp,
    tagList,
    LeadOwnerData,
    handleDialogClose,
    associateTagsData,
    id,
    // suspendItem
  };
};

export default ContactCreatehook;
