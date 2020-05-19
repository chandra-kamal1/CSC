import {
  getCommonHeader, getTextField, getSelectField, getCommonContainer, getCommonSubHeader, getLabel, getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { showHideAdhocPopupopmsForward, showHideAdhocPopup, getBill, showHideAdhocPopupopmsReject, showHideAdhocPopupopmsReassign, showHideAdhocPopupopmsApprove } from "../../utils";
import get from "lodash/get";
import { httpRequest } from "../../../../../ui-utils/api";
import cloneDeep from "lodash/cloneDeep";
import { createEstimateData } from "../../utils";
import { prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import set from "lodash/set";
import { UpdateStatus } from "../../../../../ui-utils/commons";
import { documentDetails } from "./documentDetails";
import { getAccessToken, getOPMSTenantId, getLocale, getUserInfo, getapplicationNumber } from "egov-ui-kit/utils/localStorageUtils";
import store from "redux/store";
import { createDemandForRoadCutNOCPOPup } from "../../utils/index";
import {
  localStorageGet, localStorageSet
} from "egov-ui-kit/utils/localStorageUtils";
import { callPGService } from "./footer";

let role_name = JSON.parse(getUserInfo()).roles[0].code

const popupvalidate = () => {

  let allAreFilled = true;
  let isFormValid = true;
  let hasFieldToaster = false;
  document.getElementById("material-ui-popup").querySelectorAll("[required]").forEach(function (i) {
    i.parentNode.classList.remove("MuiInput-error-853");
    i.parentNode.parentNode.classList.remove("MuiFormLabel-error-844");
    if (!i.value) {
      i.focus();
      allAreFilled = false;
      i.parentNode.classList.add("MuiInput-error-853");
      i.parentNode.parentNode.classList.add("MuiFormLabel-error-844");
    }
    if (i.getAttribute("aria-invalid") === 'true' && allAreFilled) {
      i.parentNode.classList.add("MuiInput-error-853");
      i.parentNode.parentNode.classList.add("MuiFormLabel-error-844");
      allAreFilled = false;
      isFormValid = false;
      hasFieldToaster = true;
    }
  })
  if (!allAreFilled) {
    //  alert('Fill all fields1')
    isFormValid = false;
    hasFieldToaster = true;
  }
  else {
    // alert('Submit1')

    isFormValid = true;
    hasFieldToaster = false;
  }
  return [isFormValid, hasFieldToaster]
}
const moveToReview = (state, dispatch, applnid) => {
  const documentsFormat = Object.values(get(state.screenConfiguration.preparedFinalObject, "documentsUploadRedux")
  );

  let validateDocumentField = false;

  for (let i = 0; i < documentsFormat.length; i++) {
    let isDocumentRequired = get(documentsFormat[i], "isDocumentRequired");
    let isDocumentTypeRequired = get(
      documentsFormat[i], "isDocumentTypeRequired");

    let documents = get(documentsFormat[i], "documents");
    if (isDocumentRequired) {
      if (documents && documents.length > 0) {
        if (isDocumentTypeRequired) {
          if (get(documentsFormat[i], "dropdown.value")) {
            validateDocumentField = true;
          } else {
            dispatch(
              toggleSnackbar(
                true,
                { labelName: "Please select type of Document!", labelKey: "" },
                "warning"
              )
            );
            validateDocumentField = false;
            break;
          }
        } else {
          validateDocumentField = true;
        }
      } else {
        dispatch(
          toggleSnackbar(
            true,
            { labelName: "Please uplaod mandatory documents!", labelKey: "" },
            "warning"
          )
        );
        validateDocumentField = false;
        break;
      }
    } else {
      validateDocumentField = true;
    }
  }

  validateDocumentField = true;
  if (validateDocumentField) {
    return true
  }
};
const updateAdhoc1 = (state, dispatch) => {

  let validatestepformflag = popupvalidate()
  let isFormValid = validatestepformflag[0];
  let hasFieldToaster = validatestepformflag[1];
  let file = get(
    state.screenConfiguration.preparedFinalObject,
    "documentsUploadRedux[0].documents[0].fileStoreId"
  )
  if (isFormValid ) {
    // let res=moveToReview(state, dispatch);

    const badgeNumber = get(
      state.screenConfiguration.preparedFinalObject,
      "PetNoc[0].PetNocDetails.additionalDetail.badgeNumber"
    );
    const remarks = get(
      state.screenConfiguration.preparedFinalObject,
      "PetNoc[0].PetNocDetails.additionalDetail.remarks"
    );
    const file = get(
      state.screenConfiguration.preparedFinalObject,
      "documentsUploadRedux[0].documents[0].fileStoreId"
    );

    let data = {}
    if(file)
    {
      data = {
        "uploadDocuments": [{
          "fileStoreId": get(
            state.screenConfiguration.preparedFinalObject,
            "documentsUploadRedux[0].documents[0].fileStoreId"
          )
        }],
        "remarks": remarks,
        "badgeNumber": badgeNumber
    }
    }
    else{
      data = {
      "uploadDocuments": [{
        "fileStoreId":""
        }],
        "remarks": remarks,
        "badgeNumber": badgeNumber
      }
    }

    UpdateStatus(dispatch, '/egov-opms/search', [],
      {
        "applicationType": "PETNOC",
        "tenantId": getOPMSTenantId(),
        "applicationStatus": "FORWARD",
        "applicationId": localStorage.getItem('ApplicationNumber'),
        "dataPayload": data,
        "auditDetails": {
          "createdBy": 1,
          "lastModifiedBy": 1,
          "createdTime": 1578894136873,
          "lastModifiedTime": 1578894136873


        }
      }
    );
  }

  else {
    let errorMessage = {
      labelName:
        "Please fill all mandatory fields for Applicant Details, then proceed!",
      labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }

};

const updateAdhocReaasign = (state, dispatch) => {

  let validatestepformflag = popupvalidate()
  let isFormValid = validatestepformflag[0];
  let hasFieldToaster = validatestepformflag[1];

  let file = get(
    state.screenConfiguration.preparedFinalObject,
    "documentsUploadRedux[0].documents[0].fileStoreId"
  )
  if (isFormValid) {
    const remarks = get(
      state.screenConfiguration.preparedFinalObject,
      "PetNoc[0].PetNocDetails.Reaasign.remarks"
    );

    let data = {}
    if(file)
    {
      data = {
        "uploadDocuments": [{
          "fileStoreId": get(
            state.screenConfiguration.preparedFinalObject,
            "documentsUploadRedux[0].documents[0].fileStoreId"
          )
        }],
        "remarks": remarks,
      }
    }
    else{
      data = {
      "uploadDocuments": [{
        "fileStoreId":""
        }],
        "remarks": remarks,
      }
    }


    UpdateStatus(dispatch, '/egov-opms/search', [],

      {

        "applicationType": "PETNOC",
        "tenantId": getOPMSTenantId(),
        "applicationStatus": role_name == "SI" ? "REASSIGN" : role_name == "MOH" ? "REASSIGNTOSI" : '',
        "applicationId": localStorage.getItem('ApplicationNumber'),
        "dataPayload": data,
        "auditDetails": {
          "createdBy": 1,
          "lastModifiedBy": 1,
          "createdTime": 1578894136873,
          "lastModifiedTime": 1578894136873
        }
      }
    );

  }
  else {
    let errorMessage = {
      labelName:
        "Please fill all mandatory fields for Applicant Details, then proceed!",
      labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
};
const updateAdhocReject = (state, dispatch) => {

  let validatestepformflag = popupvalidate()
  let isFormValid = validatestepformflag[0];
  let hasFieldToaster = validatestepformflag[1];
  let file = get(
    state.screenConfiguration.preparedFinalObject,
    "documentsUploadRedux[0].documents[0].fileStoreId"
  )
  if (isFormValid ) {
    const remarks = get(
      state.screenConfiguration.preparedFinalObject,
      "PetNoc[0].PetNocDetails.Reject.remarks"
    );

    let data = {}
    if(file)
    {
      data = {
        "uploadDocuments": [{
          "fileStoreId": get(
            state.screenConfiguration.preparedFinalObject,
            "documentsUploadRedux[0].documents[0].fileStoreId"
          )
        }],
        "remarks": remarks,
    }
    }
    else{
      data = {
      "uploadDocuments": [{
        "fileStoreId":""
        }],
        "remarks": remarks,
      }
    }

    UpdateStatus(dispatch, '/egov-opms/search', [],

      {
        "applicationType": "PETNOC",
        "tenantId": getOPMSTenantId(),
        "applicationStatus": "REJECTED",
        "applicationId": localStorage.getItem('ApplicationNumber'),
        "dataPayload": data,
        "auditDetails": {
          "createdBy": 1,
          "lastModifiedBy": 1,
          "createdTime": 1578894136873,
          "lastModifiedTime": 1578894136873
        }
      }
    );
  }
  else {
    let errorMessage = {
      labelName:
        "Please fill all mandatory fields for Applicant Details, then proceed!",
      labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }

};
const updateAdhocApprove = (state, dispatch) => {
  let validatestepformflag = popupvalidate()
  let isFormValid = validatestepformflag[0];
  let hasFieldToaster = validatestepformflag[1];

  if (isFormValid) {

    const remarks = get(
      state.screenConfiguration.preparedFinalObject,
      "PetNoc[0].PetNocDetails.Approve.remarks"

    );
    UpdateStatus(dispatch, '/egov-opms/search', [],

      {

        "applicationType": "PETNOC",
        "tenantId": getOPMSTenantId(),
        "applicationStatus": "APPROVED",
        "applicationId": localStorage.getItem('ApplicationNumber'),
        "dataPayload": {
          "remarks": remarks,
          "badgeNumber": get(
            state.screenConfiguration.preparedFinalObject,
            "PetNoc[0].PetNocDetails.Approve.badgeNumber"

          )

        },
        "auditDetails": {
          "createdBy": 1,
          "lastModifiedBy": 1,
          "createdTime": 1578894136873,
          "lastModifiedTime": 1578894136873
        }
      }
    );
  }
  else {
    let errorMessage = {
      labelName:
        "Please fill all mandatory fields for Applicant Details, then proceed!",
      labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
};



//Advertisement
const updateAdhocAdvForward = (state, dispatch) => {
  let validatestepformflag = popupvalidate()
  let isFormValid = validatestepformflag[0];
  let hasFieldToaster = validatestepformflag[1];

  let file = get(
    state.screenConfiguration.preparedFinalObject,
    "documentsUploadRedux[0].documents[0].fileStoreId"
  )
  if (isFormValid) {

    const remarks = get(
      state.screenConfiguration.preparedFinalObject,
      "advertisement[0].Forward.Remark");
    let data = {}
    if(file)
    {
      data = {
        "uploadDocuments": [{
          "fileStoreId": get(
            state.screenConfiguration.preparedFinalObject,
            "documentsUploadRedux[0].documents[0].fileStoreId"
          )
        }],
        "remarks": remarks
      }
    }
    else{
      data = {
      "uploadDocuments": [{
        "fileStoreId":""
        }],
        "remarks": remarks

      }
    }
    UpdateStatus(dispatch, '/egov-opms/advertisement-search', [],
    {
        "applicationType": "ADVERTISEMENTNOC",
        "tenantId": getOPMSTenantId(),
        "applicationStatus": role_name == "JEX" ? "REVIEWOFSUPERINTENDENT" : role_name == "SUPERINTENDENT" ? "REVIEWOFOSD" : role_name == "OSD" ? "PENDINGAPPROVAL" : '',

        "applicationId": localStorage.getItem('ApplicationNumber'),
        "dataPayload": data,
        "auditDetails": {
          "createdBy": 1,
          "lastModifiedBy": 1,
          "createdTime": 1578894136873,
          "lastModifiedTime": 1578894136873
        }
      }
    );
  }
  else {
    let errorMessage = {
      labelName:
        "Please fill all mandatory fields for Applicant Details, then proceed!",
      labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
};

const updateAdhocAdvApprove = (state, dispatch) => {
  let validatestepformflag = popupvalidate()
  let isFormValid = validatestepformflag[0];
  let hasFieldToaster = validatestepformflag[1];

  if (isFormValid) {

    const remarks = get(
      state.screenConfiguration.preparedFinalObject,
      "advertisement[0].Approve.Remark");
    UpdateStatus(dispatch, '/egov-opms/advertisement-search', [],

      {
        "applicationType": "ADVERTISEMENTNOC",
        "tenantId": getOPMSTenantId(),
        "applicationStatus": localStorageGet('pms_iswithdrawn')==="yes"?'APPROVEFORWITHDRAW':'APPROVED',
        "applicationId": localStorage.getItem('ApplicationNumber'),
        "dataPayload": {
          "remarks": remarks,
        },
        "auditDetails": {
          "createdBy": 1,
          "lastModifiedBy": 1,
          "createdTime": 1578894136873,
          "lastModifiedTime": 1578894136873
        }
      }
    );
  }
  else {
    let errorMessage = {
      labelName:
        "Please fill all mandatory fields for Applicant Details, then proceed!",
      labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
};
const updateAdhocAdvReject = (state, dispatch) => {
  let validatestepformflag = popupvalidate()
  let isFormValid = validatestepformflag[0];
  let hasFieldToaster = validatestepformflag[1];
  let file = get(
    state.screenConfiguration.preparedFinalObject,
    "documentsUploadRedux[0].documents[0].fileStoreId"
  )
  if (isFormValid ) {

    const remarks = get(
      state.screenConfiguration.preparedFinalObject,
      "advertisement[0].Reject.Remark");
      let data={}
      if(file)
      {
        data = {
          "uploadDocuments": [{
            "fileStoreId": get(
              state.screenConfiguration.preparedFinalObject,
              "documentsUploadRedux[0].documents[0].fileStoreId"
            )
          }],
          "remarks": remarks
        }
      }
      else{
        data = {
          "uploadDocuments": [{
            "fileStoreId":""
            }],
          "remarks": remarks
        }
      }
    UpdateStatus(dispatch, '/egov-opms/advertisement-search', [],

      {
        "applicationType": "ADVERTISEMENTNOC",
        "tenantId": getOPMSTenantId(),
        "applicationStatus": localStorageGet('pms_iswithdrawn')==="yes"?'REJECTEFORWITHDRAW':'REJECTED',
        "applicationId": localStorage.getItem('ApplicationNumber'),
        "dataPayload": data,
        "auditDetails": {
          "createdBy": 1,
          "lastModifiedBy": 1,
          "createdTime": 1578894136873,
          "lastModifiedTime": 1578894136873
        }
      }
    );
  }
  else {
    let errorMessage = {
      labelName:
        "Please fill all mandatory fields for Applicant Details, then proceed!",
      labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }

};
const updateAdhocAdvReassign = (state, dispatch) => {
  let validatestepformflag = popupvalidate()
  let isFormValid = validatestepformflag[0];
  let hasFieldToaster = validatestepformflag[1];
  const remarks = get(
    state.screenConfiguration.preparedFinalObject,
    "advertisement[0].Reassign.Remark");

  let file = get(
    state.screenConfiguration.preparedFinalObject,
    "documentsUploadRedux[0].documents[0].fileStoreId"
  )
  let data={}

  if(file)
  {
    data = {
    "uploadDocuments": [{
      "fileStoreId": get(
        state.screenConfiguration.preparedFinalObject,
        "documentsUploadRedux[0].documents[0].fileStoreId"
      )
    }],
    "remarks": remarks
    }
    }
    else{
    data = {
      "uploadDocuments": [{
        "fileStoreId":""
        }],

    "remarks": remarks

    }
}
  if (isFormValid ) {
    UpdateStatus(dispatch, '/egov-opms/advertisement-search', [],
      {
        "applicationType": "ADVERTISEMENTNOC",
        "tenantId": getOPMSTenantId(),
        "applicationStatus": role_name == "JEX" ? "REASSIGN" : role_name == "SUPERINTENDENT" ? "REASSIGNTOJEX" : role_name == "OSD" ? "REASSIGNTOSUPERINTENDENT": role_name == "COMMISSIONER" ? "REASSIGNTOOSD" : '',
        "applicationId": localStorage.getItem('ApplicationNumber'),
        "dataPayload": data,
        "auditDetails": {
          "createdBy": 1,
          "lastModifiedBy": 1,
          "createdTime": 1578894136873,
          "lastModifiedTime": 1578894136873
        }
      }
    );
  }
  else {
    let errorMessage = {
      labelName:
        "Please fill all mandatory fields for Applicant Details, then proceed!",
      labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
};




const updateAdhocAdvWithdrawApp = (state, dispatch) => {
  let validatestepformflag = popupvalidate()
  let isFormValid = validatestepformflag[0];
  let hasFieldToaster = validatestepformflag[1];
  let file = get(
    state.screenConfiguration.preparedFinalObject,
    "documentsUploadRedux[0].documents[0].fileStoreId"
  )
   if (isFormValid) {
    const Amount = get(
      state.screenConfiguration.preparedFinalObject,
      "advertisement[0].WithdraApproval.Amount");

    const Remark = get(
      state.screenConfiguration.preparedFinalObject,
      "advertisement[0].WithdraApproval.Remark");

    const BillAmount = get(
      state.screenConfiguration.preparedFinalObject,
      "ReceiptTemp[0].Bill[0].totalAmount");

    let data={}
      if(file)
     {
          data = {
              "uploadDocuments": [{
                "fileStoreId": get(
                  state.screenConfiguration.preparedFinalObject,
                  "documentsUploadRedux[0].documents[0].fileStoreId"
                )
              }],
              "remarks": Remark,
              "withdrawapprovalamount": Amount,

            }
          }
          else{
          data = {
            "uploadDocuments": [{
              "fileStoreId":""
              }],
          "remarks": Remark,
          "withdrawapprovalamount": Amount,
          }
      }
    

    if (BillAmount != undefined && BillAmount != null && Amount < BillAmount) {

      UpdateStatus(dispatch, '/egov-opms/advertisement-search', [],

        {
          "applicationType": "ADVERTISEMENTNOC",
          "tenantId": getOPMSTenantId(),
          "applicationStatus": role_name == "JEX" ? "REVIEWOFSPAFTERWITHDRAW" : role_name == "OSD" ? "PENDINGAPPROVALFORWITHDRAW" : '',
          "applicationId": localStorage.getItem('ApplicationNumber'),
          "dataPayload": data,
          "auditDetails": {
            "createdBy": 1,
            "lastModifiedBy": 1,
            "createdTime": 1578894136873,
            "lastModifiedTime": 1578894136873
          }
        }
      );
    } else {

      store.dispatch(
        toggleSnackbar(
          true,
          { labelName: "Withdraw smount should be less than actual amount", labelCode: "ADV_WITHDRAWAPP_INVALID_AMOUNT" },
          "error"
        )
      );

    }
  }
  else {
    let errorMessage = {
      labelName:
        "Please fill all mandatory fields for Applicant Details, then proceed!",
      labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }

};

//ADV

const updateAdhocAdvWithdraw = (state, dispatch) => {

  let validatestepformflag = popupvalidate()
  let isFormValid = validatestepformflag[0];
  let hasFieldToaster = validatestepformflag[1];

  if (isFormValid) {

    const Remark = get(
      state.screenConfiguration.preparedFinalObject,
      "advertisement[0].withdraw.Remark");


    UpdateStatus(dispatch, '/egov-opms/advertisementnoc-my-applications', [],

      {
        "applicationType": "ADVERTISEMENTNOC",
        "tenantId": getOPMSTenantId(),
        "applicationStatus": localStorage.getItem('footerApplicationStatus') == 'APPROVED' ? 'WITHDRAWAFTERAPRROVAL' : 'WITHDRAW',
        "applicationId": localStorage.getItem('ApplicationNumber'),
        "dataPayload": {
          "remarks": Remark
        },
        "auditDetails": {

          "createdBy": 1,
          "lastModifiedBy": 1,
          "createdTime": 1578894136873,
          "lastModifiedTime": 1578894136873
        }
      }
    );
    localStorage.setItem('footerApplicationStatus', '');
  }
  else {
    let errorMessage = {
      labelName:
        "Please fill all mandatory fields for Applicant Details, then proceed!",
      labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
}



//sellmeat
const updateAdhocSellMeatForward = (state, dispatch) => {
  let validatestepformflag = popupvalidate()
  let isFormValid = validatestepformflag[0];
  let hasFieldToaster = validatestepformflag[1];
  let file = get(
    state.screenConfiguration.preparedFinalObject,
    "documentsUploadRedux[0].documents[0].fileStoreId"
  )
  if (isFormValid ) {

    const remarks = get(
      state.screenConfiguration.preparedFinalObject,
      "SellMeat[0].SellMeatDetails.Forward.remarks"
    );

    let data = {}
    if(file)
    {
      data = {
        "uploadDocuments": [{
          "fileStoreId": get(
            state.screenConfiguration.preparedFinalObject,
            "documentsUploadRedux[0].documents[0].fileStoreId"
          )
        }],
        "remarks": remarks
  }
    }
    else{
      data = {
      "uploadDocuments": [{
        "fileStoreId":""
        }],
        "remarks": remarks
      }
    }

    UpdateStatus(dispatch, '/egov-opms/sellmeat-search', [],

      {
        "applicationType": "SELLMEATNOC",
        "tenantId": getOPMSTenantId(),
        "applicationStatus": role_name == "SI" ? "REVIEWOFSUPERINTENDENT" : role_name == "SUPERINTENDENT" ? "PENDINGAPPROVAL" : '',

        "applicationId": localStorage.getItem('ApplicationNumber'),
        "dataPayload":data,
        "auditDetails": {
          "createdBy": 1,
          "lastModifiedBy": 1,
          "createdTime": 1578894136873,
          "lastModifiedTime": 1578894136873
        }
      }
    );

  }
  else {
    let errorMessage = {
      labelName:
        "Please fill all mandatory fields for Applicant Details, then proceed!",
      labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
};
const updateAdhocSellMeatApprove = (state, dispatch) => {

  let validatestepformflag = popupvalidate()
  let isFormValid = validatestepformflag[0];
  let hasFieldToaster = validatestepformflag[1];

  if (isFormValid) {
    const remarks = get(
      state.screenConfiguration.preparedFinalObject,
      "SellMeat[0].SellMeatDetails.Approve.remarks"
    );
    UpdateStatus(dispatch, '/egov-opms/sellmeat-search', [],

      {
        "applicationType": "SELLMEATNOC",
        "tenantId": getOPMSTenantId(),
        "applicationStatus": 'APPROVED',
        "applicationId": localStorage.getItem('ApplicationNumber'),
        "dataPayload": {
          "remarks": remarks,
        },
        "auditDetails": {
          "createdBy": 1,
          "lastModifiedBy": 1,
          "createdTime": 1578894136873,
          "lastModifiedTime": 1578894136873
        }
      }
    );
  }
  else {
    let errorMessage = {
      labelName:
        "Please fill all mandatory fields for Applicant Details, then proceed!",
      labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
};
const updateAdhocSellMeatReject = (state, dispatch) => {
  let validatestepformflag = popupvalidate()
  let isFormValid = validatestepformflag[0];
  let hasFieldToaster = validatestepformflag[1];

  let file = get(
    state.screenConfiguration.preparedFinalObject,
    "documentsUploadRedux[0].documents[0].fileStoreId"
  )
  if (isFormValid ) {

    const remarks = get(
      state.screenConfiguration.preparedFinalObject,
      "SellMeat[0].SellMeatDetails.Reject.remarks"
    );
    let data = {}
    if(file)
    {
      data = {
        "uploadDocuments": [{
          "fileStoreId": get(
            state.screenConfiguration.preparedFinalObject,
            "documentsUploadRedux[0].documents[0].fileStoreId"
          )
        }],
        "remarks": remarks
}
    }
    else{
      data = {
      "uploadDocuments": [{
        "fileStoreId":""
        }],
        "remarks": remarks
      }
    }


    UpdateStatus(dispatch, '/egov-opms/sellmeat-search', [],

      {
        "applicationType": "SELLMEATNOC",
        "tenantId": getOPMSTenantId(),
        "applicationStatus": 'REJECTED',
        "applicationId": localStorage.getItem('ApplicationNumber'),
        "dataPayload":data,
        "auditDetails": {
          "createdBy": 1,
          "lastModifiedBy": 1,
          "createdTime": 1578894136873,
          "lastModifiedTime": 1578894136873
        }
      }
    );

  }
  else {
    let errorMessage = {
      labelName:
        "Please fill all mandatory fields for Applicant Details, then proceed!",
      labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
};
const updateAdhocSellMeatReassign = (state, dispatch) => {

  let validatestepformflag = popupvalidate()
  let isFormValid = validatestepformflag[0];
  let hasFieldToaster = validatestepformflag[1];
  let file = get(
    state.screenConfiguration.preparedFinalObject,
    "documentsUploadRedux[0].documents[0].fileStoreId"
  )
  if (isFormValid ) {
    const remarks = get(
      state.screenConfiguration.preparedFinalObject,
      "SellMeat[0].SellMeatDetails.Reassign.remarks"
    );

    let data = {}
    if(file)
    {
      data = {
        "uploadDocuments": [{
          "fileStoreId": get(
            state.screenConfiguration.preparedFinalObject,
            "documentsUploadRedux[0].documents[0].fileStoreId"
          )
        }],
        "remarks": remarks
}
    }
    else{
      data = {
      "uploadDocuments": [{
        "fileStoreId":""
        }],
        "remarks": remarks
      }
    }

    UpdateStatus(dispatch, '/egov-opms/sellmeat-search', [],

      {

        "applicationType": "SELLMEATNOC",
        "tenantId": getOPMSTenantId(),
        "applicationStatus": role_name == "SI" ? "REASSIGN" : role_name == "SUPERINTENDENT" ? "REASSIGNTOSI" : role_name == "MOH" ? "REASSIGNTOSUPERINTENDENT" : '',
        "applicationId": localStorage.getItem('ApplicationNumber'),
        "dataPayload": data,
        "auditDetails": {
          "createdBy": 1,
          "lastModifiedBy": 1,
          "createdTime": 1578894136873,
          "lastModifiedTime": 1578894136873
        }
      }
    );

  }
  else {
    let errorMessage = {
      labelName:
        "Please fill all mandatory fields for Applicant Details, then proceed!",
      labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
};


//RoadCut
const updateAdhocRoadCutForward = (state, dispatch) => {
  let validatestepformflag = popupvalidate()
  let isFormValid = validatestepformflag[0];
  let hasFieldToaster = validatestepformflag[1];
  let file = get(
    state.screenConfiguration.preparedFinalObject,
    "documentsUploadRedux[0].documents[0].fileStoreId"
  )
  if (isFormValid ) {

    const remarks = get(
      state.screenConfiguration.preparedFinalObject,
      "OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.FieldRoadCutForwardRemarks"
    );
    const RoadCutForwardAmount = get(
      state.screenConfiguration.preparedFinalObject,
      "OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.RoadCutForwardAmount"
    );
    const RoadCutForwardGstAmount = get(
      state.screenConfiguration.preparedFinalObject,
      "OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.RoadCutForwardGstAmount"
    );
    const RoadCutForwardPerformanceBankGuaranteeCharges = get(
      state.screenConfiguration.preparedFinalObject,
      "OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.RoadCutForwardPerformanceBankGuaranteeCharges"
    );
    let data = {}
    if (role_name == 'JE') {
      if(file){
      data = {
        "uploadDocuments": [{
          "fileStoreId": get(
            state.screenConfiguration.preparedFinalObject,
            "documentsUploadRedux[0].documents[0].fileStoreId"
          )
        }],
        "remarks": remarks,
        "gstAmount": RoadCutForwardGstAmount,
        "amount": RoadCutForwardAmount,
        "performanceBankGuaranteeCharges": RoadCutForwardPerformanceBankGuaranteeCharges
      }
    }else{
      data = {
        "uploadDocuments": [{
          "fileStoreId": ""
        }],
        "remarks": remarks,
        "gstAmount": RoadCutForwardGstAmount,
        "amount": RoadCutForwardAmount,
        "performanceBankGuaranteeCharges": RoadCutForwardPerformanceBankGuaranteeCharges
      }

    }
      // createDemandForRoadCutNOCPOPup(state, dispatch, getapplicationNumber(), getOPMSTenantId());
    }
    else {
      if(file){
      data = {
        "uploadDocuments": [{
          "fileStoreId": get(
            state.screenConfiguration.preparedFinalObject,
            "documentsUploadRedux[0].documents[0].fileStoreId"
          )
        }],
        "remarks": get(
          state.screenConfiguration.preparedFinalObject,
          "OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.remarks"
        ),
      }
    }else{
      data = {
        "uploadDocuments": [{
          "fileStoreId": ""
        }],
        "remarks": get(
          state.screenConfiguration.preparedFinalObject,
          "OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.remarks"
        ),
      }
    }
    }
    UpdateStatus(dispatch, '/egov-opms/roadcut-search', [],

      {

        "applicationType": "ROADCUTNOC",
        "tenantId": getOPMSTenantId(),
        "applicationStatus": role_name == "JE" ? "REVIEWSDO" : role_name == "SDO" ? "REVIEWOFEE" : role_name == "EE" ? "REVIEWOFSE" : role_name == "SE" ? "PENDINGAPRROVAL" : role_name == "CE" ? "PAYMENTPENDING" : '',

        "applicationId": localStorage.getItem('ApplicationNumber'),
        "dataPayload": data,
        "auditDetails": {
          "createdBy": 1,
          "lastModifiedBy": 1,
          "createdTime": 1578894136873,
          "lastModifiedTime": 1578894136873
        }
      }
    );

  }
  else {
    let errorMessage = {
      labelName:
        "Please fill all mandatory fields for Applicant Details, then proceed!",
      labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
};
const updateAdhocRoadCutApprove = (state, dispatch) => {

  let validatestepformflag = popupvalidate()
  let isFormValid = validatestepformflag[0];
  let hasFieldToaster = validatestepformflag[1];

  if (isFormValid) {
    const remarks = get(
      state.screenConfiguration.preparedFinalObject,
      "OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.remarks");
    UpdateStatus(dispatch, '/egov-opms/roadcut-search', [],

      {

        "applicationType": "ROADCUTNOC",
        "tenantId": getOPMSTenantId(),
        "applicationStatus": 'APPROVED',
        "applicationId": localStorage.getItem('ApplicationNumber'),
        "dataPayload": {
          "remarks": remarks,
        },
        "auditDetails": {
          "createdBy": 1,
          "lastModifiedBy": 1,
          "createdTime": 1578894136873,
          "lastModifiedTime": 1578894136873
        }
      }
    );
  }
  else {
    let errorMessage = {
      labelName:
        "Please fill all mandatory fields for Applicant Details, then proceed!",
      labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
};
const updateAdhocRoadCutReject = (state, dispatch) => {

  let validatestepformflag = popupvalidate()
  let isFormValid = validatestepformflag[0];
  let hasFieldToaster = validatestepformflag[1];
  let file = get(
    state.screenConfiguration.preparedFinalObject,
    "documentsUploadRedux[0].documents[0].fileStoreId"
  )
  if (isFormValid ) {
    const remarks = get(
      state.screenConfiguration.preparedFinalObject,
      "OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.remarks");

      let data = {}
      if(file)
      {
        data = {
          "uploadDocuments": [{
            "fileStoreId": get(
              state.screenConfiguration.preparedFinalObject,
              "documentsUploadRedux[0].documents[0].fileStoreId"
            )
          }],
          "remarks": remarks
        }
      }
      else{
        data = {
        "uploadDocuments": [{
          "fileStoreId":""
          }],
          "remarks": remarks
        }
      }
   
    UpdateStatus(dispatch, '/egov-opms/roadcut-search', [],

      {
        "applicationType": "ROADCUTNOC",
        "tenantId": getOPMSTenantId(),
        "applicationStatus": 'REJECTED',
        "applicationId": localStorage.getItem('ApplicationNumber'),
        "dataPayload": data,
        "auditDetails": {
          "createdBy": 1,
          "lastModifiedBy": 1,
          "createdTime": 1578894136873,
          "lastModifiedTime": 1578894136873
        }
      }
    );

  }
  else {
    let errorMessage = {
      labelName:
        "Please fill all mandatory fields for Applicant Details, then proceed!",
      labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
};
const updateAdhocRoadCutReassign = (state, dispatch) => {
  let validatestepformflag = popupvalidate()
  let isFormValid = validatestepformflag[0];
  let hasFieldToaster = validatestepformflag[1];
  let file = get(
    state.screenConfiguration.preparedFinalObject,
    "documentsUploadRedux[0].documents[0].fileStoreId"
  )
  if (isFormValid ) {


    const remarks = get(
      state.screenConfiguration.preparedFinalObject,
      "OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.remarks"
    );

    let data = {}
    if(file)
    {
      data = {
        "uploadDocuments": [{
          "fileStoreId": get(
            state.screenConfiguration.preparedFinalObject,
            "documentsUploadRedux[0].documents[0].fileStoreId"
          )
        }],
        "remarks": remarks
    }
    }
    else{
      data = {
      "uploadDocuments": [{
        "fileStoreId":""
        }],
        "remarks": remarks
      }
    }


    UpdateStatus(dispatch, '/egov-opms/roadcut-search', [],
      {
        "applicationType": "ROADCUTNOC",
        "tenantId": getOPMSTenantId(),
        "applicationStatus": role_name == "JE" ? "REASSIGN" : role_name == "SDO" ? "REASSIGNTOJE" : role_name == "EE" ? "REASSIGNTOSDO" : role_name == "SE" ? "REASSIGNTOEE" : role_name == "CE" ? "REASSIGNTOSE" : '',
        "applicationId": localStorage.getItem('ApplicationNumber'),
        "dataPayload": data,
        "auditDetails": {
          "createdBy": 1,
          "lastModifiedBy": 1,
          "createdTime": 1578894136873,
          "lastModifiedTime": 1578894136873
        }
      }
    );
  }
  else {
    let errorMessage = {
      labelName:
        "Please fill all mandatory fields for Applicant Details, then proceed!",
      labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }

};

export const paymentGatewaySelectionPopup = getCommonContainer({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: {
        width: "100%",
        float: "right"
      }
    },
    children: {
      div1: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 10,
          sm: 10
        },
        props: {
          style: {
            width: "100%",
            float: "right"
          }
        },
        children: {
          div: getCommonHeader(
            {
              labelName: "Select Gateway"
             // labelKey: "NOC_SELECT_GATEWAY_BOX"
            },
            {
              style: {
                fontSize: "16px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) =>
              showHideAdhocPopup(state, dispatch, "pay")
            }
          }
        }
      }
    }
  },
  adhocPenaltyCard: getCommonContainer(
    {
      penaltyAmountAndReasonContainer: getCommonContainer({
        penaltyReason: getSelectField({
          label: {
            labelName: "Select Gateway"
           // labelKey: "NOC_SELECT_GATEWAY"
          },
          placeholder: {
            labelName: "Select Gateway"
            //labelKey: "NOC_SELECT_GATEWAY"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          props: {
            style: {
              width: "90%"
            }
          },
          optionLabel: "element",
          optionValue: "element",
          sourceJsonPath: "applyScreenMdmsData.payment",
          jsonPath:
            "OPMS.paymentGateway"
        })
      })
    },
    {
      style: {
        marginTop: "12px"
      }
    }
  ),
  div: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      style: {
        width: "100%",
        textAlign: "right"
      }
    },
    children: {
      cancelButton: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            width: "140px",
            height: "48px",
            marginRight: "16px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "NOC_ADD_HOC_CHARGES_POPUP_BUTTON_CANCEL"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) =>
          showHideAdhocPopup(state, dispatch, "pay")
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "140px",
            height: "48px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Submit"
            //labelKey: "NOC_SUBMIT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: callPGService
        }
      }
    }
  }
});



export const adhocPopup1 = getCommonContainer({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: {
        width: "100%",
        float: "right"
      }
    },
    children: {
      div1: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 10,
          sm: 10
        },
        props: {
          style: {
            width: "100%",
            float: "right"
          }
        },
        children: {
          div: getCommonHeader(
            {
              labelName: "Remarks",
              labelKey: "NOC_REMARKS_PET"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) => {
                showHideAdhocPopup(state, dispatch, "search-preview")
                set(state,
                  "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
                  ""
                )
              }
            }
          }
        }
      }
    }
  },

  adhocRebateCard: getCommonContainer(
    {

      rebateAmountAndReasonContainer: getCommonContainer({
        // documentList: {
        //   uiFramework: "custom-containers-local",
        //   moduleName: "egov-opms",
        //   componentPath: "DocumentListContainer",
        //   props: {      
        //     buttonLabel: {
        //       labelName: "UPLOAD FILE",
        //       labelKey: "NOC_DOCUMENT_DETAILS_BUTTON_UPLOAD_FILE"
        //     },
        //     description: "Only .jpg and .pdf files. 6MB max file size.",
        //     inputProps: {
        //       accept: ".pdf,.png,.jpeg"
        //     },
        //     maxFileSize: 1000
        //   },
        //   type: "array"
        // },
        documentDetails,
        rebateReason: getTextField({
          label: {
            labelName: "Enter badge Number",
            labelKey: "NOC_ADD_PET_POPUP_BADGE_NUMBER_LABEL"
          },
          placeholder: {
            labelName: "Enter badge Number",
            labelKey: "NOC_ADD_PET_POPUP_BADGE_NUMBER_LABEL"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          required: true,
          pattern: /^[a-zA-Z0-9]*$/i,
          //    pattern:getPattern('BadageNumber'),
          props: {
            style: {
              width: "100%"
            }
          },
          jsonPath: "PetNoc[0].PetNocDetails.additionalDetail.badgeNumber"

        }),

        rebateCommentsField: getTextField({
          label: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADD_PET_POPUP_REMARKS_LABEL"
          },
          placeholder: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADD_PET_POPUP_REMARKS_LABEL"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          required: true,
          // pattern:/^[ A-Za-z0-9_@./#&+-]*$/i,
          pattern: /^[ A-Za-z0-9_@./#&+-]{1,250}$/i,
          props: {
            style: {
              width: "100%"
            }
          },
          jsonPath: "PetNoc[0].PetNocDetails.additionalDetail.remarks"

        }),

      })
    },
    {
      style: {
        marginTop: "24px"
      }
    }
  ),
  div: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      style: {
        width: "100%",
        textAlign: "right"
      }
    },
    children: {
      cancelButton: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            width: "140px",
            height: "48px",
            marginRight: "16px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "NOC_CANCEL_PET"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            showHideAdhocPopup(state, dispatch, "search-preview")
            set(state,
              "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
              ""
            )
          }
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "140px",
            height: "48px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "NOC_SUBMIT_PET"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: updateAdhoc1
        }
      }
    }
  }
});

export const adhocPopup2 = getCommonContainer({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: {
        width: "100%",
        float: "right"
      }
    },
    children: {
      div1: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 10,
          sm: 10
        },
        props: {
          style: {
            width: "100%",
            float: "right"
          }
        },
        children: {
          div: getCommonHeader(
            {
              labelName: "Remarks",
              labelKey: "NOC_REMARKS_PET"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) => {
                showHideAdhocPopupopmsReassign(state, dispatch, "search-preview")
                set(state,
                  "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
                  ""
                )
              }
            }
          }
        }
      }
    }
  },

  adhocRebateCard: getCommonContainer(
    {

      rebateReaassignContainer: getCommonContainer({
        // documentList: {
        //   uiFramework: "custom-containers-local",
        //   moduleName: "egov-opms",
        //   componentPath: "DocumentListContainer",
        //   props: {      
        //     buttonLabel: {
        //       labelName: "UPLOAD FILE",
        //       labelKey: "NOC_DOCUMENT_DETAILS_BUTTON_UPLOAD_FILE"
        //     },
        //     description: "Only .jpg and .pdf files. 6MB max file size.",
        //     inputProps: {
        //       accept: ".pdf,.png,.jpeg"
        //     },
        //     maxFileSize: 1000
        //   },
        //   type: "array"
        // },

        documentDetails,

        rebateReaasignField: getTextField({
          label: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADD_PET_POPUP_REMARKS_LABEL"
          },
          placeholder: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADD_PET_POPUP_REMARKS_LABEL"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          props: {
            style: {
              width: "100%"
            }
          },
          jsonPath: "PetNoc[0].PetNocDetails.Reaasign.remarks",
          required: true,
          pattern: /^[ A-Za-z0-9_@./#&+-]{1,250}$/i,


        }),
        //  documentDetails
      })
    },
    {
      style: {
        marginTop: "24px"
      }
    }
  ),
  div: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      style: {
        width: "100%",
        textAlign: "right"
      }
    },
    children: {
      cancelButton: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            width: "140px",
            height: "48px",
            marginRight: "16px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "NOC_CANCEL_PET"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            showHideAdhocPopupopmsReassign(state, dispatch, "search-preview")
            set(state,
              "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
              ""
            )
          }
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "140px",
            height: "48px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "ADD",
            labelKey: "NOC_SUBMIT_PET"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: updateAdhocReaasign
        }
      }
    }
  }
});


export const adhocPopup3 = getCommonContainer({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: {
        width: "100%",
        float: "right"
      }
    },
    children: {
      div1: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 10,
          sm: 10
        },
        props: {
          style: {
            width: "100%",
            float: "right"
          }
        },
        children: {
          div: getCommonHeader(
            {
              labelName: "Remarks",
              labelKey: "NOC_REMARKS_PET"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) =>
                showHideAdhocPopupopmsApprove(state, dispatch, "search-preview")
            }
          }
        }
      },
      // documentDetails
    }
  },

  adhocRebateCard: getCommonContainer(
    {
      rebateApproveContainer: getCommonContainer({
        rebateApproveBadgeReason: getTextField({
          label: {
            labelName: "Enter badge Number",
            labelKey: "NOC_ADD_PET_POPUP_BADGE_NUMBER_LABEL"
          },
          placeholder: {
            labelName: "Enter badge Number",
            labelKey: "NOC_ADD_PET_POPUP_BADGE_NUMBER_LABEL"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          //sourceJsonPath: "PetNoc[0].PetNocDetails.Approve.badgeNumber",        
          jsonPath: "PetNoc[0].PetNocDetails.Approve.badgeNumber",
          required: true,
          //disabled:true,
          props: {
            disabled: true
          },
          pattern: /^[a-zA-Z0-9]*$/i, // /^[a-zA-Z0-9]*$/i,
          props: {
            style: {
              width: "100%"
            }
          },
        }),
        rebateApproveField: getTextField({
          label: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADD_PET_POPUP_REMARKS_LABEL"
          },
          placeholder: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADD_PET_POPUP_REMARKS_LABEL"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          props: {
            style: {
              width: "100%"
            }
          },
          jsonPath: "PetNoc[0].PetNocDetails.Approve.remarks",
          required: true,
          pattern: /^[ A-Za-z0-9_@./#&+-]{1,250}$/i,

        }),
      })
    },
    {
      style: {
        marginTop: "24px"
      }
    }
  ),
  div: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      style: {
        width: "100%",
        textAlign: "right"
      }
    },
    children: {
      cancelButton: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            width: "140px",
            height: "48px",
            marginRight: "16px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "NOC_CANCEL_PET"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            showHideAdhocPopupopmsApprove(state, dispatch, "search-preview")

          }
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "140px",
            height: "48px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "NOC_SUBMIT_PET"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: updateAdhocApprove
        }
      }
    }
  }
});


