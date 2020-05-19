import {
  getCommonCard, getCommonContainer, getCommonHeader, getLabelWithValue, getLabel, getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { gotoApplyWithStep } from "../utils/index";
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
import { searchBill, createDemandForRoadCutNOC } from "../utils/index";
//import  generatePdf from "../utils/receiptPdf";

import { footer } from "./applyResource/employeeRoadCutFooter";
//import { footer ,footerReview} from "./applyResource/footer";
import {
  adhocPopupForJeRoadCutForward, adhocPopupForJeRoadCutReassign, adhocPopupForCeRoadCutApprove,
  adhocPopupForSeRoadCutForward, adhocPopupForCeRoadCutReject
} from "./payResource/adhocPopup";

import { getRequiredDocuments } from "./requiredDocuments/reqDocs";

import { roadcutapplicantSummary } from "./summaryResource/roadcutapplicantSummary";
import { documentsSummary } from "./summaryResource/documentsSummary";
import { estimateSummary } from "./summaryResource/estimateSummary";
import { showHideAdhocPopup } from "../utils";

import { httpRequest } from "../../../../ui-utils";
import {
  localStorageGet, localStorageSet, setapplicationNumber, getOPMSTenantId, setapplicationType,
  getAccessToken, getLocale, getUserInfo, getapplicationType, getapplicationNumber
} from "egov-ui-kit/utils/localStorageUtils";

import {
  preparepopupDocumentsRoadCutUploadData, prepareDocumentsUploadData,
  getSearchResultsView, getSearchResultsForNocCretificate, getSearchResultsForNocCretificateDownload
} from "../../../../ui-utils/commons";
import { taskStatusSummary } from './summaryResource/taskStatusSummary';

let role_name = JSON.parse(getUserInfo()).roles[0].code

const ReassignButton = getCommonContainer({
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
    visible: localStorageGet("app_noc_status") == "REASSIGN" ? true : false

  }
});



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
              name: "color"
            },
            {
              name: "sector"
            },
            {
              name: "breed"
            },
            {
              name: "sex"
            },
            {
              name: "age"
            }
          ]
        },
        { moduleName: "RoadCutNOC", masterDetails: [{ name: "RoadCutNOCRemarksDocuments" }] }
      ]
    }
  };
  try {
    let payload = null;
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
    labelName: "Task Details",
    labelKey: "NOC_TASK_DETAILS_HEADER"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-opms",
    componentPath: "ApplicationNoContainer",
    props: {
      number: getapplicationNumber(),
    }
  },
  downloadMenu: {
    uiFramework: "custom-atoms",
    componentPath: "MenuButton",
    props: {
      data: {
        label: "Download",
        leftIcon: "cloud_download",
        rightIcon: "arrow_drop_down",
        props: { variant: "outlined", style: { marginLeft: 10 } },
        menu: []
      }
    }
  }//,
  // printMenu: {
  //   uiFramework: "custom-atoms",
  //   componentPath: "MenuButton",
  //   props: {
  //     data: {
  //       label: "Print",
  //       leftIcon: "print",
  //       rightIcon: "arrow_drop_down",
  //       props: { variant: "outlined", style: { marginLeft: 10 } },
  //       menu: []
  //     }
  //   }
  // }
});



