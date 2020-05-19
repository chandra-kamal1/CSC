import {
  getBreak, getCommonCard, getCommonContainer, getCommonHeader, getLabelWithValue, getStepperObject, getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { taskStatusSummary } from './summaryResource/taskStatusSummary';
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getFileUrlFromAPI, getQueryArg, getTransformedLocale, setBusinessServiceDataToLocalStorage } from "egov-ui-framework/ui-utils/commons";
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
} from "./summaryResource/applicantSummary";
import { documentsSummary } from "./summaryResource/documentsSummary";
import {
  sellmeatapplicantSummary
} from "./summaryResource/sellmeatapplicantSummary";
import {
  getAccessToken,
  getOPMSTenantId,
  getLocale,
  getUserInfo,
  localStorageGet
} from "egov-ui-kit/utils/localStorageUtils";

export const stepsData = [
  { labelName: "Sell Meat NOC Details", labelKey: "SELLMEATNOC_APPLICANT_DETAILS_NOC" },
  { labelName: "Documents", labelKey: "SELLMEATNOC_STEP_DOCUMENTS_NOC" },
  { labelName: "Summary", labelKey: "SELLMEATNOC_SUMMARY" }
];
export const stepper = getStepperObject(
  { props: { activeStep: 2 } },
  stepsData
);


let role_name = JSON.parse(getUserInfo()).roles[0].code
//alert('CITIZEN');

const titlebar = getCommonContainer({
  header: getCommonHeader({
    labelName: "Application for Sell Meat",
    labelKey: "SELLMEAT_APPLY_NOC"
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


// REdirect to home page on submit 
const callBackForNexthome = (state, dispatch) => {

  const appendUrl =
    process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  const reviewUrl = `${appendUrl}/egov-services/sellmeatnoc-my-applications`;
  dispatch(setRoute(reviewUrl));


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
      callBack: callBackForNexthome
    },
    visible: true
  },
  // draftButton: {
  // componentPath: "Button",
  // props: {
  // variant: "contained",
  // color: "primary",
  // style: {
  // // minWidth: "200px",
  // height: "48px",
  // marginRight: "16px"
  // }
  // },
  // children: {
  // nextButtonLabel: getLabel({
  // labelName: "SAVE AS DRAFT",
  // labelKey: "NOC_SAVE_AS_DRAFT"
  // }),
  // nextButtonIcon: {
  // uiFramework: "custom-atoms",
  // componentPath: "Icon",
  // props: {
  // iconName: "keyboard_arrow_right"
  // }
  // }
  // },
  // onClickDefination: {
  // action: "condition",
  // //callBack: callBackForNext
  // }
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
      //callBack: callBackForNext
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
      callBack: callBackForNexthome
    }
  }
});

const prepareDocumentsView = async (state, dispatch) => {
  let documentsPreview = [];

  // Get all documents from response
  let SELLMEATNOC = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0]", {});

  let uploadDocuments = SELLMEATNOC.hasOwnProperty('applicationdetail') ? JSON.parse(SELLMEATNOC.applicationdetail).hasOwnProperty('uploadDocuments') ?
    JSON.parse(SELLMEATNOC.applicationdetail).uploadDocuments[0]['fileStoreId'] : '' : '';

  let allDocuments = [];
  // allDocuments.push(uploadVaccinationCertificate)
  allDocuments.push(uploadDocuments)


  if (uploadDocuments !== '') {
    documentsPreview.push({
      title: "SELLMEAT.PROOF_POSSESSION_RENT_AGREEMENT",
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

const setSearchResponse = async (
  state,
  dispatch,
  applicationNumber,
  tenantId
) => {
  const response = await getSearchResultsView([
    {
      key: "tenantId",
      value: tenantId
    },
    { key: "applicationNumber", value: applicationNumber }
  ]);

  dispatch(prepareFinalObject("nocApplicationDetail", get(response, "nocApplicationDetail", [])));
  
  prepareDocumentsView(state, dispatch);
};



const screenConfig = {
  uiFramework: "material-ui",
  name: "sellmeatnoc_summary",
  beforeInitScreen: (action, state, dispatch) => {
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    const tenantId = getQueryArg(window.location.href, "tenantId");
    dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));
 
    //Since payment option is not there we have commented this
    //searchBill(dispatch, applicationNumber, tenantId);

    setSearchResponse(state, dispatch, applicationNumber, tenantId);

    const queryObject = [
      { key: "tenantId", value: tenantId },
      { key: "businessServices", value: "SELLMEATNOC" }
    ];
    setBusinessServiceDataToLocalStorage(queryObject, dispatch);

    // Hide edit buttons
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
            moduleName: "OPMS",
            //updateUrl: "/opms-services/v1/_update"
          }
        },
        body: role_name !== 'CITIZEN' ? getCommonCard({
          sellmeatapplicantSummary: sellmeatapplicantSummary,
          documentsSummary: documentsSummary
        }) : getCommonCard({
          sellmeatapplicantSummary: sellmeatapplicantSummary,
          documentsSummary: documentsSummary,
          //taskStatusSummary:taskStatusSummary

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
