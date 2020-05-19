import get from "lodash/get";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults,getMISSummaryReport,getMonthwiseReport,getMISApplicationTypeReport ,getMISSectorReport} from "../../../../../ui-utils/commons";
import { convertEpochToDate, convertDateToEpoch } from "../../utils/index";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { textToLocalMapping } from "./searchResults";
import { validateFields, getTextToLocalMapping } from "../../utils";
import { getOPMSTenantId } from "egov-ui-kit/utils/localStorageUtils";


const showHideTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "search",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};

export const searchApiCall1 = async (state, dispatch) => {
  let fromdate= get(
    state.screenConfiguration.preparedFinalObject,
    "MISSummaryReport[0].FromDate")
    let Todate= get(
      state.screenConfiguration.preparedFinalObject,
      "MISSummaryReport[0].ToDate")
      var date1 = new Date(fromdate);
      var date2 = new Date(Todate);
      const diffTime = Math.abs(date2 - date1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      let FromDate=convertEpochToDate(fromdate).split('/')
      FromDate=FromDate[2]+'-'+FromDate[1]+'-'+FromDate[0]
      let ToDate=convertEpochToDate(Todate).split('/')
      ToDate=ToDate[2]+'-'+ToDate[1]+'-'+ToDate[0]
     // alert(ToDate)
  if (
    fromdate === undefined || Todate=== undefined  
  ) {
  
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "Please fill  Date", labelKey: "ERR_FILL_DATE" },
        "warning"
      )
    );
  }
  else if(fromdate>Todate)
  {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "From Date should be less than todate", labelKey: "ERR_FILL_FROM_DATE_<_TODATE" },
        "warning"
      )
    );
  }
  else if(diffDays>365){
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "From Date and todate is not more than 1 year", labelKey: "ERR_FILL_FROM_DATE_DIFF_TODATE" },
        "warning"
      )
    );  
  }
