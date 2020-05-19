import {
  getBreak,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { gotoApplyWithStep } from "../../utils/index";

export const nocSummary = getCommonGrayCard({
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
          labelName: "Particular Of Pet Dog",
          labelKey: "PARTICULAR_OF_PET_DOG_HEADER"
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
   scheama: getCommonGrayCard({
    body: getCommonContainer({
    NameofDog: getLabelWithValue(
      {
        labelName: "Name Of Pet Dog",
        labelKey: "NAME_OF_PET_DOG_LABEL"
      },
      {
        //pattern: getPattern("Name"),
        //errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        //required: true,
        //sourceJsonPath: "PETNOC.dataPayload.nameOfPetDog",
        jsonPath: "nocApplicationDetail[0].applicationdetail",
        callBack: value => {
          
          if (value != undefined) {
            let NameofDog = JSON.parse(value).hasOwnProperty('nameOfPetDog') ? JSON.parse(value)['nameOfPetDog'] : '';
            return NameofDog;
          }
          else {
            return '';
          }
        }
      }
    ),
    Age: getLabelWithValue(
      {
        labelName: "Age",
        labelKey: "DOG_AGE_LABEL"
      },
      {
        // optionLabel: "name",
        // placeholder: {
        //   labelName: "Select Age",
        //   labelKey: "DOG_AGE_LABEL"
        // },
        // sourceJsonPath: "applyScreenMdmsData.egpm.age",
        jsonPath: "nocApplicationDetail[0].applicationdetail",
        required: true,

        callBack: value => {
          if (value != undefined) {
            let age = JSON.parse(value).hasOwnProperty('age') ? JSON.parse(value)['age'] : '';
            return age;
          } else {
            return '';
          }
        }
      }
    ),
    Sex: getLabelWithValue(
      {
        labelName: "Sex",
        labelKey: "DOG_SEX_LABEL"
      },
      {
        // optionLabel: "name",
        // placeholder: {
        //   labelName: "Select Sex",
        //   labelKey: "DOG_SEX_LABEL"
        // },
        // sourceJsonPath: "applyScreenMdmsData.egpm.sex",
        jsonPath: "nocApplicationDetail[0].applicationdetail",
        required: true,
        callBack: value => {
          if (value != undefined) {
            let sex = JSON.parse(value).hasOwnProperty('sex') ? JSON.parse(value)['sex'] : '';
            return sex;
          } else {
            return '';
          }
        }
      }
    ),
    Breed: getLabelWithValue(
      {
        labelName: "Breed",
        labelKey: "DOG_BREED_LABEL"
      },
      {
        // optionLabel: "name",
        // placeholder: {
        //   labelName: "Select Breed",
        //   labelKey: "DOG_BREED_LABEL"
        // },
        // sourceJsonPath: "applyScreenMdmsData.egpm.breed",
        //sourceJsonPath: "applyScreenMdmsData.tenant.tenants",
        jsonPath: "nocApplicationDetail[0].applicationdetail",
        required: true,
        callBack: value => {
          if (value != undefined) {
            let breed = JSON.parse(value).hasOwnProperty('breed') ? JSON.parse(value)['breed'] : '';
            return breed;
          } else {
            return '';
          }
        }
      }
    ),
    Color: getLabelWithValue(
      {
        labelName: "Color",
        labelKey: "DOG_COLOR_LABEL"
      },
      {
        // optionLabel: "name",
        //   placeholder: {
        //     labelName: "Select COLOR",
        //     labelKey: "DOG_COLOR_LABEL"
        //   },
        //   sourceJsonPath: "applyScreenMdmsData.egpm.color",
        // sourceJsonPath: "applyScreenMdmsData.tenant.tenants",
        jsonPath: "nocApplicationDetail[0].applicationdetail",
        required: true,
        callBack: value => {
          if (value != undefined) {
            let color = JSON.parse(value).hasOwnProperty('color') ? JSON.parse(value)['color'] : '';
            return color;
          } else {
            return '';
          }
        }
      }
    ),
    IdentificationMark: getLabelWithValue(
      {
        labelName: "Identification Mark",
        labelKey: "IDENTIFICATION_MARK_LABEL"
      },
      {
        // placeholder: {
        //   labelName: "Identification Mark",
        //   labelKey: "IDENTIFICATION_MARK_LABEL"
        // },
        // pattern: getPattern("Name"),
        // errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "nocApplicationDetail[0].applicationdetail",
        callBack: value => {
          if (value != undefined) {
            let identificationMark = JSON.parse(value).hasOwnProperty('identificationMark') ? JSON.parse(value)['identificationMark'] : '';
            return identificationMark;
          } else {
            return '';
          }
        }
      }
    ),
    BadgeNumber: getLabelWithValue(
      {
        labelName: "Badge Number",
        labelKey: "NOC_ADD_PET_POPUP_BADGE_NUMBER_LABEL"
      },
      {
        // placeholder: {
        //   labelName: "Identification Mark",
        //   labelKey: "IDENTIFICATION_MARK_LABEL"
        // },
        // pattern: getPattern("Name"),
        // errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "nocApplicationDetail[0].applicationdetail",
        callBack: value => {
          if (value != undefined) {
            let badgeNumber = JSON.parse(value).hasOwnProperty('badgeNumber') ? JSON.parse(value)['badgeNumber'] : '';
            return badgeNumber;
          } else {
            return '';
          }
        }
      }
    )
  })
  })
  
});
