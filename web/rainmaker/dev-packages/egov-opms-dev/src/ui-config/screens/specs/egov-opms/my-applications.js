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
setapplicationType('PETNOC');
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
                                label: "NOC_COMMON_TABLE_COL_PET_COLOR_NAME_LABEL",
                                jsonPath: "color"
                            },
                            {
                                label: "NOC_COMMON_TABLE_COL_APP_NO_LABEL",
                                jsonPath: "applicationId"
                            },
                            {
                                label: "NOC_COMMON_TABLE_COL_PET_NAME_LABEL",
                                jsonPath: "nameOfPetDog"
                            },
                            {
                                label: "NOC_COMMON_TABLE_COL_BREED_NAME_LABEL",
                                jsonPath: "breed"
                            },
                            {
                                label: "NOC_COMMON_TABLE_COL_STATUS_LABEL",
                                jsonPath: "applicationStatus",
                                prefix: "WF_PETNOC_"
                            }
                        ],
                        moduleName: "PET-NOC",
                        homeURL: "/egov-opms/home"
                    }
                }
            }
        }
    }
};

export default screenConfig;