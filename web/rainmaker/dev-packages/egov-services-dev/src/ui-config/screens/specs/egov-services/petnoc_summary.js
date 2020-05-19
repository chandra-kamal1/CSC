import {
  getCommonCard,
  getCommonContainer, getCommonHeader, getStepperObject, getLabel,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getFileUrlFromAPI, getQueryArg,
  getTransformedLocale,
  setBusinessServiceDataToLocalStorage
} from "egov-ui-framework/ui-utils/commons";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import { getSearchResultsView } from "../../../../ui-utils/commons";
import { searchBill, searchdemand } from "../utils/index";
//import  generatePdf from "../utils/receiptPdf";

import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { citizenFooter } from "./searchResource/citizenFooter";
import {
  applicantSummary,
  institutionSummary
} from "./summaryResource/applicantSummary";
import { documentsSummary } from "./summaryResource/documentsSummary";
import { estimateSummary } from "./summaryResource/estimateSummary";
import { nocSummary } from "./summaryResource/nocSummary";
import { immunizationSummary } from "./summaryResource/immunizationSummary";
import { getAccessToken, localStorageGet, localStorageSet, getOPMSTenantId, getLocale, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { taskStatusSummary } from './summaryResource/taskStatusSummary';
import { getRequiredDocuments } from "./requiredDocuments/reqDocs";
import { showHideAdhocPopup, showHideAdhocPopups } from "../utils";

export const stepsData = [
  { labelName: "PET NOC Details", labelKey: "Applicant_DETAILS" },
  { labelName: "Verternariy Details", labelKey: "STEP_PET_NOC_VETERINARY_DETAILS" },
  { labelName: "Documents", labelKey: "STEP_PET_NOC_DOCUMENTS" },
  { labelName: "Summary", labelKey: "ADV_SUMMARY_NOC" }
];
export const stepper = getStepperObject(
  { props: { activeStep: 3 } },
  stepsData
);


let role_name = JSON.parse(getUserInfo()).roles[0].code


const agree_undertaking = async (state, dispatch) => {
  let tenantId = getOPMSTenantId();
  event.target.checked === true ? localStorageSet("undertaking", "accept") : localStorageSet("undertaking", "")
  event.target.checked === true ? showHideAdhocPopups(state, dispatch, "petnoc_summary") : '';

}


const undertakingButton1 = getCommonContainer({
  addPenaltyRebateButton1: {
    componentPath: "Checkbox",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "20",
        height: "10px",
        marginRight: "5px",
        marginTop: "15px"
      }
    },
    children: {
      previousButtonLabel: getLabel({
        labelName: "Undertaking",
        labelKey: "NOC_UNDERTAKING"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => agree_undertaking(state, dispatch)
    },
    visible: localStorageGet('app_noc_status') === 'REASSIGN' ? false : true,
  },
  addPenaltyRebateButton: {
    componentPath: "Button",
    props: {
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "40px"
      }
    },
    children: {
      previousButtonLabel: getLabel({
        labelName: "Undertaking",
        labelKey: "NOC_UNDERTAKING"
      })
    },
    onClickDefination: {
      action: "condition",
      // callBack: (state, dispatch) => showHideAdhocPopups(state, dispatch, "search-preview")
    },
    visible: localStorageGet('app_noc_status') === 'REASSIGN' ? false : true,
  },
  resendButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "180px",
        height: "48px",
        marginRight: "45px",
        borderRadius: "inherit",
        align: "right"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "Resend",
        labelKey: "PM_COMMON_BUTTON_RESEND"
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
      callBack: (state, dispatch) => {
        gotoApplyWithStep(state, dispatch, 0);
      }
    },
    visible: false

  }
});
const titlebar = getCommonContainer({
  header: getCommonHeader({
    labelName: "Application for PET NOC",
    labelKey: "PET_NOC_APPLICATION_Detail"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-services",
    componentPath: "ApplicationNoContainer",
    props: {
      number: getQueryArg(window.location.href, "applicationNumber")
    }
  },
});



const callbackforsummaryactionpay = async (state, dispatch) => {
  let tenantId = getOPMSTenantId();
  //alert("enter here")

  const applicationid = getQueryArg(window.location.href, "applicationNumber");
  if (localStorageGet('app_noc_status') !== 'REASSIGN') {
    if (localStorageGet("undertaking") == "accept") {
      const appendUrl =
        process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
      const reviewUrl = `${appendUrl}/egov-services/pay?applicationNumber=${applicationid}&tenantId=${tenantId}`
      dispatch(setRoute(reviewUrl));
    }
    else {
      let errorMessage = {
        labelName:
          "Please Check Undertaking box!",
        labelKey: ""
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
    }
  } else {
    const reviewUrl = localStorageGet('app_noc_status') === 'REASSIGN' ?
      `/egov-services/my-applications` : ''
    dispatch(setRoute(reviewUrl));
  }

}

const callbackforsummaryaction = async (state, dispatch) => {
  let action = "submit";
  if (action == 'submit') {

    const appendUrl =
      process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
    const reviewUrl = `${appendUrl}/egov-services/home`;
    dispatch(setRoute(reviewUrl));
  }
  else if (action == 'draft') {

    const appendUrl =
      process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
    const reviewUrl = `${appendUrl}/egov-services/home`;
    dispatch(setRoute(reviewUrl));
  }
  else if (action == 'resend') {
    const appendUrl =
      process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
    const reviewUrl = `${appendUrl}/egov-services/home`;
    dispatch(setRoute(reviewUrl));
  }
  else {

    const appendUrl =
      process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
    const reviewUrl = `${appendUrl}/egov-services/home`;
    dispatch(setRoute(reviewUrl));
  }
};


var titlebarfooter = getCommonContainer({
  previousButton: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
        height: "48px",
        marginRight: "16px",

      }
    },
    children: {
      cancelButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_left"
        }
      },
      previousButtonLabel: getLabel({
        labelName: "Previous Step",
        labelKey: "NOC_CANCEL_BUTTON"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: callbackforsummaryaction
    },
    visible: true
  },
  // draftButton: {
  //   componentPath: "Button",
  //   props: {
  //     variant: "contained",
  //     color: "primary",
  //     style: {
  //       // minWidth: "200px",
  //       height: "48px",
  //       marginRight: "16px"
  //     }
  //   },
  //   children: {
  //     nextButtonLabel: getLabel({
  //       labelName: "SAVE AS DRAFT",
  //       labelKey: "NOC_SAVE_AS_DRAFT"
  //     }),
  //     nextButtonIcon: {
  //       uiFramework: "custom-atoms",
  //       componentPath: "Icon",
  //       props: {
  //         iconName: "keyboard_arrow_right"
  //       }
  //     }
  //   },
  //   onClickDefination: {
  //     action: "condition",
  //     callBack: callbackforsummaryaction
  //   }
  // },
  resendButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        // minWidth: "200px",
        height: "48px",
        marginRight: "16px"
      }
    },
    children: {
      nextButtonLabel: getLabel({
        labelName: "RESEND",
        labelKey: "NOC_RESEND_BUTTON"
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
      callBack: callbackforsummaryaction
    },
    visible: false
  },
  submitButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        // minWidth: "200px",
        height: "48px",
        marginRight: "16px"
      }
    },
    children: {
      nextButtonLabel: getLabel({
        labelName: "RESEND",
        labelKey: "NOC_SUBMIT_BUTTON"
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
      callBack: callbackforsummaryactionpay
    }
  }
});

