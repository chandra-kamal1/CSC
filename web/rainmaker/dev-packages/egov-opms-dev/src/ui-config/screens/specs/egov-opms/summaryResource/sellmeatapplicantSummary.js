import {
  getBreak,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue,
  convertEpochToDate
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { gotoApplyWithStep } from "../../utils/index";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";

export const sellmeatapplicantSummary = getCommonGrayCard({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: { marginBottom: "10px" }
    },
    children: {
      header: {
        gridDefination: {
          xs: 8
        },
        ...getCommonSubHeader({
          labelName: "Applicant Details",
          labelKey: "NOC_APPLICANT_DETAILS_HEADER"
        })
      },
      editSection: {
        componentPath: "Button",
        props: {
          color: "primary",
          style: {
            marginTop: "-10px",
            marginRight: "-18px"
          }
        },
        gridDefination: {
          xs: 4,
          align: "right"
        },
        children: {
          editIcon: {
            uiFramework: "custom-atoms",
            componentPath: "Icon",
            props: {
              iconName: "edit"
            }
          },
          buttonLabel: getLabel({
            labelName: "Edit",
            labelKey: "NOC_SUMMARY_EDIT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            gotoApplyWithStep(state, dispatch, 0);
          }
        }
      }
    }
  },
  cardOne: {
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "sellmeatapplicant-summary",
      scheama: getCommonGrayCard({
        applicantContainer: getCommonContainer({
          applicationNo: getLabelWithValue(
            {
              labelName: "Application ID",
              labelKey: "NOC_APPLICATION_ID"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].nocnumber"

            }
          ),
          applicantName: getLabelWithValue(
            {
              labelName: "Applicant Name",
              labelKey: "NOC_APPLICANT_NAME_LABEL"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].applicantname"

            }
          ),
          applicantFatherHusbandName: getLabelWithValue(
            {
              labelName: "fatherHusbandName",
              labelKey: "NOC_FATHER_HUSBAND_NAME"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].applicationdetail",
              callBack: value => {
                if (value != undefined) {
                  let applicantFatherHusbandName = JSON.parse(value).hasOwnProperty('fatherHusbandName') ? JSON.parse(value)['fatherHusbandName'] : '';
                  return applicantFatherHusbandName;
                } else {
                  return '';
                }
              }
            }
          ),
          applicantHouseNo: getLabelWithValue(
            {
              labelName: "House No.",
              labelKey: "NOC_HOUSE_NO_LABEL"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].housenumber"
            }
          ),
          applicantShopNumber: getLabelWithValue(
            {
              labelName: "Shop Number",
              labelKey: "NOC_APPLICANT_SHOPNO_LABEL"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].applicationdetail",
              callBack: value => {
                if (value != undefined) {
                  let shopNumber = JSON.parse(value).hasOwnProperty('shopNumber') ? JSON.parse(value)['shopNumber'] : '';
                  return shopNumber;
                } else {
                  return '';
                }
              }
            }
          ),
          wardDetails: getLabelWithValue(
            {
              labelName: "Ward Details",
              labelKey: "NOC_APPLICANT_WARD_LABEL"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].applicationdetail",
              callBack: value => {
                if (value != undefined) {
                  let wardDetails = JSON.parse(value).hasOwnProperty('ward') ? JSON.parse(value)['ward'] : '';
                  return wardDetails;
                } else {
                  return '';
                }
              }
            }
          ),
          applicantDivision: getLabelWithValue(
            {
              labelName: "Division",
              labelKey: "NOC_APPLICANT_DIVISION_LABEL"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].applicationdetail",
              callBack: value => {
                if (value != undefined) {
                  let division = JSON.parse(value).hasOwnProperty('division') ? JSON.parse(value)['division'] : '';
                  return division;
                } else {
                  return '';
                }
              }
            }
          ),

          applicatantSector: getLabelWithValue(
            {
              labelName: "Sector",
              labelKey: "NOC_DIVISION_LABEL"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].sector"              
            }
          ),
          applicantEmail: getLabelWithValue(
            {
              labelName: "Noc Sought For",
              labelKey: "NOC_SOUGHT_FOR_LABEL"
            },
            {
              jsonPath:
                "nocApplicationDetail[0].applicationdetail",
              callBack: value => {
                if (value != undefined) {
                  let applicantEmail = JSON.parse(value).hasOwnProperty('nocSought') ? JSON.parse(value)['nocSought'] : '';
                  return applicantEmail;
                } else {
                  return '';
                }
              }
            }
          )
        })
      }),
      items: [],
      hasAddItem: false,
      isReviewPage: true,
      sourceJsonPath: "nocApplicationDetail",
      prefixSourceJsonPath:
        "children.cardContent.children.applicantContainer.children",
      afterPrefixJsonPath: "children.value.children.key"
    },
    type: "array"
  }
});