export const adhocPopup4 = getCommonContainer({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: {
        width: "100%",
        float: "right"
      }
    },
    children: {
      div1: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 10,
          sm: 10
        },
        props: {
          style: {
            width: "100%",
            float: "right"
          }
        },
        children: {
          div: getCommonHeader(
            {
              labelName: "Remarks",
              labelKey: "NOC_REMARKS_PET"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) => {
                showHideAdhocPopupopmsReject(state, dispatch, "search-preview")
                set(state,
                  "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
                  ""
                )
              }
            }
          }
        }
      }
    }
  },

  adhocRebateCard: getCommonContainer(


    {

      rebateRejectContainer: getCommonContainer({

        // documentList: {
        //   uiFramework: "custom-containers-local",
        //   moduleName: "egov-opms",
        //   componentPath: "DocumentListContainer",
        //   props: {      
        //     buttonLabel: {
        //       labelName: "UPLOAD FILE",
        //       labelKey: "NOC_DOCUMENT_DETAILS_BUTTON_UPLOAD_FILE"
        //     },
        //     description: "Only .jpg and .pdf files. 6MB max file size.",
        //     inputProps: {
        //       accept: ".pdf,.png,.jpeg"
        //     },
        //     maxFileSize: 1000
        //   },
        //   type: "array"
        // },

        documentDetails,
        rebateRejectField: getTextField({
          label: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADD_PET_POPUP_REMARKS_LABEL"
          },
          placeholder: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADD_PET_POPUP_REMARKS_LABEL"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          props: {
            style: {
              width: "100%"
            }
          },
          jsonPath: "PetNoc[0].PetNocDetails.Reject.remarks",
          required: true,
          pattern: /^[ A-Za-z0-9_@./#&+-]{1,250}$/i,

        }),


      })
    },
    {
      style: {
        marginTop: "24px"
      }
    },

  ),
  div: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      style: {
        width: "100%",
        textAlign: "right"
      }
    },
    children: {
      cancelButton: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            width: "140px",
            height: "48px",
            marginRight: "16px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "NOC_CANCEL_PET"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            showHideAdhocPopupopmsReject(state, dispatch, "search-preview")
            set(state,
              "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
              ""
            )
          }

        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "140px",
            height: "48px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "NOC_SUBMIT_PET"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: updateAdhocReject
        }
      }
    }
  }
});


