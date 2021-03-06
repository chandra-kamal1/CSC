import {
  getBreak, getCommonCard,
  getCommonContainer,
  getCommonHeader,
  getLabelWithValue,
  getStepperObject, getLabel,
  getCommonGrayCard,
  getCommonSubHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getFileUrlFromAPI, getQueryArg, getTransformedLocale, setBusinessServiceDataToLocalStorage } from "egov-ui-framework/ui-utils/commons";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import { getSearchResultsView, UpdateStatus } from "../../../../ui-utils/commons";
import { searchBill, createDemandForAdvNOC } from "../utils/index";
//import  generatePdf from "../utils/receiptPdf";
import { citizenFooter } from "./searchResource/citizenFooter";
import { httpRequest } from "../../../../ui-utils";
import {
  advertisementapplicantSummary, detailSummary

} from "./summaryResource/advertisementapplicantSummary";
import { taskStatusSummary } from "./summaryResource/taskStatusSummary";
import { documentsSummary } from "./summaryResource/documentsSummary";
import { estimateSummary } from "./summaryResource/estimateSummary";
import { getAccessToken, setapplicationType, getOPMSTenantId, getLocale, getUserInfo, localStorageGet, localStorageSet, setapplicationNumber } from "egov-ui-kit/utils/localStorageUtils";

export const stepsData = [
  { labelName: "Applicant Details", labelKey: "ADV_APPLICANT_DETAILS_NOC" },
  { labelName: "Advertisement Details", labelKey: "ADV_ADVERTISEMENT_DETAILS_NOC" },
  { labelName: "Documents", labelKey: "ADV_DOCUMENT_NOC" },
  { labelName: "Summary", labelKey: "ADV_SUMMARY_NOC" }
];
export const stepper = getStepperObject(
  { props: { activeStep: 3 } },
  stepsData
);


let role_name = JSON.parse(getUserInfo()).roles[0].code
//alert('CITIZEN');

const getMdmsData = async (action, state, dispatch) => {

  let tenantId = getOPMSTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "tenant",
          masterDetails: [
            {
              name: "tenants"
            }
          ]
        },
        {
          moduleName: "egpm",
          masterDetails: [
            {
              name: "typeOfAdvertisement"
            },
          ]
        },

      ]
    }
  };
  try {
    let payload = null;
    //alert('in payload')
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );


    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    console.log(e);
  }
};



