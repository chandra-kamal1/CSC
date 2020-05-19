import {
  getBreak,
  getCommonCard,
  getCommonContainer,
  getCommonHeader,
  getLabelWithValue,
  getStepperObject,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";

import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getFileUrlFromAPI,
  getQueryArg,
  getTransformedLocale,
  setBusinessServiceDataToLocalStorage
} from "egov-ui-framework/ui-utils/commons";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import { getSearchResultsView } from "../../../../ui-utils/commons";
import { searchBill } from "../utils/index";
//import  generatePdf from "../utils/receiptPdf";

import { citizenFooter } from "./searchResource/citizenFooter";
import {
  applicantSummary,
  institutionSummary
} from "./summaryResourceRoadCut/applicantSummary";
import { documentsSummary } from "./summaryResourceRoadCut/documentsSummary";
import { estimateSummary } from "./summaryResourceRoadCut/estimateSummary";
import { nocSummary } from "./summaryResourceRoadCut/nocSummary";
//import { propertySummary } from "./summaryResourceRoadCut/propertySummary";
import {
  getAccessToken,
  getOPMSTenantId,
  getLocale,
  getUserInfo,
  getapplicationNumber,
  localStorageGet
} from "egov-ui-kit/utils/localStorageUtils";
import {
  createUpdateRoadCutNocApplication
} from "../../../../ui-utils/commons";
import { taskStatusSummary } from './summaryResource/taskStatusSummary';


export const stepsData = [
  { labelName: "Road Cut NOC Details", labelKey: "ROADCUT_APPLICANT_DETAILS_NOC" },
  { labelName: "Documents", labelKey: "ROADCUT_STEP_DOCUMENTS_NOC" },
  { labelName: "Summary", labelKey: "SELLMEATNOC_SUMMARY" }
  //{ labelName: "Applicant Details", labelKey: "ROADCUT_STEP_APPLICANT_DETAILS_NOC" }
  
];
export const stepper = getStepperObject(
  { props: { activeStep: 2 } },
  stepsData
);


let role_name = JSON.parse(getUserInfo()).roles[0].code

const titlebar = getCommonContainer({
  header: getCommonHeader({
    labelName: "Application for Road Cut",
    labelKey: "ROADCUT_APPLY_NOC"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-opms",
    componentPath: "ApplicationNoContainer",
    props: {
      number: getQueryArg(window.location.href, "applicationNumber")
    }
  },
});



const callbackforSummaryActionSubmit = async (state, dispatch) => {
  //localStorage.setItem('btnType','INITIATED')
  //let response = await createUpdateRoadCutNocApplication(state, dispatch, "INITIATED");
  //alert("Submmited PP : "+JSON.stringify(response));
  const appendUrl = process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  const reviewUrl = `${appendUrl}/egov-opms/roadcutnoc-my-applications`;
  dispatch(setRoute(reviewUrl));

};

const callbackforSummaryActionCancel = async (state, dispatch) => {

  // localStorage.setItem('btnType','CANCEL')
  // let response = await createUpdateRoadCutNocApplication(state, dispatch, "INITIATED");
  // alert("Submmited PP : "+JSON.stringify(response));
  const appendUrl = process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  const reviewUrl = `${appendUrl}/egov-opms/home`;
  dispatch(setRoute(reviewUrl));

};

const callbackforSummaryActionDraft = async (state, dispatch) => {
  //localStorage.setItem('btnType','DRAFT') 
  let response = await createUpdateRoadCutNocApplication(state, dispatch, "INITIATED");
  // alert("Submmited PP : "+JSON.stringify(response));  

};

const callbackforSummaryActionResend = async (state, dispatch) => {

  //localStorage.setItem('btnType','INITIATED')

  let response = await createUpdateRoadCutNocApplication(state, dispatch, "INITIATED");
  //alert("Submmited PP : "+JSON.stringify(response));  

};

// const callbackforSummaryAction = async (state, dispatch, action) => {

//     if(action == 'SUBMIT')
//     {
//      // tenantId = getOPMSTenantId;
//       const appendUrl =
//       process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
//       const reviewUrl = `${appendUrl}/egov-opms/home`;
//       dispatch(setRoute(reviewUrl));
//     }
//     else if(action == 'DRAFT')
//     {
//       const appendUrl =
//       process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
//       const reviewUrl = `${appendUrl}/egov-opms/home`;
//       dispatch(setRoute(reviewUrl));
//     } else if(action == 'RESEND')
//     {
//       const appendUrl =
//       process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
//       const reviewUrl = `${appendUrl}/egov-opms/home`;
//       dispatch(setRoute(reviewUrl));
//     }
//     else
//     {
//       //tenantId = getOPMSTenantId;
//       const appendUrl =
//       process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
//       const reviewUrl = `${appendUrl}/egov-opms/home`;
//       dispatch(setRoute(reviewUrl));
//     }
//   };

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
      callBack: callbackforSummaryActionCancel
    },
    visible: true
  },
  // draftButton: {
  //   componentPath: "Button",
  //   props: {
  //     variant: "contained",
  //     color: "primary",
  //     style: {
  //      // minWidth: "200px",
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
  //     callBack: callbackforSummaryActionDraft
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
      callBack: callbackforSummaryActionResend
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
        labelName: "SEND",
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
      callBack: callbackforSummaryActionSubmit
    }
  }
});