export const adhocPopupAdvertisementForward = getCommonContainer({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: {
        width: "100%",
        float: "right"
      }
    },
    children: {
      div1: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 10,
          sm: 10
        },
        props: {
          style: {
            width: "100%",
            float: "right"
          }
        },
        children: {
          div: getCommonHeader(
            {
              labelName: "Remarks",
              labelKey: "NOC_REMARKS_ADVERTISEMENT"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) => {
                showHideAdhocPopupopmsForward(state, dispatch, "advertisementnoc-search-preview")
                set(state,
                  "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
                  ""
                )
              }
            }
          }
        }
      }
    }
  },

  adhocPopupAdvertisementJEXForwardRemarkCard: getCommonContainer(
    {
      advertisementJEXForwardRemarkContainer: getCommonContainer({
        // documentList: {
        //   uiFramework: "custom-containers-local",
        //   moduleName: "egov-opms",
        //   componentPath: "DocumentListContainer",
        //   props: {      
        //     buttonLabel: {
        //       labelName: "UPLOAD FILE",
        //       labelKey: "NOC_DOCUMENT_DETAILS_BUTTON_UPLOAD_FILE"
        //     },
        //     description: "Only .jpg and .pdf files. 6MB max file size.",
        //     inputProps: {
        //       accept: ".pdf,.png,.jpeg"
        //     },
        //     maxFileSize: 1000
        //   },
        //   type: "array"
        // },
        documentDetails,
        advertisementJEXForwardRemarkField: getTextField({
          label: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADVERTISEMENT_JEX_FORWARD_REMARK_LABEL"
          },
          placeholder: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADVERTISEMENT_JEX_FORWARD_REMARK_LABEL"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          props: {
            style: {
              width: "100%"
            }
          },
          jsonPath: "advertisement[0].Forward.Remark",
          required: true,
          pattern: /^[ A-Za-z0-9_@./#&+-]{1,250}$/i,

        }),


      })
    },
    {
      style: {
        marginTop: "24px"
      }
    }
  ),
  div: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      style: {
        width: "100%",
        textAlign: "right"
      }
    },
    children: {
      cancelButton: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            width: "140px",
            height: "48px",
            marginRight: "16px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "NOC_CANCEL_ADVERTISEMENT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            showHideAdhocPopupopmsForward(state, dispatch, "advertisementnoc-search-preview")
            set(state,
              "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
              ""
            )
          }
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "140px",
            height: "48px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "NOC_SUBMIT_ADVERTISEMENT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: updateAdhocAdvForward
        }
      }
    }
  }
});