const prepareDocumentsView = async (state, dispatch) => {
  let documentsPreview = [];

  // Get all documents from response
  let ROADCUTNOC = get(
    state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0]", {});
  let uploadDocuments = JSON.parse(ROADCUTNOC.applicationdetail).hasOwnProperty('uploadDocuments') ?
    JSON.parse(ROADCUTNOC.applicationdetail).uploadDocuments[0]['fileStoreId'] : '';

  // let uploadPetPicture=JSON.parse(ROADCUTNOC.applicationdetail).hasOwnProperty('uploadPetPicture')?
  // JSON.parse(ROADCUTNOC.applicationdetail).uploadPetPicture[0]['fileStoreId']:'';

  let allDocuments = [];
  allDocuments.push(uploadDocuments)
  
  if (uploadDocuments !== '') {
    documentsPreview.push(
      {
        title: "ROAD_CUT_STAMP_DOC",
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
  let downloadMenu = [];

  //Object creation for NOC's
  let certificateDownloadObjectPET = {
    label: { labelName: "NOC Certificate PET", labelKey: "NOC_CERTIFICATE_PET" },
    link: () => {
      window.location.href = httpLinkPET;
      //// generatePdf(state, dispatch, "certificate_download");
    },
    leftIcon: "book"
  };
  // let certificateDownloadObjectSELLMEAT = {
  //   label: { labelName: "NOC Certificate SELLMEAT", labelKey: "NOC_CERTIFICATE_SELLMEAT" },
  //   link: () => {
  //     window.location.href = httpLinkSELLMEAT;
  //   },
  //   leftIcon: "book"
  // };
  // let certificateDownloadObjectROADCUT = {
  //   label: { labelName: "NOC Certificate ROADCUT", labelKey: "NOC_CERTIFICATE_ROADCUT" },
  //   link: () => {
  //     window.location.href = httpLinkROADCUT;
  //   },
  //   leftIcon: "book"
  // };
  // let certificateDownloadObjectADVT = {
  //   label: { labelName: "NOC Certificate ADVT", labelKey: "NOC_CERTIFICATE_ADVT" },
  //   link: () => {
  //     window.location.href = httpLinkADVT;
  //   },
  //   leftIcon: "book"
  // };

  //Object creation for Receipt's
  // let certificateDownloadObjectPET_RECEIPT = {
  //   label: { labelName: "NOC Certificate PET", labelKey: "NOC_RECEIPT_PET" },
  //   link: () => {
  //    window.location.href = httpLinkPET_RECEIPT;
  //    //// generatePdf(state, dispatch, "certificate_download");
  //   },
  //   leftIcon: "book"
  // };
  // let certificateDownloadObjectROADCUT_RECEIPT = {
  //   label: { labelName: "NOC Certificate ROADCUT", labelKey: "NOC_RECEIPT_ROADCUT" },
  //   link: () => {
  //     window.location.href = httpLinkROADCUT_RECEIPT;
  //   },
  //   leftIcon: "book"
  // };
  // let certificateDownloadObjectADVT_RECEIPT = {
  //   label: { labelName: "NOC Certificate ADVT", labelKey: "NOC_RECEIPT_ADVT" },
  //   link: () => {
  //     window.location.href = httpLinkADVT_RECEIPT;
  //   },
  //   leftIcon: "book"
  // };

  downloadMenu = [
    certificateDownloadObjectPET
    //certificateDownloadObjectSELLMEAT,
    //certificateDownloadObjectROADCUT,
    //certificateDownloadObjectADVT,
    // certificateDownloadObjectPET_RECEIPT,
    // certificateDownloadObjectROADCUT_RECEIPT,
    // certificateDownloadObjectADVT_RECEIPT
  ];

  // switch (status) {
  //   case "APPROVED":
  //     downloadMenu = [
  //       certificateDownloadObject
  //     ];
  //     printMenu = [
  //       certificatePrintObject
  //     ];
  //     break;
  //   case "DOCUMENTVERIFY":
  //   case "FIELDINSPECTION":
  //   case "PENDINGAPPROVAL":
  //   case "REJECTED":
  //     downloadMenu = [receiptDownloadObject, applicationDownloadObject];
  //     printMenu = [receiptPrintObject, applicationPrintObject];
  //     break;
  //   case "CANCELLED":
  //   case "PENDINGPAYMENT":
  //     downloadMenu = [applicationDownloadObject];
  //     printMenu = [applicationPrintObject];
  //     break;
  //   default:
  //     break;
  // }
  dispatch(
    handleField(
      "roadcutnoc-search-preview",
      "components.div.children.headerDiv.children.header.children.downloadMenu",
      "props.data.menu",
      downloadMenu
    )
  );
  // dispatch(
  //   handleField(
  //     "search-preview",
  //     "components.div.children.headerDiv.children.header.children.printMenu",
  //     "props.data.menu",
  //     printMenu
  //   )
  // );
  /** END */
};

const HideshowEdit = (action, nocStatus, amount) => {
  // Hide edit buttons
  let showEdit = false;
  if (nocStatus === "REASSIGN") {
    showEdit = true;
  }
  set(
    action,
    "screenConfig.components.div.children.body.children.cardContent.children.nocSummary.children.cardContent.children.header.children.editSection.visible",
    role_name === 'CITIZEN' ? showEdit === true ? true : false : false
  );
  set(
    action,
    "screenConfig.components.div.children.body.children.cardContent.children.roadcutapplicantSummary.children.cardContent.children.header.children.editSection.visible",
    role_name === 'CITIZEN' ? showEdit === true ? true : false : false
  );
  set(
    action,
    "screenConfig.components.div.children.body.children.cardContent.children.documentsSummary.children.cardContent.children.header.children.editSection.visible",
    role_name === 'CITIZEN' ? showEdit === true ? true : false : false
  );

  set(
    action,
    "screenConfig.components.div.children.body.children.cardContent.children.taskStatusSummary.children.cardContent.children.header.children.editSection.visible",
    false
  );

  set(
    action,
    "screenConfig.components.div.children.footer.children.approve.visible",
    amount < 10000 && role_name == 'EE' ? true
      : role_name == 'CE' ? true : false
  );

  set(
    action,
    "screenConfig.components.div.children.footer.children.reject.visible",
    amount < 10000 && role_name == 'EE' ? true : role_name == 'CE' ? true : false
  );


  set(
    action,
    "screenConfig.components.div.children.footer.children.MakePayment.visible",
    (role_name === 'CITIZEN' && nocStatus === "APPROVED") ? true : false
  );


}

const setSearchResponse = async (state, action, dispatch, applicationNumber, tenantId) => {
  const response = await getSearchResultsView([
    { key: "tenantId", value: tenantId },
    { key: "applicationNumber", value: applicationNumber }
  ]);

  dispatch(prepareFinalObject("nocApplicationDetail", get(response, "nocApplicationDetail", [])));
  // Set Institution/Applicant info card visibility
  let applicationStatus = get(response, "nocApplicationDetail.[0].applicationstatus");

  let nocStatus = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].applicationstatus", {});
  localStorageSet("app_noc_status", nocStatus);
  localStorageSet("applicationStatus", applicationStatus);
  let amount = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].amount", {});
  let performancebankguaranteecharges = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].performancebankguaranteecharges", {});
  let gstamount = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].gstamount", {});
  HideshowEdit(action, nocStatus, amount);

  if (amount > 0 && performancebankguaranteecharges > 0 && gstamount > 0 && role_name == 'CITIZEN') {

    createDemandForRoadCutNOC(state, dispatch, applicationNumber, tenantId);
    searchBill(dispatch, applicationNumber, tenantId);

  }
  prepareDocumentsView(state, dispatch);
 
  if (role_name == 'CITIZEN')
    setSearchResponseForNocCretificate(state, dispatch, applicationNumber, tenantId);

};

