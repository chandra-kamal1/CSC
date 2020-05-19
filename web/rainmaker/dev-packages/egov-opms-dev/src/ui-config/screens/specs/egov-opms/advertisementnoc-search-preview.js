import {
  getCommonCard, getCommonContainer, getCommonHeader, getLabelWithValue, getLabel, getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { gotoApplyWithStep } from "../utils/index";
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
import { searchBill, createDemandForAdvNOC } from "../utils/index";
//import  generatePdf from "../utils/receiptPdf";

import { footer } from "./applyResource/employeeAdvertisementFooter";
//import { footer ,footerReview} from "./applyResource/footer";
import { adhocPopupAdvertisementWithdraw, adhocPopupAdvertisementwithdrawApproval, adhocPopupAdvertisementForward, adhocPopupAdvertisementReassign, adhocPopupAdvertisementReject, adhocPopupAdvertisementApprove } from "./payResource/adhocPopup";
import { getRequiredDocuments } from "./requiredDocuments/reqDocs";
import { preparepopupDocumentsADVUploadData, prepareDocumentsUploadData } from "../../../../ui-utils/commons";
import { httpRequest } from "../../../../ui-utils";

import {
  advertisementapplicantSummary, detailSummary

} from "./summaryResource/advertisementapplicantSummary";
import { documentsSummary } from "./summaryResource/documentsSummary";
import { estimateSummary } from "./summaryResource/estimateSummary";
import { taskStatusSummary } from "./summaryResource/taskStatusSummary";
import { showHideAdhocPopup } from "../utils";

import { getAccessToken, getOPMSTenantId, getLocale, getUserInfo, localStorageGet, localStorageSet, setapplicationType, setapplicationNumber, getapplicationNumber } from "egov-ui-kit/utils/localStorageUtils";
import { getSearchResultsView, getSearchResultsForNocCretificate, getSearchResultsForNocCretificateDownload } from "../../../../ui-utils/commons";

let role_name = JSON.parse(getUserInfo()).roles[0].code

const undertakingButton = getCommonContainer({
  addPenaltyRebateButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
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
      callBack: (state, dispatch) => showHideAdhocPopup(state, dispatch, "advertisementnoc-search-preview")
    }
  },
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
              name: "typeOfAdvertisement"
            },
          ]
        },
        { moduleName: "AdvertisementNOC", masterDetails: [{ name: "AdvertisementNOCRemarksDocuments" }] }
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

  dispatch(
    handleField(
      "advertisementnoc-search-preview",
      "components.div.children.headerDiv.children.header.children.downloadMenu",
      "props.data.menu",
      downloadMenu
    )
  );
  /** END */
};

const HideshowEdit = (action, nocStatus, exemptedcategory) => {
  let showEdit = false;
  if (nocStatus === "REASSIGN") {
    showEdit = true;
  }
  // Hide edit buttons
  set(
    action,
    "screenConfig.components.div.children.body.children.cardContent.children.nocSummary.children.cardContent.children.header.children.editSection.visible",
    role_name === 'CITIZEN' ? showEdit === true ? true : false : false
  );
  set(
    action,
    "screenConfig.components.div.children.body.children.cardContent.children.advertisementapplicantSummary.children.cardContent.children.header.children.editSection.visible",
    role_name === 'CITIZEN' ? showEdit === true ? true : false : false
  );
  set(
    action,
    "screenConfig.components.div.children.body.children.cardContent.children.detailSummary.children.cardContent.children.header.children.editSection.visible",
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
    false);

  
  set(
    action,
    "screenConfig.components.div.children.footer.children.withdrawapprove.visible",
    role_name == "OSD" || role_name == "JEX"
      ? localStorageGet('pms_iswithdrawn')==="yes"
        ? exemptedcategory == 0
          ? true
          : false
        : false
      : false);

  set(
    action,
    "screenConfig.components.div.children.footer.children.withdraw.visible",
    role_name === "CITIZEN" ?
    localStorageGet('pms_iswithdrawn')!=="yes"
        ? exemptedcategory === 0
          ? true
          : false
        : false
      : false);

	set(
        action,
        "screenConfig.components.div.children.footer.children.nextButton.visible",
        role_name == "JEX" ||  role_name == "OSD"
              ?localStorageGet('pms_iswithdrawn')!=="yes"
              ? true
              : false
              :role_name == "SUPERINTENDENT"
              ? true
              :false
          );

		set(
            action,
            "screenConfig.components.div.children.footer.children.reassign.visible",
             role_name == "SUPERINTENDENT" || role_name == "OSD" || role_name == "COMMISSIONER"
                ? true
                  : role_name == "JEX"
                   ?localStorageGet('pms_iswithdrawn')!=="yes"
                    ?true
                    :false
                :false
        );
 
	set(
		action,
		"screenConfig.components.div.children.body.children.cardContent.children.detailSummary.children.cardContent.children.body.children.withdrawapprovalamount.visible",
		localStorageGet('pms_iswithdrawn')==="yes" ? true : false
	  );
}

