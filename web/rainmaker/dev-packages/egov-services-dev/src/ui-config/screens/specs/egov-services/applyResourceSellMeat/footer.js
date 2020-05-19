import {
  dispatchMultipleFieldChangeAction,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";
import { getCommonApplyFooter, validateFields } from "../../utils";
import "./index.css";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { httpRequest } from "../../../../../ui-utils";

import {
  createUpdateSellMeatNocApplication,
  prepareDocumentsUploadData
} from "../../../../../ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getOPMSTenantId, localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
import { UpdateStatus } from "../../../../../ui-utils/commons";
import { getAccessToken, getLocale, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";

let role_name = JSON.parse(getUserInfo()).roles[0].code
const setReviewPageRoute = (state, dispatch, applnid) => {
  let tenantId = '';
  const applicationNumber = get(state, "screenConfiguration.preparedFinalObject.SELLMEATNOC.applicationId");

  if (applicationNumber) {
    tenantId = getOPMSTenantId();
    const appendUrl =
      process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
    const reviewUrl = `${appendUrl}/egov-services/sellmeatnoc_summary?applicationNumber=${applicationNumber}&tenantId=${tenantId}`;
    dispatch(setRoute(reviewUrl));
  }
  else {
    tenantId = getOPMSTenantId();
    const appendUrl =
      process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
    const reviewUrl = `${appendUrl}/egov-services/sellmeatnoc_summary?applicationNumber=${applnid}&tenantId=${tenantId}`;
    dispatch(setRoute(reviewUrl));
  }
};

const moveToReview = (state, dispatch, applnid) => {
  const documentsFormat = Object.values(
    get(state.screenConfiguration.preparedFinalObject, "documentsUploadRedux")
  );

  let validateDocumentField = false;

  for (let i = 0; i < documentsFormat.length; i++) {
    let isDocumentRequired = get(documentsFormat[i], "isDocumentRequired");
    let isDocumentTypeRequired = get(
      documentsFormat[i],
      "isDocumentTypeRequired"
    );

    let documents = get(documentsFormat[i], "documents");
    if (isDocumentRequired) {
      if (documents && documents.length > 0) {
        if (isDocumentTypeRequired) {
          if (get(documentsFormat[i], "dropdown.value")) {
            validateDocumentField = true;
          } else {
            dispatch(
              toggleSnackbar(
                true,
                { labelName: "Please select type of Document!", labelKey: "" },
                "warning"
              )
            );
            validateDocumentField = false;
            break;
          }
        } else {
          validateDocumentField = true;
        }
      } else {
        dispatch(
          toggleSnackbar(
            true,
            { labelName: "Please uplaod mandatory documents!", labelKey: "" },
            "warning"
          )
        );
        validateDocumentField = false;
        break;
      }
    } else {
      validateDocumentField = true;
    }
  }

  /// Removed from here pls do not remove commented code 
  // if (validateDocumentField) {
  //   setReviewPageRoute(state, dispatch, applnid);
  // };
  return validateDocumentField;
};

const getMdmsData = async (state, dispatch) => {
  let tenantId = getOPMSTenantId();
  /** get(
    state.screenConfiguration.preparedFinalObject,
    "SELLMEATNOC.tenantId"
  ); */
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        { moduleName: "SellMeatNOC", masterDetails: [{ name: "SellMeatDocuments" }] }
      ]
    }
  };
  try {
    let payload = await httpRequest(
      "post", "/egov-mdms-service/v1/_search", "_search", [],
      mdmsBody
    );

    dispatch(
      prepareFinalObject(
        "applyScreenMdmsData.SELLMEATNOC.SellMeatDocuments",
        payload.MdmsRes.SELLMEATNOC.SellMeatDocuments
      )
    );
    prepareDocumentsUploadData(state, dispatch, 'apply_sellmeat');
  } catch (e) {
    console.log(e);
  }
};