let httpLinkPET;
let httpLinkROADCUT;
let httpLinkROADCUT_RECEIPT;


const setSearchResponseForNocCretificate = async (state, dispatch, applicationNumber, tenantId) => {
  let downloadMenu = [];
  let certificateDownloadObjectROADCUT_RECEIPT = {};
  let certificateDownloadObjectROADCUT = {};
  // let nocStatus = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].applicationstatus", {});
  let nocRemarks = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].remarks", {});

  let nocRemark = "";
  let nocStatus = "";

  //var resApproved = nocRemarks.filter(function (item) {
  //  return item.applicationstatus == "APPROVED";
  //});
  var resPaid = nocRemarks.filter(function (item) {
    return item.applicationstatus == "PAID";
  });

  //if (resApproved.length != 0)
  //  nocStatus = "APPROVED";

  if (resPaid.length != 0)
    nocRemark = "PAID";

  //role_name !== 'CITIZEN' ?
  if (nocRemark == "PAID") {
    let getCertificateDataForROADCUT = { "applicationType": "ROADCUTNOC", "tenantId": tenantId, "applicationId": applicationNumber, "dataPayload": { "requestDocumentType": "certificateData" } };

    //ROADCUTNOC
    const response0ROADCUT = await getSearchResultsForNocCretificate([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
      { key: "getCertificateData", value: getCertificateDataForROADCUT },
      { key: "requestUrl", value: "/pm-services/noc/_getCertificateData" }
    ]);

    let getFileStoreIdForROADCUT = { "nocApplicationDetail": [get(response0ROADCUT, "nocApplicationDetail[0]", "")] }
    //dispatch(prepareFinalObject("nocApplicationCertificateDetail", get(response, "nocApplicationDetail", [])));

    const response1ROADCUT = await getSearchResultsForNocCretificate([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
      { key: "getCertificateDataFileStoreId", value: getFileStoreIdForROADCUT },
      { key: "requestUrl", value: "/pdf-service/v1/_create?key=road-noc&tenantId=" + tenantId }
    ]);

    const response2ROADCUT = await getSearchResultsForNocCretificateDownload([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
      { key: "filestoreIds", value: get(response1ROADCUT, "filestoreIds[0]", "") },
      { key: "requestUrl", value: "/filestore/v1/files/url?tenantId=" + tenantId + "&fileStoreIds=" }
    ]);
    httpLinkROADCUT = get(response2ROADCUT, get(response1ROADCUT, "filestoreIds[0]", ""), "")

    //Object creation for NOC's
    certificateDownloadObjectROADCUT = {
      label: { labelName: "NOC Certificate ROADCUT", labelKey: "NOC_CERTIFICATE_ROADCUT" },
      link: () => {
        if (httpLinkROADCUT != "")
          window.location.href = httpLinkROADCUT;
        //// generatePdf(state, dispatch, "certificate_download");
      },
      leftIcon: "book"
    };

    //Receipts
    let getCertificateDataForROADCUT_RECEIPT = { "applicationType": "ROADCUTNOC", "tenantId": tenantId, "applicationId": applicationNumber, "dataPayload": { "requestDocumentType": "receiptData" } };

    //ROADCUTNOC_Receipts
    const response0ROADCUT_RECEIPT = await getSearchResultsForNocCretificate([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
      { key: "getCertificateData", value: getCertificateDataForROADCUT_RECEIPT },
      { key: "requestUrl", value: "/pm-services/noc/_getCertificateData" }
    ]);

    let getFileStoreIdForROADCUT_RECEIPT = { "nocApplicationDetail": [get(response0ROADCUT_RECEIPT, "nocApplicationDetail[0]", "")] }

    const response1ROADCUT_RECEIPT = await getSearchResultsForNocCretificate([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
      { key: "getCertificateDataFileStoreId", value: getFileStoreIdForROADCUT_RECEIPT },
      { key: "requestUrl", value: "/pdf-service/v1/_create?key=roadcut-receipt&tenantId=" + tenantId }
    ]);

    const response2ROADCUT_RECEIPT = await getSearchResultsForNocCretificateDownload([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
      { key: "filestoreIds", value: get(response1ROADCUT_RECEIPT, "filestoreIds[0]", "") },
      { key: "requestUrl", value: "/filestore/v1/files/url?tenantId=" + tenantId + "&fileStoreIds=" }
    ]);
    httpLinkROADCUT_RECEIPT = get(response2ROADCUT_RECEIPT, get(response1ROADCUT_RECEIPT, "filestoreIds[0]", ""), "")

    //Object creation for Receipt's
    certificateDownloadObjectROADCUT_RECEIPT = {
      label: { labelName: "NOC Receipt ROADCUT", labelKey: "NOC_RECEIPT_ROADCUT" },
      link: () => {
        if (httpLinkROADCUT_RECEIPT != "")
          window.location.href = httpLinkROADCUT_RECEIPT;
        //// generatePdf(state, dispatch, "certificate_download");
      },
      leftIcon: "book"
    };

  }

  if (nocRemark == "PAID") {
    downloadMenu = [
      certificateDownloadObjectROADCUT,
      certificateDownloadObjectROADCUT_RECEIPT
    ];
  }
  dispatch(
    handleField(
      "roadcutnoc-search-preview",
      "components.div.children.headerDiv.children.header.children.downloadMenu",
      "props.data.menu",
      downloadMenu
    )
  );

  //setDownloadMenu(state, dispatch);
};


