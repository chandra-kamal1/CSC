import { fetchData } from "./searchResource/citizenSearchFunctions";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setapplicationType, localStorageSet } from "egov-ui-kit/utils/localStorageUtils";

const header = getCommonHeader(
  {
    labelName: "My Applications",
    labelKey: "NOC_MY_APPLICATIONS_HEADER"
  },
  {
    classes: {
      root: "common-header-cont"
    }
  }
);
//alert("Hii...");
setapplicationType("SELLMEATNOC");

const screenConfig = {
  uiFramework: "material-ui",
  name: "my-applications",
  beforeInitScreen: (action, state, dispatch) => {
    fetchData(action, state, dispatch);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      children: {
        header: header,
        applicationsCard: {
          uiFramework: "custom-molecules",
          componentPath: "SingleApplication",
          visible: true,
          props: {
            contents: [
              {
                label: "NOC_SOUGHT_FOR_LABEL",
                jsonPath: "nocSought"
              },
              {
                label: "NOC_COMMON_TABLE_COL_APP_NO_LABEL",
                jsonPath: "applicationId"
              },
              {
                label: "NOC_HOUSE_NO_LABEL",
                jsonPath: "houseNo"
              },
              {
                label: "NOC_DIVISION_LABEL",
                jsonPath: "division"
              },
              {
                label: "NOC_COMMON_TABLE_COL_STATUS_LABEL",
                jsonPath: "applicationStatus",
                prefix: "WF_SELLMEATNOC_"
              },
            ],
              moduleName: "SELL-MEAT-NOC",
              homeURL: "/egov-opms/home"
            }
          }
      }
  }
}
};

export default screenConfig;