else{
  let data1={
    "tenantId":getOPMSTenantId(),
    "reportName": "MISSummaryReport",
    "searchParams":[{"name":"fromDate","input":FromDate,
    
    },{"name":"toDate","input":ToDate,
    
    }]
  //  "searchParams":[{"name":"fromDate","input":"28/01/2020"},{"name":"toDate","input":"27/02/2020"}]
    }
    try {
      const response = await getMISSummaryReport(data1);
      // const response = searchSampleResponse();

      let data = response.reportResponses[0].reportData.map(item => ({
       // alert(item)
        [getTextToLocalMapping("applcationType")]:
          item[0] || "-",
        [getTextToLocalMapping("totalNoOfApplicationReceived")]: item[1] || "-",
        [getTextToLocalMapping("noOfApplicationProcessed")]:
          item[2] || "-",
        [getTextToLocalMapping("noOfApplicationPending")]:
        item[3] || "-",
        [getTextToLocalMapping("noOfApplicationRejected")]:
        item[4]  ||
          "-"
      }));

      dispatch(
        handleField(
          "MISSummaryReport",
          "components.div.children.searchResultsReports",
          "props.data",
          data
        )
      );
      
     
      //showHideProgress(false, dispatch);
      showHideTable1(true, dispatch);
    } catch (error) {
      //showHideProgress(false, dispatch);
      dispatch(
        toggleSnackbar(
          true,
          { labelName: error.message, labelKey: error.message },
          "error"
        )
      );
      console.log(error);
    }
  };
}
  export const searchApiCall2 = async (state, dispatch) => {
  
    //showHideTable2(false, dispatch);
    let fromdate= get(
      state.screenConfiguration.preparedFinalObject,
      "RevenueByApplicationTypeReport[0].FromDate")
      let Todate= get(
        state.screenConfiguration.preparedFinalObject,
        "RevenueByApplicationTypeReport[0].ToDate")
        var date1 = new Date(fromdate);
        var date2 = new Date(Todate);
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        let FromDate=convertEpochToDate(fromdate).split('/')
        FromDate=FromDate[2]+'-'+FromDate[1]+'-'+FromDate[0]
        let ToDate=convertEpochToDate(Todate).split('/')
        ToDate=ToDate[2]+'-'+ToDate[1]+'-'+ToDate[0]
    if (
      fromdate === undefined || Todate=== undefined
    ) {
    
      dispatch(
        toggleSnackbar(
          true,
          { labelName: "Please fill  Date", labelKey: "ERR_FILL_DATE" },
          "warning"
        )
      );
    }
    else if(fromdate>Todate)
    {
      dispatch(
        toggleSnackbar(
          true,
          { labelName: "From Date should be less than todate", labelKey: "ERR_FILL_FROM_DATE_<_TODATE" },
          "warning"
        )
      );
    }
    else if(diffDays>365){
      dispatch(
        toggleSnackbar(
          true,
          { labelName: "From Date and todate is not more than 1 year", labelKey: "ERR_FILL_FROM_DATE_DIFF_TODATE" },
          "warning"
        )
      );  
    }
  else{
    let data1={
        "tenantId": getOPMSTenantId(),
        "reportName": "RevenueCollectionReportApplicationTypeWise",
      "searchParams":[{"name":"fromDate","input":FromDate
      },{"name":"toDate","input":ToDate}]
      }
      try {
        const response = await getMISApplicationTypeReport(data1);
        // const response = searchSampleResponse();
  let data = response.reportResponses[0].reportData.map(item => ({
    // alert(item)
     [getTextToLocalMapping("applcationType")]:
       item[0] || "-",
     [getTextToLocalMapping("totalNoOfApplicationReceived")]: item[1] || "-",
     [getTextToLocalMapping("revenueCollected")]:
       item[2] || "-",
     [getTextToLocalMapping("totalNoApplicationApprovedWithNilCharges")]:
     item[3] || "-",
    
   }));

   dispatch(
     handleField(
       "reportApplicationTypeWise",
       "components.div.children.searchResultsReports2",
       "props.data",
       data
     )
   );
   
   //showHideProgress(false, dispatch);
   showHideTable2(true, dispatch);
 } catch (error) {
   //showHideProgress(false, dispatch);
   dispatch(
     toggleSnackbar(
       true,
       { labelName: error.message, labelKey: error.message },
       "error"
     )
   );
   console.log(error);
 }
}
    };


    export const searchApiCall3 = async (state, dispatch) => {
     
     
       // showHideTable3(false, dispatch);


  let fromdate= get(
    state.screenConfiguration.preparedFinalObject,
    "reportSectorWise[0].FromDate")
    let Todate= get(
      state.screenConfiguration.preparedFinalObject,
      "reportSectorWise[0].ToDate")
      var date1 = new Date(fromdate);
      var date2 = new Date(Todate);
      const diffTime = Math.abs(date2 - date1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      let FromDate=convertEpochToDate(fromdate).split('/')
      FromDate=FromDate[2]+'-'+FromDate[1]+'-'+FromDate[0]
      let ToDate=convertEpochToDate(Todate).split('/')
      ToDate=ToDate[2]+'-'+ToDate[1]+'-'+ToDate[0]
      let sector=get(
        state.screenConfiguration.preparedFinalObject,
        "reportSectorWise[0].sector",
      
      )
  if (
    fromdate === undefined || Todate=== undefined
  ) {
  
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "Please fill  Date", labelKey: "ERR_FILL_DATE" },
        "warning"
      )
    );
  }
  else if(fromdate>Todate)
  {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "From Date should be less than todate", labelKey: "ERR_FILL_FROM_DATE_<_TODATE" },
        "warning"
      )
    );
  }
  else if(diffDays>365){
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "From Date and todate is not more than 1 year", labelKey: "ERR_FILL_FROM_DATE_DIFF_TODATE" },
        "warning"
      )
    );  
  }
