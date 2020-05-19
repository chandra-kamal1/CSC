import {
  getCommonHeader,
  getCommonContainer
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {CloudDownloadIcon} from '@material-ui/icons/CloudDownload';
import {PrintIcon} from '@material-ui/icons/Print';
import {
  applicationSuccessFooter,
  //paymentSuccessFooter,
  gotoHomeFooter,
  approvalSuccessFooter,
  paymentFailureFooter
} from "./acknowledgementResource/footers";
import acknowledgementCard from "./acknowledgementResource/acknowledgementUtils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getSearchResults } from "../../../../ui-utils/commons";
import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
//import  generatePdf from "../utils/receiptPdf";
import { Icon } from "egov-ui-framework/ui-atoms";
// import { loadReceiptGenerationData } from "../utils/receiptTransformer";
import set from "lodash/set";
import get from "lodash/get";
import { getCurrentFinancialYear } from "../utils";

import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResultsForNocCretificate, getSearchResultsForNocCretificateDownload  } from "../../../../ui-utils/commons";
import { getapplicationType } from "egov-ui-kit/utils/localStorageUtils";


export const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `Application for ROADCUT NOC (${getCurrentFinancialYear()})`, //later use getFinancialYearDates
    labelKey: ""
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-opms",
    componentPath: "ApplicationNoContainer",
    props: {
      number: getQueryArg(window.location.href, "applicationNumber")
    },
    visible: true
  }
});


