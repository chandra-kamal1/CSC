import {
    getLabel,
    dispatchMultipleFieldChangeAction
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import {
    getCommonApplyFooter,
    showHideAdhocPopupopmsReject,
    showHideAdhocPopupopmsReassign,
    showHideAdhocPopupopmsApprove,
    showHideAdhocPopupopmsForward
    } from "../../utils";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import {
    toggleSnackbar,
    prepareFinalObject
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import "./index.css";
  import {
    getAccessToken,
    getOPMSTenantId,
    getLocale,
    getUserInfo,
    localStorageGet
  } from "egov-ui-kit/utils/localStorageUtils";
  import { getapplicationType  } from "egov-ui-kit/utils/localStorageUtils";
  
  let role_name=JSON.parse(getUserInfo()).roles[0].code

  const callbackforsummaryactionpay = async (dispatch) => {
    let tenantId = getOPMSTenantId();
    //alert("enter here")
     const applicationid = getQueryArg(window.location.href, "applicationNumber");
      const appendUrl =
        process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
      const reviewUrl = `${appendUrl}/egov-services/pay?applicationNumber=${applicationid}&tenantId=${tenantId}`;
      dispatch(setRoute(reviewUrl));
   
  }

  export const footer = getCommonApplyFooter({
    nextButton: {
      componentPath: "Button",
      props: {
        variant: "contained",
        color: "primary",
        style: {
          minWidth: "180px",
          height: "48px",
          marginRight: "45px",
          borderRadius:"inherit"
        }
      },
      children: {
        nextButtonLabel: getLabel({
          labelName: "FORWARD",
          labelKey: "FORWARD"
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
        callBack: (state, dispatch) => showHideAdhocPopupopmsForward(state, dispatch, "roadcutnoc-search-preview","nextButton")
      },
      visible:role_name=="JE" || role_name=="SDO"  || role_name=="EE" || role_name=="SE"?true:false
      
    },
    reject: {
      componentPath: "Button",
      props: {
        variant: "contained",
        color: "primary",
        style: {
          minWidth: "180px",
          height: "48px",
          marginRight: "45px",
          borderRadius:"inherit"
        }
      },
      children: {
        nextButtonLabel: getLabel({
          labelName: "REJECT",
          labelKey: "REJECT"
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
        
        callBack: (state, dispatch) =>{
         
     
          showHideAdhocPopupopmsReject(state, dispatch, "roadcutnoc-search-preview","reject")
      }
      },
      visible: false
    },
    reassign: {
      componentPath: "Button",
      props: {
        variant: "contained",
        color: "primary",
        style: {
          minWidth: "180px",
          height: "48px",
          marginRight: "45px",
          borderRadius:"inherit"
        }
      },
      children: {
        nextButtonLabel: getLabel({
          labelName: "REASSIGN",
          labelKey: "REASSIGN"
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
        
        callBack: (state, dispatch) =>{
         
     
          showHideAdhocPopupopmsReassign(state, dispatch, "roadcutnoc-search-preview","reject")
      }
      },
      visible:role_name=="JE" || role_name=="SDO" || role_name=="CE" || role_name=="EE" || role_name=="SE"?true:false
    },
    approve: {
      componentPath: "Button",
      props: {
        variant: "contained",
        color: "primary",
        style: {
          minWidth: "180px",
          height: "48px",
          marginRight: "45px",
          borderRadius:"inherit"
        }
      },
      children: {
        nextButtonLabel: getLabel({
          labelName: "APPROVE",
          labelKey: "APPROVE"
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
        
        callBack: (state, dispatch) =>{
         
     
          showHideAdhocPopupopmsApprove(state, dispatch, "roadcutnoc-search-preview","reject")
      }
      },
      visible: false
    },
    MakePayment: {
      componentPath: "Button",
      props: {
        variant: "contained",
        color: "primary",
        style: {
          minWidth: "180px",
          height: "48px",
          marginRight: "45px",
          borderRadius:"inherit"
        }
      },
      children: {
        nextButtonLabel: getLabel({
          labelName: "MakePayment",
          labelKey: "NOC_COMMON_BUTTON_MAKE_PAYMENT"
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
        callBack: (state, dispatch) =>{
          callbackforsummaryactionpay(dispatch);
        }
      },
      visible: false
    }
    
  });
  