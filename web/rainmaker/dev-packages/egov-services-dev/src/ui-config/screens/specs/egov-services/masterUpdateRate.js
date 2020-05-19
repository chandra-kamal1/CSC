import {
    getCommonHeader,
    getLabel,
    getBreak
  } from "egov-ui-framework/ui-config/screens/specs/utils";
 import { NOCApplication ,NOCApplication2} from "./searchResource/masterdataApplication";
 import {adhocPopupForSeRoadCutForward} from "./payResource/adhocPopup";
 
  import { showHideAdhocPopup, resetFields, getRequiredDocData } from "../utils";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  
  //import { searchResults } from "./searchResource/searchResults";
  import { setBusinessServiceDataToLocalStorage } from "egov-ui-framework/ui-utils/commons";
  import {
    getOPMSTenantId,
    localStorageGet
  } from "egov-ui-kit/utils/localStorageUtils";
  import find from "lodash/find";
  import set from "lodash/set";
  import get from "lodash/get";
  import {
    prepareFinalObject,
    handleScreenConfigurationFieldChange as handleField
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getRequiredDocuments } from "./requiredDocuments/reqDocs";
  import { getUpdatePriceBook ,getSubCategory,getCategory} from "./searchResource/citizenSearchFunctions";
  
  const hasButton = getQueryArg(window.location.href, "hasButton");
  let enableButton = true;
  enableButton = hasButton && hasButton === "false" ? false : true;
  
  const header = getCommonHeader({
    labelName: "Update Advertisment Details",
    labelKey: "NOC_UPDATE_ADV_DETAIL"
  });
  
  const NOCSearchAndResult = {
    uiFramework: "material-ui",
    name: "masterUpdateRate",
    beforeInitScreen: (action, state, dispatch) => {
        
        const pricebookid = getQueryArg(
            window.location.href,
            "pricebookid"
          );
          getCategory(action, state, dispatch);
          getSubCategory(action, state, dispatch);
     getUpdatePriceBook(action, state, dispatch,pricebookid);
  
     
     
      return action;
    },
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Form",
        props: {
          className: "common-div-css",
          id: "masterUpdateRate"
        },
        children: {
          headerDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Container",
  
            children: {
              header: {
                gridDefination: {
                  xs: 12,
                  sm: 6
                },
                ...header
              },
              // newApplicationButton: {
              //   componentPath: "Button",
              //   gridDefination: {
              //     xs: 12,
              //     sm: 6,
              //     align: "right"
              //   },
              //   visible: enableButton,
              //   props: {
              //     variant: "contained",
              //     color: "primary",
              //     style: {
              //       color: "white",
              //       borderRadius: "2px",
              //       width: "250px",
              //       height: "48px"
              //     }
              //   },
  
               
                
              // }
            }
          },
           NOCApplication,

          breakAfterSearch: getBreak(),
          NOCApplication2,
          
          // progressStatus,
          //searchResults
        }
      },
      adhocDialog: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-services",
        componentPath: "DialogContainer",
        props: {
          open: false,
          maxWidth: false,
          screenKey: "masterUpdateRate"
        },
        children: {
          popup: {}
        }
      }
    }
  };
  export default NOCSearchAndResult;
  