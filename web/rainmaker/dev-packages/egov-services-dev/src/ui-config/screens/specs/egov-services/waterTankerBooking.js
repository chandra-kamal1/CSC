import React from "react";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import MyApplicationIcon from "../../../../ui-atoms-local/Icons/MyApplicationIcon";
import { getRequiredDocData, clearlocalstorageAppDetails } from "../utils";
import get from "lodash/get";
import set from "lodash/set";
import {
  getAccessToken,
  getOPMSTenantId,
  getLocale,
  getUserInfo,
  setapplicationType
} from "egov-ui-kit/utils/localStorageUtils";
let role_name=JSON.parse(getUserInfo()).roles[0].code
const header = getCommonHeader(
  {
    labelName: "Water Tanker Booking",
    labelKey: "ACTION_TEST_WATER_TANKER_BOOKING"
  },
  {
    classes: {
      root: "common-header-cont"
    }
  }
);
let cardItems = [];
if(role_name === 'CITIZEN'){
  const cardlist = [
    {
      label: {
        labelKey: "CS_WTB_APPLY",
        labelName: "Apply For Water Tanker"
      },
      icon: <i 
      viewBox="0 -8 35 42"
      color="primary"
      font-size="40px"
      class="material-icons module-page-icon">
      pets
      </i>,
      route: "apply"
      
    },
    {
      label: {
        labelKey: "CS_WTB_MY_BOOKINGS",
        labelName: "My Bookings"
      },
      icon: <MyApplicationIcon />,
      route: "my-applications"
    },
   
  
  ];
  cardItems = cardlist;
}


const tradeLicenseSearchAndResult = {
  uiFramework: "material-ui",
  name: "waterTankerBooking",
  beforeInitScreen: (action, state, dispatch) => {
    clearlocalstorageAppDetails(state);
    setapplicationType('WTB');
    
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      children: {
        header: header,
        applyCard: {
          uiFramework: "custom-molecules",
          componentPath: "LandingPage",
          props: {
            items: cardItems,
            history: {}
          }
        },
        listCard: {
          uiFramework: "custom-molecules-local",
          moduleName: "egov-services",
          componentPath: "HowItWorks"
        }
      }
    },
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-services",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: false,
        screenKey: "waterTankerBooking"
      },
      children: {
        popup: {}
      }
    }
  }
};

export default tradeLicenseSearchAndResult;
