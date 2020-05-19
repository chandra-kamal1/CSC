import { fetchData } from "./searchResource/citizenSearchFunctions";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setapplicationType } from "egov-ui-kit/utils/localStorageUtils";

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
setapplicationType("ROADCUTNOC");
//alert("Hii...");

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
                label: "NOC_COMMON_TABLE_COL_APP_NO_LABEL",
                jsonPath: "applicationId"
              },
              {
                label: "NOC_DIVISION_LABEL",
                jsonPath: "division"
              },
              {
                label: "NOC_ROADCUT_TYPE_OF_APPLICANT",
                jsonPath: "typeOfApplicant"
              },
              {
                label: "NOC_ROADCUT_PURPOSE_OF_ROADCUTTING",
                jsonPath: "purposeOfRoadCutting"
              },
              {
                label: "NOC_COMMON_TABLE_COL_STATUS_LABEL",
                jsonPath: "applicationStatus",
                prefix: "WF_ROADCUTNOC_"
              },
            ],
            moduleName: "ROADCUT-NOC",
            homeURL: "/egov-opms/home"
          }
        }
      }
    }
  }
};

export default screenConfig;
