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


export const taskStatusSummary = getCommonGrayCard({
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
          labelName: "TASK_STATUS",
          labelKey: "TASK_STATUS"
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
              iconName: "history" 
            }
          },
          buttonLabel: getLabel({
            labelName: "View_History",
            labelKey: "NOC_VIEW_HISTORY"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            gotoApplyWithStep(state, dispatch, 0);
          }
        },
        
      }
    }
  },
  body: getCommonContainer({
    Date: getLabelWithValue(
      {
        labelName: "Date",
        labelKey: "PETNOC_DATE"
      },
      {
        jsonPath: "nocApplicationDetail[0].remarks[0]",
        callBack: value => {
          if(value===undefined)
          {
            return '';
          }
          else{
          return convertEpochToDate(Number(value['createdtime']));
          }
        }
      }
    ),
    remarkBy: getLabelWithValue(
      {
        labelName: "Remark By",
        labelKey: "PET_REMARK_BY"
      },
      {
        jsonPath: "nocApplicationDetail[0].remarks[0]",
        callBack: value => {
          if(value===undefined)
          {
            return '';
          }
          else{
          let created_by = value['created_by'];
          return created_by;
          }
        }
      }
    ),
    Status: getLabelWithValue(
      {
        labelName: "Status",
        labelKey: "PET_NOC_STATUS"
      },
      {
        jsonPath: "nocApplicationDetail[0].remarks[0]",
        callBack: value => {
          if(value===undefined)
          {
            return '';
          }
          else{
          let applicationstatus = value['applicationstatus'];
          return applicationstatus;
          }
        }
      }
    ),
    Comment: getLabelWithValue(
      {
        labelName: "Comment",
        labelKey: "PET_NOC_COMMENT"
      },
      {
        jsonPath: "nocApplicationDetail[0].remarks[0]",
        callBack: value => {
          if(value===undefined)
          {
            return '';
          }
          else{
          let remark = value['remark'] === '' ? '' :value['remark'];
          return remark;
          }
        }
      }
    )
  })
});