export const adhocPopupAdvertisementReassign = getCommonContainer({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: {
        width: "100%",
        float: "right"
      }
    },
    children: {
      div1: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 10,
          sm: 10
        },
        props: {
          style: {
            width: "100%",
            float: "right"
          }
        },
        children: {
          div: getCommonHeader(
            {
              labelName: "Remarks",
              labelKey: "NOC_REMARKS_ADVERTISEMENT"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) => {
                showHideAdhocPopupopmsReassign(state, dispatch, "advertisementnoc-search-preview")
                set(state,
                  "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
                  ""
                )
              }
            }
          }
        }
      }
    }
  },

  adhocPopupAdvertisementJEXReassignRemarkCard: getCommonContainer(
    {
      advertisementJEXReassignRemarkContainer: getCommonContainer({
        // documentList: {
        //   uiFramework: "custom-containers-local",
        //   moduleName: "egov-opms",
        //   componentPath: "DocumentListContainer",
        //   props: {      
        //     buttonLabel: {
        //       labelName: "UPLOAD FILE",
        //       labelKey: "NOC_DOCUMENT_DETAILS_BUTTON_UPLOAD_FILE"
        //     },
        //     description: "Only .jpg and .pdf files. 6MB max file size.",
        //     inputProps: {
        //       accept: ".pdf,.png,.jpeg"
        //     },
        //     maxFileSize: 1000
        //   },
        //   type: "array"
        // },
        documentDetails,
        advertisementJEXReassignRemarkField: getTextField({
          label: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADVERTISEMENT_JEX_REASSIGN_REMARK_LABEL"
          },
          placeholder: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADVERTISEMENT_JEX_REASSIGN_REMARK_LABEL"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          props: {
            style: {
              width: "100%"
            }
          },
          jsonPath: "advertisement[0].Reassign.Remark",
          required: true,
          pattern: /^[ A-Za-z0-9_@./#&+-]{1,250}$/i,

        }),

      })
    },
    {
      style: {
        marginTop: "24px"
      }
    }
  ),
  div: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      style: {
        width: "100%",
        textAlign: "right"
      }
    },
    children: {
      cancelButton: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            width: "140px",
            height: "48px",
            marginRight: "16px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "NOC_CANCEL_ADVERTISEMENT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            showHideAdhocPopupopmsReassign(state, dispatch, "advertisementnoc-search-preview")
            set(state,
              "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
              ""
            )
          }
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "140px",
            height: "48px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "NOC_SUBMIT_ADVERTISEMENT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: updateAdhocAdvReassign
        }
      }
    }
  }
});