const setSearchResponse = async (state, action, dispatch, applicationNumber, tenantId) => {
  const response = await getSearchResultsView([
    { key: "tenantId", value: tenantId },
    { key: "applicationNumber", value: applicationNumber }
  ]);

  dispatch(prepareFinalObject("nocApplicationDetail", get(response, "nocApplicationDetail", [])));
  // Set Institution/Applicant info card visibility
  let nocStatus = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].applicationstatus", {});
  localStorageSet("app_noc_status", nocStatus);
  let remarksData = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].remarks", []);
  
  remarksData.forEach(doc => {
    if(doc.applicationstatus=='WITHDRAWAFTERAPRROVAL' || doc.applicationstatus=='WITHDRAW'){
    localStorageSet("pms_iswithdrawn","yes");
  }
  });

  let applicationStatus = get(response, "nocApplicationDetail.[0].applicationstatus");
  localStorageSet("footerApplicationStatus", applicationStatus);
  let exampted = get(state.screenConfiguration.preparedFinalObject, 'nocApplicationDetail[0].applicationdetail');
  let exemptedcategory = JSON.parse(exampted)['exemptedCategory'];
  HideshowEdit(action, nocStatus, exemptedcategory);

  dispatch(
    handleField(
      "advertisementnoc-search-preview",
      "components.div.children.body.children.cardContent.children.advertisementapplicantSummary",
      "visible",
      true
    )
  );

  dispatch(
    handleField(
      "advertisementnoc-search-preview",
      "components.div.children.body.children.cardContent.children.detailSummary",
      "visible",
      true
    )
  );


  prepareDocumentsView(state, dispatch);
  if (role_name === 'CITIZEN')
    setSearchResponseForNocCretificate(state, dispatch, applicationNumber, tenantId);


  getMdmsData(action, state, dispatch).then(response => {
    //JSON.Parse(nocApplicationDetail[0].applicationdetail).typeOfAdvertisement

    let advertisementtypeselected = '';
    let advertisementsubtypeselected = '';
    let advt = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].applicationdetail",
      {}
    );

    //if (advertisementtypeselected !== null && advertisementtypeselected !== '' && advertisementtypeselected !== 'undefined') {
    if (advt !== null && advt !== '' && advt !== 'undefined') {
      advertisementtypeselected = JSON.parse(advt).typeOfAdvertisement;
      advertisementsubtypeselected = JSON.parse(advt).subTypeOfAdvertisement;
  
      let advertisementtypeid = get(state, "screenConfiguration.preparedFinalObject.applyScreenMdmsData.egpm.typeOfAdvertisement",
        []
      );
      let adv_id = advertisementtypeid.filter(item => {
        if (item.name == advertisementtypeselected) {
          localStorageSet("this_adv_code", item.code);
          localStorageSet("this_adv_id", item.id);
          item.subTypeOfAdvertisement.filter(subitem => {
            if (subitem.name === advertisementsubtypeselected) {
              localStorageSet("this_sub_adv_code", subitem.code);
              localStorageSet("this_sub_adv_id", subitem.id);
            }
          });

          createDemandForAdvNOC(state, dispatch, applicationNumber, tenantId);
        }
      });


    }
    else {
      alert("Error Fetching advertisement code. Reload!")
    }


  });
};

let httpLinkPET;


//setDownloadMenu(state, dispatch);


let httpLinkADVERTISEMENT;
let httpLinkADVERTISEMENT_RECEIPT;


