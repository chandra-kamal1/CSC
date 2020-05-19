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

setapplicationType('ADVERTISEMENTNOC');
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
                label: "NOC_APPLICANT_NAME_PLACEHOLDER",
                jsonPath: "applicantName"
              },
              {
                label: "NOC_TYPE_OF_ADVERTISEMENT",
                jsonPath: "typeOfAdvertisement"
              },
              {
                label: "NOC_SUB_TYPE_OF_ADVERTISEMENT",
                jsonPath: "subTypeOfAdvertisement"
              },
              //{
            //   label: "NOC_ADV_DURATION",
            //   jsonPath: "duration"
            // },
             {
                label: "NOC_COMMON_TABLE_COL_STATUS_LABEL",
                jsonPath: "applicationStatus",
                prefix: "WF_ADVERTISEMENTNOC_"
              },
            ],
            moduleName: "ADVERTISEMENT-NOC",
            homeURL: "/egov-opms/home"
          }
        }
      }
    }
  }
};

export default screenConfig;