export const adhocPopupAdvertisementReject = getCommonContainer({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: {
        width: "100%",
        float: "right"
      }
    },
    children: {
      div1: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 10,
          sm: 10
        },
        props: {
          style: {
            width: "100%",
            float: "right"
          }
        },
        children: {
          div: getCommonHeader(
            {
              labelName: "Remarks",
              labelKey: "NOC_REMARKS_ADVERTISEMENT"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) => {
                showHideAdhocPopupopmsReject(state, dispatch, "advertisementnoc-search-preview")
                set(state,
                  "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
                  ""
                )
              }
            }
          }
        }
      }
    }
  },

  adhocPopupAdvertisementCommissionerRejectRemarkCard: getCommonContainer(
    {
      advertisementCommissionerRejectRemarkContainer: getCommonContainer({
        // documentList: {
        //   uiFramework: "custom-containers-local",
        //   moduleName: "egov-opms",
        //   componentPath: "DocumentListContainer",
        //   props: {      
        //     buttonLabel: {
        //       labelName: "UPLOAD FILE",
        //       labelKey: "NOC_DOCUMENT_DETAILS_BUTTON_UPLOAD_FILE"
        //     },
        //     description: "Only .jpg and .pdf files. 6MB max file size.",
        //     inputProps: {
        //       accept: ".pdf,.png,.jpeg"
        //     },
        //     maxFileSize: 1000
        //   },
        //   type: "array"
        // },
        documentDetails,
        advertisementCommissionerRejectRemarkField: getTextField({
          label: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADVERTISEMENT_COMMISSIONER_REJECT_REMARK_LABEL"
          },
          placeholder: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADVERTISEMENT_COMMISSIONER_REJECT_REMARK_LABEL"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          props: {
            style: {
              width: "100%"
            }
          },
          jsonPath: "advertisement[0].Reject.Remark",
          required: true,
          pattern: /^[ A-Za-z0-9_@./#&+-]{1,250}$/i,

        }),

      })
    },
    {
      style: {
        marginTop: "24px"
      }
    }
  ),
  div: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      style: {
        width: "100%",
        textAlign: "right"
      }
    },
    children: {
      cancelButton: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            width: "140px",
            height: "48px",
            marginRight: "16px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "NOC_CANCEL_ADVERTISEMENT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            showHideAdhocPopupopmsReject(state, dispatch, "advertisementnoc-search-preview")
            set(state,
              "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
              ""
            )
          }
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "140px",
            height: "48px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "NOC_SUBMIT_ADVERTISEMENT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: updateAdhocAdvReject
        }
      }
    }
  }
});