const setSearchResponseForNocCretificate = async (
  state,
  dispatch,
  applicationNumber,
  tenantId
) => {
  let downloadMenu = [];
  let certificateDownloadObjectADVERTISEMENT_RECEIPT = {};
  let certificateDownloadObjectADVERTISEMENT = {};
  //let nocStatus = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].applicationstatus", {});
  let nocRemarks = get(state, "screenConfiguration.preparedFinalObject.nocApplicationDetail[0].remarks", {});
  
  let nocRemark = "";
  let nocStatus = "";

  var resApproved = nocRemarks.filter(function (item) {
    return item.applicationstatus == "APPROVED";
  });
  var resPaid = nocRemarks.filter(function (item) {
    return item.applicationstatus == "PAID";
  });

  var resWITHDRAWAPPROVAL = nocRemarks.filter(function (item) {
    return item.applicationstatus == "WITHDRAWAPPROVAL";
  });

  if (resApproved.length != 0)
    nocStatus = "APPROVED";

  if (resPaid.length != 0)
    nocRemark = "PAID";

  //role_name !== 'CITIZEN' ?
  if (nocStatus == "APPROVED" && resWITHDRAWAPPROVAL.length==0) {
    let getCertificateDataForADVERTISEMENT = { "applicationType": "ADVERTISEMENTNOC", "tenantId": tenantId, "applicationId": applicationNumber, "dataPayload": { "requestDocumentType": "certificateData" } };

    //ADVERTISEMENTNOC
    const response0ADVERTISEMENT = await getSearchResultsForNocCretificate([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
      { key: "getCertificateData", value: getCertificateDataForADVERTISEMENT },
      { key: "requestUrl", value: "/pm-services/noc/_getCertificateData" }
    ]);

    let getFileStoreIdForADVERTISEMENT = { "nocApplicationDetail": [get(response0ADVERTISEMENT, "nocApplicationDetail[0]", "")] }
    //dispatch(prepareFinalObject("nocApplicationCertificateDetail", get(response, "nocApplicationDetail", [])));
    
    const response1ADVERTISEMENT = await getSearchResultsForNocCretificate([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
      { key: "getCertificateDataFileStoreId", value: getFileStoreIdForADVERTISEMENT },
      { key: "requestUrl", value: "/pdf-service/v1/_create?key=advertisement-noc&tenantId=" + tenantId }
    ]);

    const response2ADVERTISEMENT = await getSearchResultsForNocCretificateDownload([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
      { key: "filestoreIds", value: get(response1ADVERTISEMENT, "filestoreIds[0]", "") },
      { key: "requestUrl", value: "/filestore/v1/files/url?tenantId="+tenantId+"&fileStoreIds=" }
    ]);
    httpLinkADVERTISEMENT = get(response2ADVERTISEMENT, get(response1ADVERTISEMENT, "filestoreIds[0]", ""), "")

    //Object creation for NOC's
    certificateDownloadObjectADVERTISEMENT = {
      label: { labelName: "NOC Certificate ADVERTISEMENT", labelKey: "NOC_CERTIFICATE_ADVERTISEMENT" },
      link: () => {
        if (httpLinkADVERTISEMENT != "")
          window.location.href = httpLinkADVERTISEMENT;
        //// generatePdf(state, dispatch, "certificate_download");
      },
      leftIcon: "book"
    };

  }
   if (nocRemark == "PAID" && resWITHDRAWAPPROVAL.length==0) {
    //Receipts
    let getCertificateDataForADVERTISEMENT_RECEIPT = { "applicationType": "ADVERTISEMENTNOC", "tenantId": tenantId, "applicationId": applicationNumber, "dataPayload": { "requestDocumentType": "receiptData" } };

    //ADVERTISEMENTNOC_Receipts
    const response0ADVERTISEMENT_RECEIPT = await getSearchResultsForNocCretificate([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
      { key: "getCertificateData", value: getCertificateDataForADVERTISEMENT_RECEIPT },
      { key: "requestUrl", value: "/pm-services/noc/_getCertificateData" }
    ]);

    let getFileStoreIdForADVERTISEMENT_RECEIPT = { "nocApplicationDetail": [get(response0ADVERTISEMENT_RECEIPT, "nocApplicationDetail[0]", "")] }

    const response1ADVERTISEMENT_RECEIPT = await getSearchResultsForNocCretificate([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
      { key: "getCertificateDataFileStoreId", value: getFileStoreIdForADVERTISEMENT_RECEIPT },
      { key: "requestUrl", value: "/pdf-service/v1/_create?key=advertisement-receipt&tenantId=" + tenantId }
    ]);

    const response2ADVERTISEMENT_RECEIPT = await getSearchResultsForNocCretificateDownload([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
      { key: "filestoreIds", value: get(response1ADVERTISEMENT_RECEIPT, "filestoreIds[0]", "") },
      { key: "requestUrl", value: "/filestore/v1/files/url?tenantId="+tenantId+"&fileStoreIds=" }
    ]);
    httpLinkADVERTISEMENT_RECEIPT = get(response2ADVERTISEMENT_RECEIPT, get(response1ADVERTISEMENT_RECEIPT, "filestoreIds[0]", ""), "")

    //Object creation for Receipt's
    certificateDownloadObjectADVERTISEMENT_RECEIPT = {
      label: { labelName: "NOC Receipt ADVERTISEMENT", labelKey: "NOC_RECEIPT_ADVERTISEMENT" },
      link: () => {
        if (httpLinkADVERTISEMENT_RECEIPT != "")
          window.location.href = httpLinkADVERTISEMENT_RECEIPT;
        //// generatePdf(state, dispatch, "certificate_download");
      },
      leftIcon: "book"
    };

  }
  
  if (nocStatus == "APPROVED" && nocRemark == "PAID" && resWITHDRAWAPPROVAL.length==0) {
    downloadMenu = [
      certificateDownloadObjectADVERTISEMENT,
      certificateDownloadObjectADVERTISEMENT_RECEIPT
    ];
  } else if (nocStatus == "APPROVED" && resWITHDRAWAPPROVAL.length==0) {
    downloadMenu = [
      certificateDownloadObjectADVERTISEMENT
    ];
  } else if (nocRemark == "PAID" && resWITHDRAWAPPROVAL.length==0) {
    downloadMenu = [
      certificateDownloadObjectADVERTISEMENT_RECEIPT
    ];
  }
  
  dispatch(
    handleField(
      "advertisementnoc-search-preview",
      "components.div.children.headerDiv.children.header.children.downloadMenu",
      "props.data.menu",
      downloadMenu
    )
  );

  //setDownloadMenu(state, dispatch);
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "advertisementnoc-search-preview",
  beforeInitScreen: (action, state, dispatch) => {
    const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    setapplicationNumber(applicationNumber);
    const tenantId = getQueryArg(window.location.href, "tenantId");
    dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));
    searchBill(dispatch, applicationNumber, tenantId);
    //localStorage.setItem('ApplicationNumber', applicationNumber); , applicationNumber)
    // localStorage.setItem('applicationType', 'ADVERTISEMENTNOC')
    setapplicationType('ADVERTISEMENTNOC');
    
    if (role_name == 'CITIZEN') {
      set(action, "screenConfig.components.adhocDialog.children.popup", adhocPopupAdvertisementWithdraw);
      }


    localStorageSet("pms_iswithdrawn","no")
    setSearchResponse(state, action, dispatch, applicationNumber, tenantId);

    const queryObject = [
      { key: "tenantId", value: tenantId },
      { key: "businessServices", value: "ADVERTISEMENTNOC" }
    ];
    setBusinessServiceDataToLocalStorage(queryObject, dispatch);


    getMdmsData(action, state, dispatch).then(response => {
      prepareDocumentsUploadData(state, dispatch, 'popup_adv');
  
    });

    // Set Documents Data (TEMP)
    preparepopupDocumentsADVUploadData(state, dispatch, 'ADVERTISEMENTNOC');
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
            moduleName: "ADVERTISEMENTNOC",
          }
      
        },
        body: role_name !== 'CITIZEN' ? getCommonCard({
          //taskStatusSummary: taskStatusSummary,
          estimateSummary: estimateSummary,
          advertisementapplicantSummary: advertisementapplicantSummary,
          detailSummary: detailSummary,
          documentsSummary: documentsSummary

        }) : getCommonCard({
          estimateSummary: estimateSummary,
          advertisementapplicantSummary: advertisementapplicantSummary,
          detailSummary: detailSummary,
          documentsSummary: documentsSummary,
          taskStatusSummary: taskStatusSummary,
        }),
        break: getBreak(),
        //undertakingButton,
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
        screenKey: "advertisementnoc-search-preview"
      },
      children: {

        popup: adhocPopupAdvertisementwithdrawApproval
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
        screenKey: "advertisementnoc-search-preview"
      },
      children: {

        popup: adhocPopupAdvertisementForward

      }
    },

    adhocDialog1: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-opms",
      componentPath: "ApproveContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "advertisementnoc-search-preview"
      },
      children: {

        popup: adhocPopupAdvertisementApprove


      }
    },

    adhocDialog3: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-opms",
      componentPath: "RejectContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "advertisementnoc-search-preview"
      },
      children: {

        popup: adhocPopupAdvertisementReject

      }
    },
    adhocDialog2: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-opms",
      componentPath: "ReassignContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "advertisementnoc-search-preview"
      },
      children: {

        popup: adhocPopupAdvertisementReassign


      }
    },


  }
};


export default screenConfig;