const prepareDocumentsView = async (state, dispatch) => {
  //alert('prepare')
  let documentsPreview = [];

  // Get all documents from response
  let petnocdetail = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].applicationdetail", {});

  if (petnocdetail) {
    let uploadVaccinationCertificate = JSON.parse(petnocdetail).hasOwnProperty('uploadVaccinationCertificate') ?
      JSON.parse(petnocdetail).uploadVaccinationCertificate[0]['fileStoreId'] : '';

    let uploadPetPicture = JSON.parse(petnocdetail).hasOwnProperty('uploadPetPicture') ?
      JSON.parse(petnocdetail).uploadPetPicture[0]['fileStoreId'] : '';

    let allDocuments = [];
    allDocuments.push(uploadVaccinationCertificate)
    allDocuments.push(uploadPetPicture)


    if (uploadVaccinationCertificate !== '' && uploadPetPicture !== '') {
      documentsPreview.push({
        title: "uploadVaccinationCertificate",
        fileStoreId: uploadVaccinationCertificate,
        linkText: "View"
      }, {
        title: "uploadPetPicture",
        fileStoreId: uploadPetPicture,
        linkText: "View"
      });
      let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
      let fileUrls =
        fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : {};
      documentsPreview = documentsPreview.map(function (doc, index) {

        doc["link"] = fileUrls && fileUrls[doc.fileStoreId] && fileUrls[doc.fileStoreId].split(",")[0] || "";
        doc["name"] =
          (fileUrls[doc.fileStoreId] &&
            decodeURIComponent(
              fileUrls[doc.fileStoreId]
                .split(",")[0]
                .split("?")[0]
                .split("/")
                .pop()
                .slice(13)
            )) ||
          `Document - ${index + 1}`;
        return doc;
      });

      dispatch(prepareFinalObject("documentsPreview", documentsPreview));
    }
  }
};