else{
        let data1={
            "tenantId":getOPMSTenantId(),
            "reportName": "RevenueCollectionReportSectorWise",
          "searchParams":[{"name":"fromDate","input":FromDate},
          {"name":"toDate","input":ToDate},{"name":"sector","input":(sector===undefined || sector==='All')?"":sector}]
          }
          try {
            const response = await getMISSectorReport(data1);
            // const response = searchSampleResponse();
      let data = response.reportResponses[0].reportData.map(item => ({
        // alert(item)
         [getTextToLocalMapping("applcationType")]:
           item[0] || "-",
         [getTextToLocalMapping("totalNoOfApplicationApproved")]: item[2] || "-",
         [getTextToLocalMapping("revenueCollected")]:
           item[3] || "-",
         [getTextToLocalMapping("totalNoApplicationApprovedWithNilCharges")]:
         item[4] || "-",
         [getTextToLocalMapping("sector")]:
         item[1] || "-",
       }));
    
       dispatch(
         handleField(
           "reportSectorWise",
           "components.div.children.searchResultsReports3",
           "props.data",
           data
         )
       );
       
       //showHideProgress(false, dispatch);
       showHideTable3(true, dispatch);
     } catch (error) {
       //showHideProgress(false, dispatch);
       dispatch(
         toggleSnackbar(
           true,
           { labelName: error.message, labelKey: error.message },
           "error"
         )
       );
       console.log(error);
     }
    }
        };



      
        export const searchApiCall4 = async (state, dispatch) => {
         
         let month=get(
            state.screenConfiguration.preparedFinalObject,
            "reportMonthWise[0].reportMonth",
          
          )
      let year=get(
            state.screenConfiguration.preparedFinalObject,
            "reportMonthWise[0].reportYear",
          
          )

         // alert(year.split('-'))
             showHideTable5(false, dispatch);

             if (
              month === undefined || year=== undefined
            ) {

              dispatch(
                toggleSnackbar(
                  true,
                  { labelName: "Please Select Month and Year", labelKey: "ERR_FILL_MONTH_YEAR" },
                  "warning"
                )
              );
            }
             
            else{
              let year1=year.split('-')
            let data1={
             "tenantId": getOPMSTenantId(),
             "reportName": "RevenueCollectionReportMonthWise",
             "searchParams": [
             {
             "name": "fromYear",
             "input": year1[0]
             },
             {
             "name": "toYear",
             "input": year1[1]
             },
             {
             "name": "months",
             "input": [
              month
             ]
             }
             ]
             }
               try {
                 const response = await getMonthwiseReport(data1);
                 // const response = searchSampleResponse();
           let data = response.reportResponses[0].reportData.map(item => ({
             // alert(item)
              [getTextToLocalMapping("applcationType")]:
                item[0] || "-",
              [getTextToLocalMapping("YearMonth")]: item[1] || "-",
              [getTextToLocalMapping("approve")]:
                item[2] || "-",
              [getTextToLocalMapping("rev")]:
              item[3] || "-",
              [getTextToLocalMapping("exempted")]:
              item[4] || "-",
            }));
         
            dispatch(
              handleField(
                "reportbymonth",
                "components.div.children.searchResultsReports5",
                "props.data",
                data
              )
            );
           
            //showHideProgress(false, dispatch);
            showHideTable5(true, dispatch);
          } catch (error) {
            //showHideProgress(false, dispatch);
            dispatch(
              toggleSnackbar(
                true,
                { labelName: error.message, labelKey: error.message },
                "error"
              )
            );
            console.log(error);
          }
        }
             };




















const showHideTable1 = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "MISSummaryReport",
      "components.div.children.searchResultsReports",
      "visible",
      booleanHideOrShow
    )
  );
};

const showHideTable2 = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "reportApplicationTypeWise",
      "components.div.children.searchResultsReports2",
      "visible",
      booleanHideOrShow
    )
  );
};

const showHideTable3 = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "reportSectorWise",
      "components.div.children.searchResultsReports3",
      "visible",
      booleanHideOrShow
    )
  );
};

const showHideTable5 = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "reportbymonth",
      "components.div.children.searchResultsReports5",
      "visible",
      booleanHideOrShow
    )
  );
};