const screenConfig = {
  uiFramework: "material-ui",
  name: "roadcutnoc-search-preview",
  beforeInitScreen: (action, state, dispatch) => {
    const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    setapplicationNumber(applicationNumber); //localStorage.setItem('ApplicationNumber', applicationNumber); , applicationNumber)

    const tenantId = getQueryArg(window.location.href, "tenantId");
    dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));

    //setSearchResponseForNocCretificate(state, dispatch, applicationNumber, tenantId);
    setSearchResponse(state, action, dispatch, applicationNumber, tenantId)
    // searchBill(dispatch, applicationNumber, tenantId);
    const queryObject = [
      { key: "tenantId", value: tenantId },
      { key: "businessServices", value: "ROADCUTNOC" }
    ];
    setBusinessServiceDataToLocalStorage(queryObject, dispatch);

    if (role_name == 'JE') {
      set(
        action,
        "screenConfig.components.adhocDialogForward.children.popup",
        adhocPopupForJeRoadCutForward
      );
    }
    else {
      set(
        action,
        "screenConfig.components.adhocDialogForward.children.popup",
        adhocPopupForSeRoadCutForward
      );
    }
    getMdmsData(action, state, dispatch).then(response => {
      prepareDocumentsUploadData(state, dispatch, 'popup_rodcut');
    });

    // Set Documents Data (TEMP)
    preparepopupDocumentsRoadCutUploadData(state, dispatch, 'ROADCUTNOC');

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
        taskStatus: {
          uiFramework: "custom-containers-local",
          componentPath: "WorkFlowContainer",
          moduleName: "egov-workflow",
          visible: process.env.REACT_APP_NAME === "Citizen" ? false : true,
          props: {
            dataPath: "Licenses",
            moduleName: "ROADCUTNOC",
          }

        },
        body: role_name !== 'CITIZEN' ? getCommonCard({
          // estimateSummary: estimateSummary,
          roadcutapplicantSummary: roadcutapplicantSummary,
          documentsSummary: documentsSummary
        }) : getCommonCard({
          estimateSummary: estimateSummary,
          roadcutapplicantSummary: roadcutapplicantSummary,
          documentsSummary: documentsSummary,
          taskStatusSummary: taskStatusSummary,
          ReassignButton
        }),
        // citizenFooter:
        //   process.env.REACT_APP_NAME === "Citizen" ? citizenFooter : {}
        footer: footer

      }
    },
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-opms",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "roadcutnoc-search-preview"
      },
      children: {

        popup: {}
        //popup:adhocPopup1

      }
    },


    adhocDialogForward: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-opms",
      componentPath: "ForwardContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "roadcutnoc-search-preview"
      },
      children: {

        popup: {}

      }
    },
    adhocDialog1: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-opms",
      componentPath: "ApproveContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "roadcutnoc-search-preview"
      },
      children: {

        popup: adhocPopupForCeRoadCutApprove

      }
    },
    adhocDialog3: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-opms",
      componentPath: "RejectContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "roadcutnoc-search-preview"
      },
      children: {
        popup: adhocPopupForCeRoadCutReject
      }
    },
    adhocDialog2: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-opms",
      componentPath: "ReassignContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "roadcutnoc-search-preview"
      },
      children: {

        popup: adhocPopupForJeRoadCutReassign

      }
    },
  }
};

export default screenConfig;