// const prepareDocumentsUploadRedux = (state, dispatch) => {
//   dispatch(prepareFinalObject("documentsUploadRedux", documentsUploadRedux));
// };

const setDownloadMenu = (state, dispatch) => {
  /** MenuButton data based on status */
  let status = get(
    state,
    "screenConfiguration.preparedFinalObject.OpmsNOCs[0].opmsNOCDetails.status"
  );
  let downloadMenu = [];
  let printMenu = [];
  let certificateDownloadObject = {
    label: { labelName: "NOC Certificate", labelKey: "NOC_CERTIFICATE" },
    link: () => {
      // generatePdf(state, dispatch, "certificate_download");
    },
    leftIcon: "book"
  };
  let certificatePrintObject = {
    label: { labelName: "NOC Certificate", labelKey: "NOC_CERTIFICATE" },
    link: () => {
      // generatePdf(state, dispatch, "certificate_print");
    },
    leftIcon: "book"
  };
  let receiptDownloadObject = {
    label: { labelName: "Receipt", labelKey: "NOC_RECEIPT" },
    link: () => {
      // generatePdf(state, dispatch, "receipt_download");
    },
    leftIcon: "receipt"
  };
  let receiptPrintObject = {
    label: { labelName: "Receipt", labelKey: "NOC_RECEIPT" },
    link: () => {
      // generatePdf(state, dispatch, "receipt_print");
    },
    leftIcon: "receipt"
  };
  let applicationDownloadObject = {
    label: { labelName: "Application", labelKey: "NOC_APPLICATION" },
    link: () => {
      // generatePdf(state, dispatch, "application_download");
    },
    leftIcon: "assignment"
  };
  let applicationPrintObject = {
    label: { labelName: "Application", labelKey: "NOC_APPLICATION" },
    link: () => {
      // generatePdf(state, dispatch, "application_print");
    },
    leftIcon: "assignment"
  };
  switch (status) {
    case "APPROVED":
      downloadMenu = [
        certificateDownloadObject,
        receiptDownloadObject,
        applicationDownloadObject
      ];
      printMenu = [
        certificatePrintObject,
        receiptPrintObject,
        applicationPrintObject
      ];
      break;
    case "DOCUMENTVERIFY":
    case "FIELDINSPECTION":
    case "PENDINGAPPROVAL":
    case "REJECTED":
      downloadMenu = [receiptDownloadObject, applicationDownloadObject];
      printMenu = [receiptPrintObject, applicationPrintObject];
      break;
    case "CANCELLED":
    case "PENDINGPAYMENT":
      downloadMenu = [applicationDownloadObject];
      printMenu = [applicationPrintObject];
      break;
    default:
      break;
  }
  dispatch(
    handleField(
      "petnoc_summary",
      "components.div.children.headerDiv.children.header.children.downloadMenu",
      "props.data.menu",
      downloadMenu
    )
  );
  dispatch(
    handleField(
      "petnoc_summary",
      "components.div.children.headerDiv.children.header.children.printMenu",
      "props.data.menu",
      printMenu
    )
  );
  /** END */
};