const callBackForNext = async (state, dispatch) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["applysellmeat"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  
  //alert("activestepsss asd : " + (activeStep+1))
  // validatestepform(activeStep+1)
  // console.log(activeStep);
  let isFormValid = true;
  let hasFieldToaster = false;
  
  let validatestepformflag = validatestepform(activeStep + 1)
  
  isFormValid = validatestepformflag[0];
  hasFieldToaster = validatestepformflag[1];
  // alert('activeStep final :'+activeStep)
  if (activeStep === 0) {
    let isapplicantnamevalid = validateFields(
      "components.div.children.formwizardSecondStep.children.nocDetails.children.cardContent.children",
      state,
      dispatch
    );
  }
  if (activeStep === 1) {
    isFormValid = moveToReview(state, dispatch);
  }
  if (activeStep !== 2) {
    if (isFormValid) {
      let responseStatus = "success";
      if (activeStep === 1) {
        prepareDocumentsUploadData(state, dispatch, 'apply_sellmeat');

        let statuss = localStorageGet("app_noc_status") == "REASSIGN" ? "RESENT" : "INITIATED";
        let response = await createUpdateSellMeatNocApplication(state, dispatch, statuss);
        responseStatus = get(response, "status", "");
        let applicationId = get(response, "applicationId", "");

        if (responseStatus == "SUCCESS" || responseStatus == "success") {
          isFormValid = moveToReview(state, dispatch, applicationId);
          if (isFormValid) {
            setReviewPageRoute(state, dispatch, applicationId);
          }
          let errorMessage = {
            labelName: 'APPLICATION ' + statuss + ' SUCCESSFULLY! ',
            labelKey: "" //UPLOAD_FILE_TOAST
          };
          dispatch(toggleSnackbar(true, errorMessage, "success"));

        } else {
          // let errorMessage = {
          //   labelName:
          //     "Submission Falied, Try Again!",
          //   labelKey: "UPLOAD_FILES_TOAST"
          // };
          // dispatch(toggleSnackbar(true, errorMessage, "warning"));
          let errorMessage = {
            labelName: "Submission Falied, Try Again later!",
            labelKey: "" //UPLOAD_FILE_TOAST
          };
          dispatch(toggleSnackbar(true, errorMessage, "error"));
        }
      }
      responseStatus === "success" && changeStep(state, dispatch);
    } else if (hasFieldToaster) {
      let errorMessage = {
        labelName: "Please fill all mandatory fields !",
        labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
      };
      switch (activeStep) {
        case 1:
          errorMessage = {
            labelName:
              "Please check the Missing/Invalid field for Property Details, then proceed!",
            labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_PROPERTY_TOAST"
          };
          break;
        case 2:
          errorMessage = {
            labelName:
              "Please fill all mandatory fields for Applicant Details, then proceed!",
            labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
          };
          break;
      }
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
    }
  }
};

