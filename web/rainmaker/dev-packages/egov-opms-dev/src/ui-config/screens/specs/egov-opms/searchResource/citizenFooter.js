import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getapplicationType, localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
import "./index.css";

let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
let tenant = getQueryArg(window.location.href, "tenantId");
let applicationtype = getapplicationType();
//let amount = localStorageGet('amount');

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

export const citizenFooter = getCommonApplyFooter({
  makePayment: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "MAKE PAYMENT",
        labelKey: "NOC_COMMON_BUTTON_CITIZEN_MAKE_PAYMENT"
      })
    },
    onClickDefination: {
      action: "page_change",
      path: `/egov-common/pay?consumerCode=${applicationNumber}&tenantId=${tenant}&businessService=OPMSNOC`
    },
    
    roleDefination: {
      rolePath: "user-info.roles",
      action: "PAY"
    },
    visible: process.env.REACT_APP_NAME === "Citizen" ?   true : false
  }
});