const titlebar = getCommonContainer({
  header: getCommonHeader({
    labelName: "Apply New Permision for Advertisement ",
    labelKey: "ADV_APPLY_NOC"
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



const callbackforsummaryaction = async (state, dispatch) => {
  let tenantId = getOPMSTenantId();
  let action = "submit";
  if (action == 'submit') {
    const appendUrl =
      process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
    const reviewUrl = `${appendUrl}/egov-opms/advertisementnoc-my-applications`;
    dispatch(setRoute(reviewUrl));
  }
  else if (action == 'resend') {
    const appendUrl =
      process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
    const reviewUrl = `${appendUrl}/egov-opms/advertisementnoc-my-applications`;
    dispatch(setRoute(reviewUrl));
  }
  else {
    const appendUrl =
      process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
    const reviewUrl = `${appendUrl}/egov-opms/advertisementnoc-my-applications`;
    dispatch(setRoute(reviewUrl));
  }
};

const callbackforsummaryactionpay = async (state, dispatch) => {
  let tenantId = getOPMSTenantId();
  //alert("enter here")
  //Logic implemented as per the discussion that if exempted selected then redirect to my-application page
  const applicationid = getQueryArg(window.location.href, "applicationNumber");

  let applicantdetail = get(
    state,
    "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].applicationdetail",
    {}
  );
  let exempted = JSON.parse(applicantdetail).exemptedCategory;
  const appendUrl =
    process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  const reviewUrl = parseInt(exempted) === 1 ? `/egov-opms/advertisementnoc-my-applications`
    :
    localStorageGet('app_noc_status') === 'REASSIGN' ? `/egov-opms/advertisementnoc-my-applications` 
    : `${appendUrl}/egov-opms/pay?applicationNumber=${applicationid}&tenantId=${tenantId}`;
  dispatch(setRoute(reviewUrl));

}



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
        labelName: "SUBMIT",
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
  let documentsPreview = [];

  // Get all documents from response
  let advtnocdetail = get(
    state,
    "screenConfiguration.preparedFinalObject.nocApplicationDetail[0]",
    {}
  );
  let uploadVaccinationCertificate = JSON.parse(advtnocdetail.applicationdetail).hasOwnProperty('uploadDocuments') ?
    JSON.parse(advtnocdetail.applicationdetail).uploadDocuments[0]['fileStoreId'] : '';


  if (uploadVaccinationCertificate !== '') {
    documentsPreview.push({
      title: "NOC_ADV_PHOTOCOPY_HOARDING",
      fileStoreId: uploadVaccinationCertificate,
      linkText: "View"
    });
    let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
    let fileUrls =
      fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : {};
    documentsPreview = documentsPreview.map(function (doc, index) {

      doc["link"] = fileUrls && fileUrls[doc.fileStoreId] && fileUrls[doc.fileStoreId].split(",")[0] || "";
      //doc["name"] = doc.fileStoreId;
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
  tenantId,
  action
) => {
  const response = await getSearchResultsView([
    { key: "tenantId", value: tenantId },
    { key: "applicationNumber", value: applicationNumber }
  ]);

  dispatch(prepareFinalObject("nocApplicationDetail", get(response, "nocApplicationDetail", [])));
  // Set Institution/Applicant info card visibility

  dispatch(
    handleField(
      "advertisement_summary",
      "components.div.children.body.children.cardContent.children.advertisementapplicantSummary",
      "visible",
      true
    )
  );

  dispatch(
    handleField(
      "advertisement_summary",
      "components.div.children.body.children.cardContent.children.detailSummary",
      "visible",
      true
    )
  );


  prepareDocumentsView(state, dispatch);
  
  
  getMdmsData(action, state, dispatch).then(response => {
    let advertisementtypeselected = '';
    let advertisementsubtypeselected = '';
    let advt = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].applicationdetail", {});



  });
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "advertisement_summary",
  beforeInitScreen: (action, state, dispatch) => {
    const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    const tenantId = getQueryArg(window.location.href, "tenantId");
    dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));
    setapplicationType('ADVERTISEMENTNOC');
    searchBill(dispatch, applicationNumber, tenantId);
    setSearchResponse(state, dispatch, applicationNumber, tenantId, action);
    const queryObject = [
      { key: "tenantId", value: tenantId },
      { key: "businessServices", value: "ADVERTISEMENTNOC" }
    ];
    let status = localStorageGet("app_noc_status") == "REASSIGN" ? "RESENT" : "INITIATED";

    setBusinessServiceDataToLocalStorage(queryObject, dispatch);

    // Hide edit buttons
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.advertisementapplicantSummary.children.cardContent.children.header.children.editSection.visible",
      status === 'INITIATED' ? true : false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.detailSummary.children.cardContent.children.header.children.editSection.visible",
      status === 'INITIATED' ? true : false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.documentsSummary.children.cardContent.children.header.children.editSection.visible",
      status === 'INITIATED' ? true : false
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

        body: role_name !== 'CITIZEN' ? getCommonCard({
          estimateSummary: estimateSummary,
          advertisementapplicantSummary: advertisementapplicantSummary,
          detailSummary: detailSummary,
          documentsSummary: documentsSummary

        }) : getCommonCard({
          estimateSummary: estimateSummary,
          //estimateSummary: get(state,'screenConfiguration.preparedFinalObject.nocApplicationDetail[0].ReceiptTemp') ?  estimateSummary : {},
          advertisementapplicantSummary: advertisementapplicantSummary,
          detailSummary: detailSummary,
          documentsSummary: documentsSummary,
          //taskStatusSummary: taskStatusSummary,

        }),
        break: getBreak(),
        titlebarfooter,
        citizenFooter:
          process.env.REACT_APP_NAME === "Citizen" ? citizenFooter : {}
      }
    }
  }
};

export default screenConfig;