export const adhocPopupAdvertisementApprove = getCommonContainer({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: {
        width: "100%",
        float: "right"
      }
    },
    children: {
      div1: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 10,
          sm: 10
        },
        props: {
          style: {
            width: "100%",
            float: "right"
          }
        },
        children: {
          div: getCommonHeader(
            {
              labelName: "Remarks",
              labelKey: "NOC_REMARKS_ADVERTISEMENT"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) =>
                showHideAdhocPopupopmsApprove(state, dispatch, "advertisementnoc-search-preview")
            }
          }
        }
      }
    }
  },

  adhocPopupAdvertisementCommissionerApproveRemarkCard: getCommonContainer(
    {
      advertisementCommissionerApproveRemarkContainer: getCommonContainer({

        advertisementCommissionerApproveRemarkField: getTextField({
          label: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADVERTISEMENT_COMMISSIONER_APPROVE_REMARK_LABEL"
          },
          placeholder: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADVERTISEMENT_COMMISSIONER_APPROVE_REMARK_LABEL"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          props: {
            style: {
              width: "100%"
            }
          },
          jsonPath: "advertisement[0].Approve.Remark",
          required: true,
          pattern: /^[ A-Za-z0-9_@./#&+-]{1,250}$/i,

        }),
      })
    },
    {
      style: {
        marginTop: "24px"
      }
    }
  ),
  div: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      style: {
        width: "100%",
        textAlign: "right"
      }
    },
    children: {
      cancelButton: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            width: "140px",
            height: "48px",
            marginRight: "16px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "NOC_CANCEL_ADVERTISEMENT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) =>
            showHideAdhocPopupopmsApprove(state, dispatch, "advertisementnoc-search-preview")
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "140px",
            height: "48px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "NOC_SUBMIT_ADVERTISEMENT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: updateAdhocAdvApprove
        }
      }
    }
  }
});

export const adhocPopupAdvertisementwithdrawApproval = getCommonContainer({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: {
        width: "100%",
        float: "right"
      }
    },
    children: {
      div1: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 10,
          sm: 10
        },
        props: {
          style: {
            width: "100%",
            float: "right"
          }
        },
        children: {
          div: getCommonHeader(
            {
              labelName: "Remarks",
              labelKey: "NOC_REMARKS_ADVERTISEMENT"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) =>
              showHideAdhocPopup(state, dispatch, "advertisementnoc-search-preview")
            }
          }
        }
      }
    }
  },

  adhocPopupAdvertisementOSDWithdraApprovalAmountCard: getCommonContainer(
    {
      advertisementOSDWithdraApprovalAmountContainer: getCommonContainer({
        documentDetails,
        advertisementOSDWithdraApprovalAmountField: getTextField({

          label: {
            labelName: "Enter Amount",
            labelKey: "NOC_ADVERTISEMENT_OSD_WITHDRA_APPROVAL_AMOUNT_LABEL"
          },
          placeholder: {
            labelName: "Enter Amount",
            labelKey: "NOC_ADVERTISEMENT_OSD_WITHDRA_APPROVAL_AMOUNT_LABEL"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          props: {
            style: {
              width: "100%"
            }
          },
          jsonPath: "advertisement[0].WithdraApproval.Amount",
          required: true,
          pattern: getPattern("Amountopms"),

        }),

      })
    },
    {
      style: {
        marginTop: "24px"
      }
    }
  ),
  adhocPopupAdvertisementCommissionerWithdrawApproveRemarkCard: getCommonContainer(
    {
      advertisementCommissionerWithdrawApproveRemarkContainer: getCommonContainer({
        
        advertisementCommissionerWithdrawApproveRemarkField: getTextField({
          label: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADVERTISEMENT_COMMISSIONER_APPROVE_REMARK_LABEL"
          },
          placeholder: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADVERTISEMENT_COMMISSIONER_APPROVE_REMARK_LABEL"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          props: {
            style: {
              width: "100%"
            }
          },
          jsonPath: "advertisement[0].WithdraApproval.Remark",

          required: true,
          pattern: /^[ A-Za-z0-9_@./#&+-]{1,250}$/i,

        }),
      })
    },
    {
      style: {
        marginTop: "24px"
      }
    }
  ),
  div: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      style: {
        width: "100%",
        textAlign: "right"
      }
    },
    children: {
      cancelButton: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            width: "140px",
            height: "48px",
            marginRight: "16px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "NOC_CANCEL_ADVERTISEMENT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) =>
          showHideAdhocPopup(state, dispatch, "advertisementnoc-search-preview")
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "140px",
            height: "48px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "NOC_SUBMIT_ADVERTISEMENT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: updateAdhocAdvWithdrawApp
        }
      }
    }
  }
});

//sellmeat
export const SellMeatForward = getCommonContainer({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: {
        width: "100%",
        float: "right"
      }
    },
    children: {
      div1: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 10,
          sm: 10
        },
        props: {
          style: {
            width: "100%",
            float: "right"
          }
        },
        children: {
          div: getCommonHeader(
            {
              labelName: "Remarks",
              labelKey: "NOC_REMARKS_SELLMEAT"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) => {
                showHideAdhocPopupopmsForward(state, dispatch, "sellmeatnoc-search-preview")
                set(state,
                  "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
                  ""
                )
              }
            }
          }
        }
      }
    }
  },

  SellMeatForwardCard: getCommonContainer(
    {

      SellMeatForwardContainer: getCommonContainer({
        // documentList: {
        //   uiFramework: "custom-containers-local",
        //   moduleName: "egov-opms",
        //   componentPath: "DocumentListContainer",
        //   props: {      
        //     buttonLabel: {
        //       labelName: "UPLOAD FILE",
        //       labelKey: "NOC_DOCUMENT_DETAILS_BUTTON_UPLOAD_FILE"
        //     },
        //     description: "Only .jpg and .pdf files. 6MB max file size.",
        //     inputProps: {
        //       accept: ".pdf,.png,.jpeg"
        //     },
        //     maxFileSize: 1000
        //   },
        //   type: "array"
        // },
        documentDetails,
        SellMeatForwardField: getTextField({
          label: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADD_SELLMEAT_POPUP_REMARKS_LABEL"
          },
          placeholder: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADD_SELLMEAT_POPUP_REMARKS_LABEL"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          props: {
            style: {
              width: "100%"
            }
          },
          jsonPath: "SellMeat[0].SellMeatDetails.Forward.remarks",
          required: true,
          pattern: /^[ A-Za-z0-9_@./#&+-]{1,250}$/i,

        }),

      })
    },
    {
      style: {
        marginTop: "24px"
      }
    }
  ),
  div: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      style: {
        width: "100%",
        textAlign: "right"
      }
    },
    children: {
      cancelButton: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            width: "140px",
            height: "48px",
            marginRight: "16px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "NOC_CANCEL_SELLMEAT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            showHideAdhocPopupopmsForward(state, dispatch, "sellmeatnoc-search-preview")
            set(state,
              "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
              ""
            )
          }
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "140px",
            height: "48px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "NOC_SUBMIT_PET"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: updateAdhocSellMeatForward
        }
      }
    }
  }
});


export const SellMeatReassign = getCommonContainer({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: {
        width: "100%",
        float: "right"
      }
    },
    children: {
      div1: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 10,
          sm: 10
        },
        props: {
          style: {
            width: "100%",
            float: "right"
          }
        },
        children: {
          div: getCommonHeader(
            {
              labelName: "Remarks",
              labelKey: "NOC_REMARKS_SELLMEAT"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) => {
                showHideAdhocPopupopmsReassign(state, dispatch, "sellmeatnoc-search-preview")
                set(state,
                  "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
                  ""
                )
              }
            }
          }
        }
      }
    }
  },

  SellMeatReassignCard: getCommonContainer(
    {

      SellMeatReassignContainer: getCommonContainer({

        // documentList: {
        //   uiFramework: "custom-containers-local",
        //   moduleName: "egov-opms",
        //   componentPath: "DocumentListContainer",
        //   props: {      
        //     buttonLabel: {
        //       labelName: "UPLOAD FILE",
        //       labelKey: "NOC_DOCUMENT_DETAILS_BUTTON_UPLOAD_FILE"
        //     },
        //     description: "Only .jpg and .pdf files. 6MB max file size.",
        //     inputProps: {
        //       accept: ".pdf,.png,.jpeg"
        //     },
        //     maxFileSize: 1000
        //   },
        //   type: "array"
        // },
        documentDetails,
        SellMeatReassignField: getTextField({
          label: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADD_SELLMEAT_POPUP_REMARKS_LABEL"
          },
          placeholder: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADD_SELLMEAT_POPUP_REMARKS_LABEL"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          props: {
            style: {
              width: "100%"
            }
          },
          jsonPath: "SellMeat[0].SellMeatDetails.Reassign.remarks",
          required: true,
          pattern: /^[ A-Za-z0-9_@./#&+-]{1,250}$/i,

        }),

      })
    },
    {
      style: {
        marginTop: "24px"
      }
    }
  ),
  div: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      style: {
        width: "100%",
        textAlign: "right"
      }
    },
    children: {
      cancelButton: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            width: "140px",
            height: "48px",
            marginRight: "16px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "NOC_CANCEL_SELLMEAT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            showHideAdhocPopupopmsReassign(state, dispatch, "sellmeatnoc-search-preview")
            set(state,
              "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
              ""
            )
          }
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "140px",
            height: "48px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "NOC_SUBMIT_PET"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: updateAdhocSellMeatReassign
        }
      }
    }
  }
});