const setSearchResponse = async (state, dispatch, applicationNumber, tenantId) => {
  const response = await getSearchResultsView([
    { key: "tenantId", value: tenantId },
    { key: "applicationNumber", value: applicationNumber }
  ]);

  dispatch(prepareFinalObject("nocApplicationDetail", get(response, "nocApplicationDetail", [])));

  prepareDocumentsView(state, dispatch);
  setDownloadMenu(state, dispatch);
};



const screenConfig = {
  uiFramework: "material-ui",
  name: "petnoc_summary",
  beforeInitScreen: (action, state, dispatch) => {
    const applicationNumber = getQueryArg(window.location.href, "applicationNumber");

    const tenantId = getQueryArg(window.location.href, "tenantId");
    dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));

    searchdemand(dispatch, applicationNumber, tenantId);
    searchBill(dispatch, applicationNumber, tenantId);

    setSearchResponse(state, dispatch, applicationNumber, tenantId);

    const queryObject = [
      { key: "tenantId", value: tenantId },
      { key: "businessServices", value: "PETNOC" }
    ];

    setBusinessServiceDataToLocalStorage(queryObject, dispatch);
    //Set Module Name
    set(state, "screenConfiguration.moduleName", "opms");
    // Hide edit buttons
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.applicantSummary.children.cardContent.children.header.children.editSection.visible",
      localStorageGet("app_noc_status") !== 'REASSIGN' ?  true : false
    );

    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.nocSummary.children.cardContent.children.header.children.editSection.visible",
      localStorageGet("app_noc_status") !== 'REASSIGN' ?  true : false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.immunizationSummary.children.cardContent.children.header.children.editSection.visible",
      localStorageGet("app_noc_status") !== 'REASSIGN' ?  true : false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.documentsSummary.children.cardContent.children.header.children.editSection.visible",
      localStorageGet("app_noc_status") !== 'REASSIGN' ?  true : false
    );
    set(
      action,
      "screenConfig.components.undertakingdialog.children.popup",
      getRequiredDocuments()
    );

    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 10
              },

              ...titlebar

            }
          }
        },
        stepper,
        taskStatus: {
          uiFramework: "custom-containers-local",
          componentPath: "WorkFlowContainer",
          moduleName: "egov-workflow",
          visible: process.env.REACT_APP_NAME === "Citizen" ? false : true,
          props: {
            dataPath: "nocApplicationDetail",
            moduleName: "petnoc_summary",
            //updateUrl: "/opms-services/v1/_update"
          }
        },
        body: role_name !== 'CITIZEN' ? getCommonCard({
          estimateSummary: estimateSummary,
          applicantSummary: applicantSummary,
          nocSummary: nocSummary,
          immunizationSummary: immunizationSummary,
          documentsSummary: documentsSummary
        }) : getCommonCard({

          estimateSummary: estimateSummary,
          applicantSummary: applicantSummary,
          nocSummary: nocSummary,
          immunizationSummary: immunizationSummary,
          documentsSummary: documentsSummary,
          undertakingButton1
          //taskStatusSummary: taskStatusSummary,
        }),
        break: getBreak(),
        titlebarfooter,
        citizenFooter:
          process.env.REACT_APP_NAME === "Citizen" ? citizenFooter : citizenFooter
      }
    }, undertakingdialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-services",
      componentPath: "UnderTakingContainer",
      props: {
        open: false,
        maxWidth: "md",
        screenKey: "petnoc_summary"
      },
      children: {
        popup: {}
        //popup:adhocPopup1
      },
      //visible : localStorageGet('app_noc_status') === 'REASSIGN' ? false :true,
    }
  }
};

export default screenConfig;