export const changeStep = (
  state,
  dispatch,
  mode = "next",
  defaultActiveStep = -1
) => {
  //alert("Inside step change")
  let activeStep = get(
    state.screenConfiguration.screenConfig["applysellmeat"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  if (defaultActiveStep === -1) {
    // if (activeStep === 2 && mode === "next") {
    //   const isDocsUploaded = get(
    //     state.screenConfiguration.preparedFinalObject,
    //     "LicensesTemp[0].reviewDocData",
    //     null
    //   );
    //   activeStep = isDocsUploaded ? 3 : 2;
    // } else {
    activeStep = mode === "next" ? activeStep + 1 : activeStep - 1;
    // }
  } else {
    activeStep = defaultActiveStep;
  }

  const isPreviousButtonVisible = activeStep > 0 ? true : false;
  const isNextButtonVisible = activeStep < 4 ? true : false;
  const isPayButtonVisible = activeStep === 4 ? true : false;
  const actionDefination = [
    {
      path: "components.div.children.stepper.props",
      property: "activeStep",
      value: activeStep
    },
    {
      path: "components.div.children.footer.children.previousButton",
      property: "visible",
      value: isPreviousButtonVisible
    },
    {
      path: "components.div.children.footer.children.nextButton",
      property: "visible",
      value: isNextButtonVisible
    },
    {
      path: "components.div.children.footer.children.payButton",
      property: "visible",
      value: isPayButtonVisible
    }
  ];
  dispatchMultipleFieldChangeAction("applysellmeat", actionDefination, dispatch);
  renderSteps(activeStep, dispatch);
};

export const renderSteps = (activeStep, dispatch) => {
  switch (activeStep) {
    case 0:
      dispatchMultipleFieldChangeAction(
        "applysellmeat",
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
      break;
    default:
      dispatchMultipleFieldChangeAction(
        "applysellmeat",
        getActionDefinationForStepper(
          "components.div.children.formwizardSecondStep"
        ),
        dispatch
      );
      break;

  }
};

export const getActionDefinationForStepper = path => {
  const actionDefination = [
    {
      path: "components.div.children.formwizardFirstStep",
      property: "visible",
      value: true
    },
    {
      path: "components.div.children.formwizardSecondStep",
      property: "visible",
      value: false
    }

  ];
  for (var i = 0; i < actionDefination.length; i++) {
    actionDefination[i] = {
      ...actionDefination[i],
      value: false
    };
    if (path === actionDefination[i].path) {
      actionDefination[i] = {
        ...actionDefination[i],
        value: true
      };
    }
  }
  return actionDefination;
};

export const callBackForPrevious = (state, dispatch) => {
  changeStep(state, dispatch, "previous");
};

export const footer = getCommonApplyFooter({
  previousButton: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
        // minWidth: "200px",
        height: "48px",
        marginRight: "16px"
      }
    },
    children: {
      previousButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_left"
        }
      },
      previousButtonLabel: getLabel({
        labelName: "Previous Step",
        labelKey: "NOC_COMMON_BUTTON_PREV_STEP"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForPrevious
    },
    visible: false
  },
  nextButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        // minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      nextButtonLabel: getLabel({
        labelName: "Next Step",
        labelKey: "NOC_COMMON_BUTTON_NXT_STEP"
      }),
      nextButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForNext
    }
  },
  payButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        //minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "Submit",
        labelKey: "NOC_COMMON_BUTTON_SUBMIT"
      }),
      submitButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForNext
    },
    visible: false
  }
});

export const validatestepform = (activeStep, isFormValid, hasFieldToaster) => {
  let allAreFilled = true;
  if (activeStep == 1) {
    document.getElementById("apply_form" + activeStep).querySelectorAll("[required]").forEach(function (i) {
      //  alert(i+"::::"+i.value)
      //  alert(i.getAttribute("aria-invalid"))
      if (!i.value) {
        i.focus();
        allAreFilled = false;
        i.parentNode.classList.add("MuiInput-error-853");
        i.parentNode.parentNode.classList.add("MuiFormLabel-error-844");
      }
      if (i.getAttribute("aria-invalid") === 'true' && allAreFilled) {
        i.parentNode.classList.add("MuiInput-error-853");
        i.parentNode.parentNode.classList.add("MuiFormLabel-error-844");
        allAreFilled = false;
        isFormValid = false;
        hasFieldToaster = true;
      }
    })


    document.getElementById("apply_form" + activeStep).querySelectorAll("input[type='hidden']").forEach(function (i) {
      // alert("hidden "+i+"::::"+i.value)
      //  alert(i.getAttribute("aria-invalid"))
      if (i.value == i.placeholder) {
        //	 alert(" inside hidden "+i+"::"+i.placeholder+"::"+i.value)
        i.focus();
        allAreFilled = false;
        i.parentNode.classList.add("MuiInput-error-853");
        i.parentNode.parentNode.parentNode.classList.add("MuiFormLabel-error-844");
        allAreFilled = false;
        isFormValid = false;
        hasFieldToaster = true;
      }

    })
  } 
  if (allAreFilled == false) {
    //alert('Fill all fields')
    isFormValid = false;
    hasFieldToaster = true;
  }
  else {
    isFormValid = true;
    hasFieldToaster = false;
  }
  return [isFormValid, hasFieldToaster]
};