export const SellMeatApprove = getCommonContainer({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: {
        width: "100%",
        float: "right"
      }
    },
    children: {
      div1: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 10,
          sm: 10
        },
        props: {
          style: {
            width: "100%",
            float: "right"
          }
        },
        children: {
          div: getCommonHeader(
            {
              labelName: "Remarks",
              labelKey: "NOC_REMARKS_SELLMEAT"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) =>
                showHideAdhocPopupopmsApprove(state, dispatch, "sellmeatnoc-search-preview")
            }
          }
        }
      }
    }
  },

  SellMeatApproveCard: getCommonContainer(
    {

      SellMeatApproveContainer: getCommonContainer({


        SellMeatApproveField: getTextField({
          label: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADD_SELLMEAT_POPUP_REMARKS_LABEL"
          },
          placeholder: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADD_SELLMEAT_POPUP_REMARKS_LABEL"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          props: {
            style: {
              width: "100%"
            }
          },
          jsonPath: "SellMeat[0].SellMeatDetails.Approve.remarks",
          required: true,
          pattern: /^[ A-Za-z0-9_@./#&+-]{1,250}$/i,

        }),
      })
    },
    {
      style: {
        marginTop: "24px"
      }
    }
  ),
  div: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      style: {
        width: "100%",
        textAlign: "right"
      }
    },
    children: {
      cancelButton: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            width: "140px",
            height: "48px",
            marginRight: "16px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "NOC_CANCEL_SELLMEAT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) =>
            showHideAdhocPopupopmsApprove(state, dispatch, "sellmeatnoc-search-preview")
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "140px",
            height: "48px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "NOC_SUBMIT_PET"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: updateAdhocSellMeatApprove
        }
      }
    }
  }
});


export const SellMeatReject = getCommonContainer({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: {
        width: "100%",
        float: "right"
      }
    },
    children: {
      div1: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 10,
          sm: 10
        },
        props: {
          style: {
            width: "100%",
            float: "right"
          }
        },
        children: {
          div: getCommonHeader(
            {
              labelName: "Remarks",
              labelKey: "NOC_REMARKS_SELLMEAT"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) => {
                showHideAdhocPopupopmsReject(state, dispatch, "sellmeatnoc-search-preview")
                set(state,
                  "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
                  ""
                )
              }
            }
          }
        }
      }
    }
  },

  SellMeatRejectCard: getCommonContainer(
    {

      SellMeatRejectContainer: getCommonContainer({
        // documentList: {
        //   uiFramework: "custom-containers-local",
        //   moduleName: "egov-opms",
        //   componentPath: "DocumentListContainer",
        //   props: {      
        //     buttonLabel: {
        //       labelName: "UPLOAD FILE",
        //       labelKey: "NOC_DOCUMENT_DETAILS_BUTTON_UPLOAD_FILE"
        //     },
        //     description: "Only .jpg and .pdf files. 6MB max file size.",
        //     inputProps: {
        //       accept: ".pdf,.png,.jpeg"
        //     },
        //     maxFileSize: 1000
        //   },
        //   type: "array"
        // },
        documentDetails,
        SellMeatRejectField: getTextField({
          label: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADD_SELLMEAT_POPUP_REMARKS_LABEL"
          },
          placeholder: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADD_SELLMEAT_POPUP_REMARKS_LABEL"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          props: {
            style: {
              width: "100%"
            }
          },
          jsonPath: "SellMeat[0].SellMeatDetails.Reject.remarks",
          required: true,
          pattern: /^[ A-Za-z0-9_@./#&+-]{1,250}$/i,



        }),

      })
    },
    {
      style: {
        marginTop: "24px"
      }
    }
  ),
  div: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      style: {
        width: "100%",
        textAlign: "right"
      }
    },
    children: {
      cancelButton: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            width: "140px",
            height: "48px",
            marginRight: "16px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "NOC_CANCEL_SELLMEAT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            showHideAdhocPopupopmsReject(state, dispatch, "sellmeatnoc-search-preview")
            set(state,
              "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
              ""
            )
          }
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "140px",
            height: "48px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "NOC_SUBMIT_PET"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: updateAdhocSellMeatReject
        }
      }
    }
  }
});


export const adhocPopupForJeRoadCutForward = getCommonContainer({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: {
        width: "100%",
        float: "right"
      }
    },
    children: {
      div1: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 10,
          sm: 10
        },
        props: {
          style: {
            width: "100%",
            float: "right"
          }
        },
        children: {
          div: getCommonHeader(
            {
              labelName: "Remarks",
              labelKey: "NOC_REMARKS_ROAD_CUT_FORWARD"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) => {
                showHideAdhocPopupopmsForward(state, dispatch, "roadcutnoc-search-preview")
                set(state,
                  "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
                  ""
                )
              }
            }
          }
        }
      }
    }
  },

  adhocRebateCardRoadCutForward: getCommonContainer(
    {

      ForwardContainerRoadCutForward: getCommonContainer({
        // documentList: {
        //   uiFramework: "custom-containers-local",
        //   moduleName: "egov-opms",
        //   componentPath: "DocumentListContainer",
        //   props: {      
        //     buttonLabel: {
        //       labelName: "UPLOAD FILE",
        //       labelKey: "NOC_DOCUMENT_DETAILS_BUTTON_UPLOAD_FILE"
        //     },
        //     description: "Only .jpg and .pdf files. 6MB max file size.",
        //     inputProps: {
        //       accept: ".pdf,.png,.jpeg"
        //     },
        //     maxFileSize: 1000
        //   },
        //   type: "array"
        // },
        documentDetails,
        RoadCutForwardAmount: getTextField({
          label: {
            labelName: "Enter Amount",
            labelKey: "NOC_ROAD_CUT_FORWARD_POPUP_AMOUNT_LABEL"
          },
          placeholder: {
            labelName: "Enter Amount",
            labelKey: "NOC_ROAD_CUT_FORWARD_POPUP_AMOUNT_LABEL"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          props: {
            style: {
              width: "100%"
            }
          },
          jsonPath: "OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.RoadCutForwardAmount",
          required: true,
          pattern: getPattern("Amountopms"),


        }),



        RoadCutForwardGstAmount: getTextField({
          label: {
            labelName: "Enter Gst Amount",
            labelKey: "NOC_ROAD_CUT_FORWARD_POPUP_GSTAMOUNT_LABEL"
          },
          placeholder: {
            labelName: "Enter Amount",
            labelKey: "NOC_ROAD_CUT_FORWARD_POPUP_GSTAMOUNT_LABEL"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          props: {
            style: {
              width: "100%"
            }
          },
          jsonPath: "OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.RoadCutForwardGstAmount",
          required: true,
          pattern: getPattern("Amountopms"),

        }),


        RoadCutForwardPerformanceBankGuaranteeCharges: getTextField({
          label: {
            labelName: "Enter Performance Bank Guarantee Charges",
            labelKey: "NOC_ROAD_CUT_FORWARD_POPUP_PERFORMANCE_BANK_GUARANTEE_CHARGES_LABEL"
          },
          placeholder: {
            labelName: "Enter Performance Bank Guarantee Charges",
            labelKey: "NOC_ROAD_CUT_FORWARD_POPUP_PERFORMANCE_BANK_GUARANTEE_CHARGES_LABEL"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          props: {
            style: {
              width: "100%"
            }
          },
          jsonPath: "OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.RoadCutForwardPerformanceBankGuaranteeCharges",
          required: true,
          pattern: getPattern("Amountopms"),


        }),




        FieldRoadCutForwardRemarks: getTextField({
          label: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ROAD_CUT_FORWARD_POPUP_REMARKS_LABEL"
          },
          placeholder: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ROAD_CUT_FORWARD_POPUP_REMARKS_LABEL"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          props: {
            style: {
              width: "100%"
            }
          },
          jsonPath: "OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.FieldRoadCutForwardRemarks",
          required: true,
          pattern: /^[ A-Za-z0-9_@./#&+-]{1,250}$/i,

        }),

      })
    },
    {
      style: {
        marginTop: "24px"
      }
    }
  ),
  div: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      style: {
        width: "100%",
        textAlign: "right"
      }
    },
    children: {
      cancelButton: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            width: "140px",
            height: "48px",
            marginRight: "16px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "NOC_CANCEL_ROAD_CUT_FORWARD"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            showHideAdhocPopupopmsForward(state, dispatch, "roadcutnoc-search-preview")
            set(state,
              "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
              ""
            )
          }
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "140px",
            height: "48px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "NOC_SUBMIT_ROAD_CUT_FORWARD"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: updateAdhocRoadCutForward
        }
      }
    }
  }
});




export const adhocPopupForJeRoadCutReassign = getCommonContainer({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: {
        width: "100%",
        float: "right"
      }
    },
    children: {
      div1: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 10,
          sm: 10
        },
        props: {
          style: {
            width: "100%",
            float: "right"
          }
        },
        children: {
          div: getCommonHeader(
            {
              labelName: "Remarks",
              labelKey: "NOC_REMARKS_ROAD_CUT_REASSIGN"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) => {
                showHideAdhocPopupopmsReassign(state, dispatch, "roadcutnoc-search-preview")
                set(state,
                  "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
                  ""
                )
              }
            }
          }
        }
      }
    }
  },

  adhocRebateCardRoadCutReassign: getCommonContainer(
    {

      ContainerRoadCutReassign: getCommonContainer({


        // documentList: {
        //   uiFramework: "custom-containers-local",
        //   moduleName: "egov-opms",
        //   componentPath: "DocumentListContainer",
        //   props: {      
        //     buttonLabel: {
        //       labelName: "UPLOAD FILE",
        //       labelKey: "NOC_DOCUMENT_DETAILS_BUTTON_UPLOAD_FILE"
        //     },
        //     description: "Only .jpg and .pdf files. 6MB max file size.",
        //     inputProps: {
        //       accept: ".pdf,.png,.jpeg"
        //     },
        //     maxFileSize: 1000
        //   },
        //   type: "array"
        // },

        documentDetails,

        FieldRoadCutReassignRemarks: getTextField({
          label: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ROAD_CUT_REASSIGN_POPUP_REMARKS_LABEL"
          },
          placeholder: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ROAD_CUT_REASSIGN_POPUP_REMARKS_LABEL"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          props: {
            style: {
              width: "100%"
            }
          },
          jsonPath: "OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.remarks",
          required: true,
          pattern: /^[ A-Za-z0-9_@./#&+-]{1,250}$/i,

        }),

      })
    },
    {
      style: {
        marginTop: "24px"
      }
    }
  ),
  div: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      style: {
        width: "100%",
        textAlign: "right"
      }
    },
    children: {
      cancelButton: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            width: "140px",
            height: "48px",
            marginRight: "16px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "NOC_CANCEL_ROAD_CUT_REASSIGN"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {

            showHideAdhocPopupopmsReassign(state, dispatch, "roadcutnoc-search-preview")
            set(state,
              "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
              ""
            )
          }
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "140px",
            height: "48px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "NOC_SUBMIT_ROAD_CUT_REASSIGN"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: updateAdhocRoadCutReassign
        }
      }
    }
  }
});