const prepareDocumentsView = async (state, dispatch) => {
  //alert('prepare')
  let documentsPreview = [];

  // Get all documents from response
  let ROADCUTNOC = get(
    state,
    "screenConfiguration.preparedFinalObject.nocApplicationDetail[0]",
    {}
  );
  let uploadDocuments = JSON.parse(ROADCUTNOC.applicationdetail).hasOwnProperty('uploadDocuments') ?
    JSON.parse(ROADCUTNOC.applicationdetail).uploadDocuments[0]['fileStoreId'] : '';

  // let uploadPetPicture=JSON.parse(ROADCUTNOC.applicationdetail).hasOwnProperty('uploadPetPicture')?
  // JSON.parse(ROADCUTNOC.applicationdetail).uploadPetPicture[0]['fileStoreId']:'';

  let allDocuments = [];
  allDocuments.push(uploadDocuments)
  //allDocuments.push(uploadPetPicture)

  if (uploadDocuments !== '') {
    documentsPreview.push(
      {
        title: "uploadDocuments",
        fileStoreId: uploadDocuments,
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
};


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
      "roadcutnoc_summary",
      "components.div.children.headerDiv.children.header.children.downloadMenu",
      "props.data.menu",
      downloadMenu
    )
  );
  dispatch(
    handleField(
      "roadcutnoc_summary",
      "components.div.children.headerDiv.children.header.children.printMenu",
      "props.data.menu",
      printMenu
    )
  );
  /** END */
};

const setSearchResponse = async (
  state,
  dispatch,
  applicationNumber,
  tenantId
) => {
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
  name: "roadcutnoc_summary",
  beforeInitScreen: (action, state, dispatch) => {
    const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    const tenantId = getQueryArg(window.location.href, "tenantId");
    dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));
    searchBill(dispatch, applicationNumber, tenantId);
    
    setSearchResponse(state, dispatch, applicationNumber, tenantId);

    localStorage.setItem("applicationNumber", applicationNumber);

    let payload = get(state.screenConfiguration.preparedFinalObject, "ROADCUTNOC", []);
    set(state.screenConfiguration.preparedFinalObject.ROADCUTNOC, "ROADCUTNOC", payload);

    const queryObject = [
      { key: "tenantId", value: tenantId },
      { key: "businessServices", value: "ROADCUTNOC" }
    ];
    setBusinessServiceDataToLocalStorage(queryObject, dispatch);

    // Hide edit buttons
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.nocSummary.children.cardContent.children.header.children.editSection.visible",
      localStorageGet("app_noc_status") !== 'REASSIGN' ?  true : false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.applicantSummary.children.cardContent.children.header.children.editSection.visible",
      localStorageGet("app_noc_status") !== 'REASSIGN' ?  true : false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.documentsSummary.children.cardContent.children.header.children.editSection.visible",
      localStorageGet("app_noc_status") !== 'REASSIGN' ?  true : false
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
            moduleName: "ROADCUTNOC",
            //updateUrl: "/opms-services/v1/_update"
          }
        },
        body: role_name !== 'CITIZEN' ? getCommonCard({
         // estimateSummary: estimateSummary,
          applicantSummary: applicantSummary,
          nocSummary: nocSummary,
          // propertySummary: propertySummary,         
          documentsSummary: documentsSummary
        }) : getCommonCard({
          //estimateSummary: estimateSummary,
          applicantSummary: applicantSummary,
          nocSummary: nocSummary,
          documentsSummary: documentsSummary,
          //taskStatusSummary:taskStatusSummary,
          
        }),
        break: getBreak(),
        titlebarfooter,
        citizenFooter:
          process.env.REACT_APP_NAME === "Citizen" ? citizenFooter : citizenFooter
      }
    }
  }
};

export default screenConfig;