const getHeader=(applicationNumber)=>{
return getCommonContainer({
  header: getCommonHeader({
    labelName: `Application for ROADCUT NOC (${getCurrentFinancialYear()})`, //later use getFinancialYearDates
    labelKey: ""
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-opms",
    componentPath: "ApplicationNoContainer",
    props: {
      number:applicationNumber
    },
    visible: true
  }
})
}



const getAcknowledgementCard = (
  state,
  dispatch,
  purpose,
  status,
  applicationNumber,
  secondNumber,
  tenant
) => {
  if (purpose === "apply" && status === "success") {
    //loadPdfGenerationData(applicationNumber, tenant);
    return {
      header:getHeader(applicationNumber),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application Submitted Successfully",
              labelKey: "NOC_APPLICATION_SUCCESS_MESSAGE_MAIN"
            },
            body: {
				labelName: "A notification regarding Application Submission has been sent to the applicant registered Mobile No.",
				labelKey: "ROADCUT_NOC_APPLICATION_SUCCESS_MESSAGE_SUB"
			},
           
            tailText: {
              labelName: "Application No.",
              labelKey: "NOC_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          }),
          abc: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            children: {
              downloadFormButton: {
                uiFramework: "custom-atoms",
                componentPath: "Div",
                children: {

                  div1: {
                    uiFramework: "custom-atoms",
                    componentPath: "Icon",
                 
                    props:{
                      iconName: "cloud_download",
                    style:{
                      marginTop: "7px",
                      marginRight: "8px",
                    }
                  },
                    onClick: {
                      action: "condition",
                      // callBack: () => {
                      //   // generatePdf(state, dispatch, "application_download");
                      // },
                    },
                  },
                  div2: getLabel({
                    labelName: "DOWNLOAD CONFIRMATION FORM",
                    labelKey: "NOC_APPLICATION_BUTTON_DOWN_CONF"
                  })

                },
                onClickDefination: {
                  action: "condition",
                  callBack: () => {
                    // generatePdf(state, dispatch, "application_download");
                  }
                },
              },
              PrintFormButton: {
                uiFramework: "custom-atoms",
                componentPath: "Div",
                children: {
                  div1: {
                    uiFramework: "custom-atoms",
                    componentPath: "Icon",
                 
                    props:{
                      iconName: "local_printshop",
                      style:{
                        marginTop: "7px",
                        marginRight: "8px",
                        marginLeft:"10px",
                      }
                  },
                   onClick: {
                    action: "condition",
                    callBack: () => {
                      // generatePdf(state, dispatch, "application_print");
                    }
                  },

                  },
                  div2: getLabel({
                    labelName: "PRINT CONFIRMATION FORM",
                    labelKey: "NOC_APPLICATION_BUTTON_PRINT_CONF"
                  })

                },
                onClickDefination: {
                  action: "condition",
                  callBack: () => {
                    // generatePdf(state, dispatch, "application_print");
                  }
                },
              }

            },
            props: {
              style: {
                display: "flex",

              }
            },
          }
        }
      },
      iframeForPdf: {
        uiFramework: "custom-atoms",
        componentPath: "Div"
      },
      applicationSuccessFooter: applicationSuccessFooter(
        state,
        dispatch,
        applicationNumber,
        tenant
      )
    };
  } else if (purpose === "pay" && status === "success") {
    //loadPdfGenerationData(applicationNumber, tenant);
    return {
      header,
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Payment has been collected successfully!",
              labelKey: "NOC_PAYMENT_COLLECTION_SUCCESS_MESSAGE_MAIN"
            },
            body: {
               labelName:
                "A notification regarding Payment Collection has been sent to the applicant at registered Mobile No.",
              labelKey: "ROADCUT_NOC_PAYMENT_SUCCESS_MESSAGE_SUB"		
            },
            tailText: {
              labelName: "Payment Receipt No.",
              labelKey: "NOC_PMT_RCPT_NO"
            },
            number: secondNumber
          })
        }
      },
      paymentSuccessFooter: paymentSuccessFooter(applicationNumber, tenant)
    };
  } else if (purpose === "approve" && status === "success") {
    //loadPdfGenerationData(applicationNumber, tenant);
    return {
      header,
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "ROADCUT NOC Approved Successfully",
              labelKey: "ROADCUT_NOC_APPROVAL_CHECKLIST_MESSAGE_HEAD"		
            },
            body: {
              labelName:
                "A notification regarding ROADCUT NOC Approval has been sent to the applicant at registered Mobile No.",
              labelKey: "ROADCUT_NOC_APPROVAL_CHECKLIST_MESSAGE_SUB"
            },
            tailText: {
              labelName: "ROADCUT NOC No.",
              labelKey: "ROADCUT_HOME_SEARCH_RESULTS_NOC_NO_LABEL"
            },
            number: secondNumber
          })
        }
      },
      approvalSuccessFooter
    };
  } else if (purpose === "application" && status === "rejected") {
    return {
      header,
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "close",
            backgroundColor: "#E54D42",
            header: {
               labelName: "ROADCUT NOC Application Rejected",
              labelKey: "ROADCUT_NOC_APPROVAL_REJ_MESSAGE_HEAD"		
            },
            body: {
             labelName:
                "A notification regarding ROADCUT NOC Rejection has been sent to the applicant at registered Mobile No.",
              labelKey: "ROADCUT_NOC_APPROVAL_REJ_MESSAGE_SUBHEAD"
            }
          })
        }
      },
      gotoHomeFooter
    };
  } else if (purpose === "application" && status === "cancelled") {
    return {
      header,
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "close",
            backgroundColor: "#E54D42",
            header: {
             labelName: "ROADCUT NOC Cancelled",
              labelKey: "ROADCUT_NOC_CANCELLED_MESSAGE_HEAD"	
            },
            body: {
              labelName:
                "A notification regarding ROADCUT NOC cancellation has been sent to the applicant at registered Mobile No.",
              labelKey: "ROADCUT_NOC_CANCELLED_MESSAGE_SUBHEAD"
            },
            tailText: {
             labelName: "ROADCUT NOC No.",
              labelKey: "ROADCUT_NOC_HOME_SEARCH_RESULTS_NOC_NO_LABEL"	
            },
            number: secondNumber
          })
        }
      },
      gotoHomeFooter
    };
  } else if (purpose === "pay" && status === "failure") {
    return {
      header,
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "close",
            backgroundColor: "#E54D42",
            header: {
              labelName: "Payment has failed!",
              labelKey: "NOC_PAYMENT_FAILURE_MESSAGE_MAIN"
            },
            body: {
              labelName:
                "A notification regarding payment failure has been sent to the applicant.",
              labelKey: "ROADCUT_NOC_PAYMENT_FAILURE_MESSAGE_SUB"
            }
          })
        }
      },
      paymentFailureFooter: paymentFailureFooter(applicationNumber, tenant)
    };
  } else if (purpose === "mark" && status === "success") {
    return {
      header,
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application Marked Successfully",
              labelKey: "NOC_MARK_SUCCESS_MESSAGE_MAIN"
            },
            body: {
              labelName: "Application has been marked successfully",
              labelKey: "NOC_APPLICATION_MARKED_SUCCESS"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "NOC_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    };
  } else if (purpose === "forward" && status === "success") {
    return {
      header,
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application Forwarded Successfully",
              labelKey: "NOC_FORWARD_SUCCESS_MESSAGE_MAIN"
            },
            body: {
              labelName: "Application has been marked successfully",
              labelKey: "NOC_APPLICATION_FORWARD_SUCCESS"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "NOC_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    };
  } else if (purpose === "sendback" && status === "success") {
    return {
      header,
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application sent back Successfully",
              labelKey: "NOC_SENDBACK_SUCCESS_MESSAGE_MAIN"
            },
            body: {
              labelName: "Application has been sent back successfully",
              labelKey: "NOC_APPLICATION_SENDBACK_SUCCESS"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "NOC_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    };
  } else if (purpose === "refer" && status === "success") {
    return {
      header,
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application referred Successfully",
              labelKey: "NOC_REFER_SUCCESS_MESSAGE_MAIN"
            },
            body: {
              labelName: "Application has been referred successfully",
              labelKey: "NOC_APPLICATION_REFER_SUCCESS"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "NOC_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    };
  }
};

const setApplicationData = async (dispatch, applicationNumber, tenant) => {
  const queryObject = [
    {
      key: "tenantId",
      value: tenant
    },
    {
      key: "applicationNumber",
      value: applicationNumber
    }
  ];
  const response = await getSearchResults(queryObject);
  dispatch(prepareFinalObject("OpmsNOCs", get(response, "OpmsNOCs", [])));
};

const setSearchResponseForNocCretificate = async (applicationNumber, tenantId) => {

  //Receipts
  let getCertificateDataFor_RECEIPT = { "applicationType":getapplicationType(), "tenantId": tenantId, "applicationId":applicationNumber, "dataPayload": { "requestDocumentType": "receiptData" } };

  //NOC_Receipts
  const response0_RECEIPT = await getSearchResultsForNocCretificate([
    { key: "tenantId", value: tenantId },
    { key: "applicationNumber", value: applicationNumber },
    { key: "getCertificateData", value: getCertificateDataFor_RECEIPT },
    { key: "requestUrl", value: "/pm-services/noc/_getCertificateData" }
  ]);

  let getFileStoreIdFor_RECEIPT = { "nocApplicationDetail": [get(response0_RECEIPT, "nocApplicationDetail[0]", "")] }


let receiptName="";
switch(getapplicationType()){
  case "PETNOC":
  receiptName="/pdf-service/v1/_create?key=pet-receipt&tenantId="+tenantId
  break;
  case "ROADCUTNOC":
  receiptName="/pdf-service/v1/_create?key=roadcut-receipt&tenantId="+tenantId
  break;
  case "ADVERTISEMENTNOC":
  receiptName="/pdf-service/v1/_create?key=advertisement-receipt&tenantId="+tenantId
  break;
}
  const response1_RECEIPT = await getSearchResultsForNocCretificate([
    { key: "tenantId", value: tenantId },
    { key: "applicationNumber", value: applicationNumber },
    { key: "getCertificateDataFileStoreId", value: getFileStoreIdFor_RECEIPT },
    { key: "requestUrl", value: receiptName }
  ]);

  const response2_RECEIPT = await getSearchResultsForNocCretificateDownload([
    { key: "tenantId", value: tenantId },
    { key: "applicationNumber", value: applicationNumber },
    { key: "filestoreIds", value: get(response1_RECEIPT, "filestoreIds[0]", "") },
    { key: "requestUrl", value: "/filestore/v1/files/url?tenantId="+tenantId+"&fileStoreIds=" }
  ]);
  
  let httpLink_RECEIPT = get(response2_RECEIPT, get(response1_RECEIPT, "filestoreIds[0]", ""), "")
  //window.open(httpLink_RECEIPT,  "_blank");
  if(httpLink_RECEIPT!="")
  window.location.href = httpLink_RECEIPT;
  
};

export const paymentSuccessFooter = (applicationNumber, tenant) => {
  return getCommonApplyFooter({
    //call gotoHome
    downloadReceiptButton: {
      componentPath: "Button",
      props: {
        variant: "outlined",
        color: "primary",
        style: {
       //   minWidth: "200px",
          height: "48px",
          marginRight: "16px"
        }
      },
      children: {
        downloadReceiptButtonLabel: getLabel({
          labelName: "DOWNLOAD RECEIPT",
          labelKey: "NOC_CONFIRMATION_BUTTON_DOWNLOAD_RECEIPT"
        })
      },
      onClickDefination: {
        action: "condition",
        callBack: (state, dispatch) => {
          //// generatePdf(state, dispatch, "receipt_download");
          setSearchResponseForNocCretificate( applicationNumber, tenant);
          
        }
      }
    },
    gotoHome: {
      componentPath: "Button",
      props: {
        variant: "contained",
        color: "primary",
        style: {
      //    minWidth: "200px",
          height: "48px",
          marginRight: "16px"
        }
      },
      children: {
        goToHomeButtonLabel: getLabel({
          labelName: "GO TO HOME",
          labelKey: "NOC_COMMON_BUTTON_HOME"
        })
      },
      onClickDefination: {
        action: "page_change",
        path:
          process.env.REACT_APP_SELF_RUNNING === "true"
            ? `/egov-ui-framework/egov-opms/search`
            : `/`
      },
       visible: false
    }
  });
};

const getCommonApplyFooter = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "apply-wizard-footer"
    },
    children
  };
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "acknowledgement",
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      }
    }
  },
  beforeInitScreen: (action, state, dispatch) => {
    const purpose = getQueryArg(window.location.href, "purpose");
    const status = getQueryArg(window.location.href, "status");
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    const secondNumber = getQueryArg(window.location.href, "secondNumber");
    const tenant = getQueryArg(window.location.href, "tenantId");
    const data = getAcknowledgementCard(
      state,
      dispatch,
      purpose,
      status,
      applicationNumber,
      secondNumber,
      tenant
    );
    setApplicationData(dispatch, applicationNumber, tenant);
    set(action, "screenConfig.components.div.children", data);
    return action;
  }
};

export default screenConfig;
