import {
  getBreak,
  getCommonCard,
  getCommonContainer,
  getCommonGrayCard,
  getCommonTitle,
  getSelectField,
  getTextField,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import "./index.css";

let previousUoms = [];


const commonBuildingData = buildingType => {
  
  return {
    VerterinaryDocName: {
      ...getTextField({
        label: {
          labelName: "Name of Veterinary Doctor",
          labelKey: "NOC_PET_DETAILS_NAME_OF_VETERINARY_DOCTOR_LABEL"
        },
        placeholder: {
          labelName: "Name of Veterinary Doctor",
          labelKey: "NOC_PET_DETAILS_NAME_OF_VETERINARY_DOCTOR_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("TradeName"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "PETNOC.immunizationNameVeterinaryDoctor",
        // props: {
        //   style: {
        //     maxWidth: "400px"
        //   }
        // },
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props:{
          className:"applicant-details-error"
        }
      })
    },
	
	VerterinaryCouncilRegNumber: {
      ...getTextField({
        label: {
          labelName: "Veterinary Council Registration No",
          labelKey: "NOC_PET_DETAILS_VETERINARY_COUNCIL_REGISTRATION_NO_LABEL"
        },
        placeholder: {
          labelName: "Veterinary Council Registration No",
          labelKey: "NOC_PET_DETAILS_VETERINARY_COUNCIL_REGISTRATION_NO_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("TradeName"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "PETNOC.veterinaryCouncilRegistrationNo",
         
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props:{
          className:"applicant-details-error"
        }
      })
    },   
    
	VerterinaryCouncilContactNumber: {
      ...getTextField({
        label: {
          labelName: "Veterinary Contact No",
          labelKey: "NOC_PET_DETAILS_VETERINARY_CONTACT_NO_LABEL"
        },
        placeholder: {
          labelName: "Veterinary Contact No",
          labelKey: "NOC_PET_DETAILS_VETERINARY_CONTACT_NO_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("TradeName"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "PETNOC.immunizationContactDetail",
         
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props:{
          className:"applicant-details-error"
        }
      })
    },
    
	VerterinaryClinicNo: {
      ...getTextField({
        label: {
          labelName: "Clinic No",
          labelKey: "NOC_PET_DETAILS_VETERINARY_CLINIC_NO_LABEL"
        },
        placeholder: {
          labelName: "Clinic No",
          labelKey: "NOC_PET_DETAILS_VETERINARY_CLINIC_NO_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("TradeName"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "PETNOC.immunizationClinicNo",
         
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props:{
          className:"applicant-details-error"
        }
      })
    },
	
	Sector: {
        ...getSelectField({
          label: { 
		  labelName: "Sector", 
		  labelKey: "NOC_PET_DETAILS_VETERINARY_SECTOR_LABEL" },
          localePrefix: {
            moduleName: "TENANT",
            masterName: "TENANTS"
          },
          optionLabel: "name",
          placeholder: {
            labelName: "Select Sector",
            labelKey: "NOC_PET_DETAILS_VETERINARY_SECTOR_PLACEHOLDER"
          },
          sourceJsonPath: "applyScreenMdmsData.tenant.tenants",
          jsonPath: "PETNOC.immunizationSector",
          required: true,
		  gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
          props: {
            className:"applicant-details-error",
            required: true
            // disabled: true
          }
        })
    },

  };
};

export const immunizationDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Immunization Record",
      labelKey: "IMMUNIZATION_RECORD_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  break: getBreak(),
  immunizationDetailsConatiner: getCommonContainer({
    buildingDataCard: getCommonContainer({
      singleBuildingContainer: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 12
        },
        children: {
          singleBuilding: getCommonGrayCard({
            singleBuildingCard: getCommonContainer(commonBuildingData("SINGLE"))
          })
        }
      },
      multipleBuildingContainer: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
          className:"applicant-details-error",
          style: {
            display: "none"
          }
        },
        gridDefination: {
          xs: 12
        },
        children: {
          multipleBuilding: {
            uiFramework: "custom-containers",
            componentPath: "MultiItem",
            props: {
              scheama: getCommonGrayCard({
                multipleBuildingCard: getCommonContainer(
                  commonBuildingData("MULTIPLE")
                )
              }),
              items: [],
              addItemLabel: {
                labelKey: "NOC_PROPERTY_DETAILS_ADD_BUILDING_LABEL",
                labelName: "ADD BUILDING"
              },
              sourceJsonPath: "PetNOCs[0].PetNOCsDetails.buildings",
              // prefixSourceJsonPath:
              //   "children.cardContent.children.buildingDataCard.children.multipleBuildingContainer.children",
              prefixSourceJsonPath:
                "children.cardContent.children.multipleBuildingCard.children"
            },
            type: "array"
          }
        }
      }
    })
  })
});