export const adhocPopupForCeRoadCutApprove = getCommonContainer({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: {
        width: "100%",
        float: "right"
      }
    },
    children: {
      div1: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 10,
          sm: 10
        },
        props: {
          style: {
            width: "100%",
            float: "right"
          }
        },
        children: {
          div: getCommonHeader(
            {
              labelName: "Remarks",
              labelKey: "NOC_REMARKS_CE_ROAD_CUT_APPROVE"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) =>
                showHideAdhocPopupopmsApprove(state, dispatch, "roadcutnoc-search-preview")
            }
          }
        }
      }
    }
  },

  adhocRebateCardCeRoadCutApprove: getCommonContainer(
    {

      ContainerCeRoadCutApprove: getCommonContainer({




        FieldCeRoadCutApproveRemarks: getTextField({
          label: {
            labelName: "Enter Remarks",
            labelKey: "NOC_CE_ROAD_CUT_APPROVE_POPUP_REMARKS_LABEL"
          },
          placeholder: {
            labelName: "Enter Remarks",
            labelKey: "NOC_CE_ROAD_CUT_APPROVE_POPUP_REMARKS_LABEL"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          props: {
            style: {
              width: "100%"
            }
          },
          jsonPath: "OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.remarks",
          required: true,
          pattern: /^[ A-Za-z0-9_@./#&+-]{1,250}$/i,

        }),
      })
    },
    {
      style: {
        marginTop: "24px"
      }
    }
  ),
  div: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      style: {
        width: "100%",
        textAlign: "right"
      }
    },
    children: {
      cancelButton: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            width: "140px",
            height: "48px",
            marginRight: "16px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "NOC_CANCEL_CE_ROAD_CUT_APPROVE"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) =>
            showHideAdhocPopupopmsApprove(state, dispatch, "roadcutnoc-search-preview")
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "140px",
            height: "48px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "NOC_SUBMIT_CE_ROAD_CUT_APPROVE"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: updateAdhocRoadCutApprove
        }
      }
    }
  }
});




export const adhocPopupForCeRoadCutReject = getCommonContainer({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: {
        width: "100%",
        float: "right"
      }
    },
    children: {
      div1: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 10,
          sm: 10
        },
        props: {
          style: {
            width: "100%",
            float: "right"
          }
        },
        children: {
          div: getCommonHeader(
            {
              labelName: "Remarks",
              labelKey: "NOC_REMARKS_CE_ROAD_CUT_REJECT"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) => {
                showHideAdhocPopupopmsReject(state, dispatch, "roadcutnoc-search-preview")
                set(state,
                  "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
                  ""
                )
              }
            }
          }
        }
      }
    }
  },

  adhocRebateCardCeRoadCutReject: getCommonContainer(
    {

      ContainerCeRoadCutReject: getCommonContainer({
        // documentList: {
        //   uiFramework: "custom-containers-local",
        //   moduleName: "egov-opms",
        //   componentPath: "DocumentListContainer",
        //   props: {      
        //     buttonLabel: {
        //       labelName: "UPLOAD FILE",
        //       labelKey: "NOC_DOCUMENT_DETAILS_BUTTON_UPLOAD_FILE"
        //     },
        //     description: "Only .jpg and .pdf files. 6MB max file size.",
        //     inputProps: {
        //       accept: ".pdf,.png,.jpeg"
        //     },
        //     maxFileSize: 1000
        //   },
        //   type: "array"
        // },
        documentDetails,
        FieldCeRoadCutRejectRemarks: getTextField({
          label: {
            labelName: "Enter Remarks",
            labelKey: "NOC_CE_ROAD_CUT_REJECT_POPUP_REMARKS_LABEL"
          },
          placeholder: {
            labelName: "Enter Remarks",
            labelKey: "NOC_CE_ROAD_CUT_REJECT_POPUP_REMARKS_LABEL"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          props: {
            style: {
              width: "100%"
            }
          },
          jsonPath: "OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.remarks",
          required: true,
          pattern: /^[ A-Za-z0-9_@./#&+-]{1,250}$/i,

        }),

      })
    },
    {
      style: {
        marginTop: "24px"
      }
    }
  ),
  div: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      style: {
        width: "100%",
        textAlign: "right"
      }
    },
    children: {
      cancelButton: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            width: "140px",
            height: "48px",
            marginRight: "16px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "NOC_CANCEL_CE_ROAD_CUT_REJECT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            showHideAdhocPopupopmsReject(state, dispatch, "roadcutnoc-search-preview")
            set(state,
              "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
              ""
            )
          }
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "140px",
            height: "48px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "NOC_SUBMIT_CE_ROAD_CUT_REJECT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: updateAdhocRoadCutReject
        }
      }
    }
  }
});


export const adhocPopupForSeRoadCutForward = getCommonContainer({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: {
        width: "100%",
        float: "right"
      }
    },
    children: {
      div1: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 10,
          sm: 10
        },
        props: {
          style: {
            width: "100%",
            float: "right"
          }
        },
        children: {
          div: getCommonHeader(
            {
              labelName: "Remarks",
              labelKey: "NOC_REMARKS_SE_ROAD_CUT_FORWORD"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) => {
                showHideAdhocPopupopmsForward(state, dispatch, "roadcutnoc-search-preview")
                set(state,
                  "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
                  ""
                )
              }
            }
          }
        }
      }
    }
  },

  adhocRebateCardSeRoadCutForward: getCommonContainer(
    {

      ContainerSeRoadCutForward: getCommonContainer({


        // documentList: {
        //   uiFramework: "custom-containers-local",
        //   moduleName: "egov-opms",
        //   componentPath: "DocumentListContainer",
        //   props: {      
        //     buttonLabel: {
        //       labelName: "UPLOAD FILE",
        //       labelKey: "NOC_DOCUMENT_DETAILS_BUTTON_UPLOAD_FILE"
        //     },
        //     description: "Only .jpg and .pdf files. 6MB max file size.",
        //     inputProps: {
        //       accept: ".pdf,.png,.jpeg"
        //     },
        //     maxFileSize: 1000
        //   },
        //   type: "array"
        // },


        documentDetails,
        FieldSeRoadCutForwardRemarks: getTextField({
          label: {
            labelName: "Enter Remarks",
            labelKey: "NOC_SE_ROAD_CUT_FORWARD_POPUP_REMARKS_LABEL"
          },
          placeholder: {
            labelName: "Enter Remarks",
            labelKey: "NOC_SE_ROAD_CUT_FORWARD_POPUP_REMARKS_LABEL"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          props: {
            style: {
              width: "100%"
            }
          },
          jsonPath: "OPMS[0].RoadCutUpdateStautsDetails.additionalDetail.remarks",
          required: true,
          pattern: /^[ A-Za-z0-9_@./#&+-]{1,250}$/i,

        }),

      })
    },
    {
      style: {
        marginTop: "24px"
      }
    }
  ),
  div: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      style: {
        width: "100%",
        textAlign: "right"
      }
    },
    children: {
      cancelButton: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            width: "140px",
            height: "48px",
            marginRight: "16px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "NOC_CANCEL_SE_ROAD_CUT_FORWARD"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            showHideAdhocPopupopmsForward(state, dispatch, "roadcutnoc-search-preview")
            set(state,
              "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
              ""
            )
          }
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "140px",
            height: "48px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "NOC_SUBMIT_SE_ROAD_CUT_FORWARD"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: updateAdhocRoadCutForward
        }
      }
    }
  }

});




export const adhocPopupAdvertisementWithdraw = getCommonContainer({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: {
        width: "100%",
        float: "right"
      }
    },
    children: {
      div1: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 10,
          sm: 10
        },
        props: {
          style: {
            width: "100%",
            float: "right"
          }
        },
        children: {
          div: getCommonHeader(
            {
              labelName: "Remarks",
              labelKey: "NOC_REMARKS_ADVERTISEMENT"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) =>
                showHideAdhocPopup(state, dispatch, "advertisementnoc-search-preview")
            }
          }
        }
      }
    }
  },

  adhocPopupAdvertisementWithdrawRemarkCard: getCommonContainer(
    {
      advertisementWithdrawRemarkContainer: getCommonContainer({

        advertisementWithdrawRemarkField: getTextField({
          label: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADVERTISEMENT_WITHDRAW_REMARK_LABEL"
          },
          placeholder: {
            labelName: "Enter Remarks",
            labelKey: "NOC_ADVERTISEMENT_WITHDRAW_REMARK_LABEL"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          props: {
            style: {
              width: "100%"
            }
          },
          jsonPath: "advertisement[0].withdraw.Remark",
          required: true,
          pattern: /^[ A-Za-z0-9_@./#&+-]{1,250}$/i,
        })
      })
    },
    {
      style: {
        marginTop: "24px"
      }
    }
  ),
  div: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      style: {
        width: "100%",
        textAlign: "right"
      }
    },
    children: {
      cancelButton: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            width: "140px",
            height: "48px",
            marginRight: "16px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "NOC_CANCEL_ADVERTISEMENT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) =>
            showHideAdhocPopup(state, dispatch, "advertisementnoc-search-preview")
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "140px",
            height: "48px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "Submit",
            labelKey: "NOC_SUBMIT_ADVERTISEMENT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: updateAdhocAdvWithdraw
        }
      }
    }
  }
});

