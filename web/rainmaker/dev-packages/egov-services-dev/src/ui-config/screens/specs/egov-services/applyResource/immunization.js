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


const immunizationData = buildingType => {
  
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
        pattern: getPattern("VillageName"),
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
        pattern: getPattern("VeterinaryRegistrationNo"),
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
        pattern: getPattern("MobileNo"),
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
        pattern: getPattern("DoorHouseNo"),
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
          // localePrefix: {
          //   moduleName: "egpm",
          //   masterName: "sector"
          // },
          optionLabel: "name",
          placeholder: {
            labelName: "Select Sector",
            labelKey: "NOC_PET_DETAILS_VETERINARY_SECTOR_PLACEHOLDER"
          },
          sourceJsonPath: "applyScreenMdmsData.egpm.sector",
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
            singleBuildingCard: getCommonContainer(immunizationData("SINGLE"))
          })
        }
      }      
    })
  })
});
