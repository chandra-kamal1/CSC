import React from "react";
import { Link } from "react-router-dom";
import get from "lodash/get";
import "./index.css"
import {
  sortByEpoch,
  getEpochForDate,
  getTextToLocalMapping
} from "../../utils";
import {
  getLocalization,
  getOPMSTenantId,
  getUserInfo
} from "egov-ui-kit/utils/localStorageUtils";
import {
  getLocaleLabels,
  getTransformedLocalStorgaeLabels
} from "egov-ui-framework/ui-utils/commons";
// const buildings = get(
//     state,
//     "screenConfiguration.preparedFinalObject.gridData",
//     []
//     );
const data = localStorage.getItem('data')


export const textToLocalMapping = {
  "Application No": getLocaleLabels(
    "Application No",
    "NOC_COMMON_TABLE_COL_APP_NO_LABEL",
    getTransformedLocalStorgaeLabels()
  ),
  "NOC No": getLocaleLabels(
    "NOC No",
    "NOC_COMMON_TABLE_COL_NOC_NO_LABEL",
    getTransformedLocalStorgaeLabels()
  ),
  "NOC Type": getLocaleLabels(
    "NOC Type",
    "NOC_TYPE_LABEL",
    getTransformedLocalStorgaeLabels()
  ),
  "Owner Name": getLocaleLabels(
    "Owner Name",
    "NOC_COMMON_TABLE_COL_OWN_NAME_LABEL",
    getTransformedLocalStorgaeLabels()
  ),
  "Application Date": getLocaleLabels(
    "Application Date",
    "NOC_COMMON_TABLE_COL_APP_DATE_LABEL",
    getTransformedLocalStorgaeLabels()
  ),
  Status: getLocaleLabels(
    "Status",
    "NOC_COMMON_TABLE_COL_STATUS_LABEL",
    getTransformedLocalStorgaeLabels()
  ),
  INITIATED: getLocaleLabels(
    "Initiated,",
    "NOC_INITIATED",
    getTransformedLocalStorgaeLabels()
  ),
  APPLIED: getLocaleLabels(
    "Applied",
    "NOC_APPLIED",
    getTransformedLocalStorgaeLabels()
  ),
  DOCUMENTVERIFY: getLocaleLabels(
    "Pending for Document Verification",
    "WF_OPMSNOC_DOCUMENTVERIFY",
    getTransformedLocalStorgaeLabels()
  ),
  APPROVED: getLocaleLabels(
    "Approved",
    "NOC_APPROVED",
    getTransformedLocalStorgaeLabels()
  ),
  REJECTED: getLocaleLabels(
    "Rejected",
    "NOC_REJECTED",
    getTransformedLocalStorgaeLabels()
  ),
  CANCELLED: getLocaleLabels(
    "Cancelled",
    "NOC_CANCELLED",
    getTransformedLocalStorgaeLabels()
  ),

};

export const searchResults = {
  uiFramework: "custom-molecules",
  // moduleName: "egov-OPMS",
  componentPath: "Table",
  visible: true,
  props: {
    data: [],
    columns: [
      getTextToLocalMapping("Application No"),
      getTextToLocalMapping("Application Status"),
      getTextToLocalMapping("Applicant Name"),

      {
        name: getTextToLocalMapping(),
        options: {
          filter: false,
          customBodyRender: value => (

            <span>
              <i class="material-icons">history</i>
            </span>
          )
        }
      },

    ],
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20],
      onRowClick: (row, index) => {
        onRowClick(row);
      }
    },
    customSortColumn: {
      column: "Application Date",
      sortingFn: (data, i, sortDateOrder) => {
        const epochDates = data.reduce((acc, curr) => {
          acc.push([...curr, getEpochForDate(curr[4], "dayend")]);
          return acc;
        }, []);
        const order = sortDateOrder === "asc" ? true : false;
        const finalData = sortByEpoch(epochDates, !order).map(item => {
          item.pop();
          return item;
        });
        return { data: finalData, currentOrder: !order ? "asc" : "desc" };
      }
    }
  }
};

const onRowClick = rowData => {
  switch (rowData[5]) {
    case "INITIATED":
      window.location.href = `apply?applicationNumber=${rowData[0]}&tenantId=${getOPMSTenantId()}`;
      break;
    default:
      window.location.href = `search-preview?applicationNumber=${
        rowData[0]
        }&tenantId=` + getOPMSTenantId();
      break;
  }
};

export const searchResultsSellmeat = {
  uiFramework: "custom-molecules",
  // moduleName: "egov-OPMS",
  componentPath: "Table",
  visible: true,
  props: {
    data: [],
    //data: [{"PM_COMMON_TABLE_COL_APP_NO":"Frozen yoghurt","PM_COMMON_TABLE_COL_APP_Status":"abc"},{"PM_COMMON_TABLE_COL_APP_NO":"Frozen yoghurt","PM_COMMON_TABLE_COL_APP_Status":"abc"},{"PM_COMMON_TABLE_COL_APP_NO":"Frozen yoghurt","PM_COMMON_TABLE_COL_APP_Status":"abc"},{"PM_COMMON_TABLE_COL_APP_NO":"Frozen yoghurt","PM_COMMON_TABLE_COL_APP_Status":"abc"}],

    columns: [
      getTextToLocalMapping("Application No"),
      getTextToLocalMapping("Application Status"),
      getTextToLocalMapping("Applicant Name"),

      {
        name: getTextToLocalMapping(),
        options: {
          filter: false,
          customBodyRender: value => (

            <span>
              <i class="material-icons">history</i>

            </span>
          )
        }
      },

    ],
    //title: getTextToLocalMapping("Search Results for Egov-OPMS-NOC Applications"),
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20],
      onRowClick: (row, index) => {
        onSellmeatRowClick(row);
      }
    },
    customSortColumn: {
      column: "Application Date",
      sortingFn: (data, i, sortDateOrder) => {
        const epochDates = data.reduce((acc, curr) => {
          acc.push([...curr, getEpochForDate(curr[4], "dayend")]);
          return acc;
        }, []);
        const order = sortDateOrder === "asc" ? true : false;
        const finalData = sortByEpoch(epochDates, !order).map(item => {
          item.pop();
          return item;
        });
        return { data: finalData, currentOrder: !order ? "asc" : "desc" };
      }
    }
  }
};

const onSellmeatRowClick = rowData => {

  switch (rowData[5]) {
    case "INITIATED":
      window.location.href = `apply?applicationNumber=${rowData[0]}&tenantId=${getOPMSTenantId()}`;
      break;
    default:
      window.location.href = `sellmeatnoc-search-preview?applicationNumber=${
        rowData[0]
        }&tenantId=` + getOPMSTenantId();
      break;
  }
};


export const searchResultsRoadcut = {
  uiFramework: "custom-molecules",
  // moduleName: "egov-OPMS",
  componentPath: "Table",
  visible: true,
  props: {
    data: [],
    //data: [{"PM_COMMON_TABLE_COL_APP_NO":"Frozen yoghurt","PM_COMMON_TABLE_COL_APP_Status":"abc"},{"PM_COMMON_TABLE_COL_APP_NO":"Frozen yoghurt","PM_COMMON_TABLE_COL_APP_Status":"abc"},{"PM_COMMON_TABLE_COL_APP_NO":"Frozen yoghurt","PM_COMMON_TABLE_COL_APP_Status":"abc"},{"PM_COMMON_TABLE_COL_APP_NO":"Frozen yoghurt","PM_COMMON_TABLE_COL_APP_Status":"abc"}],

    columns: [
      getTextToLocalMapping("Application No"),
      getTextToLocalMapping("Application Status"),
      getTextToLocalMapping("Applicant Name"),

      {
        name: getTextToLocalMapping(),
        options: {
          filter: false,
          customBodyRender: value => (

            <span>
              <i class="material-icons">history</i>

            </span>
          )
        }
      },

    ],
    //title: getTextToLocalMapping("Search Results for Egov-OPMS-NOC Applications"),
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20],
      onRowClick: (row, index) => {
        onRoadcutRowClick(row);
      }
    },
    customSortColumn: {
      column: "Application Date",
      sortingFn: (data, i, sortDateOrder) => {
        const epochDates = data.reduce((acc, curr) => {
          acc.push([...curr, getEpochForDate(curr[4], "dayend")]);
          return acc;
        }, []);
        const order = sortDateOrder === "asc" ? true : false;
        const finalData = sortByEpoch(epochDates, !order).map(item => {
          item.pop();
          return item;
        });
        return { data: finalData, currentOrder: !order ? "asc" : "desc" };
      }
    }
  }
};

const onRoadcutRowClick = rowData => {

  switch (rowData[5]) {
    case "INITIATED":
      window.location.href = `apply?applicationNumber=${rowData[0]}&tenantId=` + getOPMSTenantId();
      break;
    default:
      window.location.href = `roadcutnoc-search-preview?applicationNumber=${
        rowData[0]
        }&tenantId=` + getOPMSTenantId();
      break;
  }
};


export const searchResultsAdvertisement = {
  uiFramework: "custom-molecules",
  // moduleName: "egov-OPMS",
  componentPath: "Table",
  visible: true,
  props: {
    data: [],
    // data: [{"PM_COMMON_TABLE_COL_APP_NO":"Frozen yoghurt","PM_COMMON_TABLE_COL_APP_Status":"abc"},{"PM_COMMON_TABLE_COL_APP_NO":"Frozen yoghurt","PM_COMMON_TABLE_COL_APP_Status":"abc"},{"PM_COMMON_TABLE_COL_APP_NO":"Frozen yoghurt","PM_COMMON_TABLE_COL_APP_Status":"abc"},{"PM_COMMON_TABLE_COL_APP_NO":"Frozen yoghurt","PM_COMMON_TABLE_COL_APP_Status":"abc"}],

    columns: [
      getTextToLocalMapping("Application No"),
      getTextToLocalMapping("Application Status"),
      getTextToLocalMapping("Applicant Name"),

      {
        name: getTextToLocalMapping(),
        options: {
          filter: false,
          customBodyRender: value => (

            <span>
              <i class="material-icons">history</i>

            </span>
          )
        }
      },

    ],
    //title: getTextToLocalMapping("Search Results for Egov-OPMS-NOC Applications"),
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20],
      onRowClick: (row, index) => {
        onAdvertisementRowClick(row);
      }
    },
    customSortColumn: {
      column: "Application Date",
      sortingFn: (data, i, sortDateOrder) => {
        const epochDates = data.reduce((acc, curr) => {
          acc.push([...curr, getEpochForDate(curr[4], "dayend")]);
          return acc;
        }, []);
        const order = sortDateOrder === "asc" ? true : false;
        const finalData = sortByEpoch(epochDates, !order).map(item => {
          item.pop();
          return item;
        });
        return { data: finalData, currentOrder: !order ? "asc" : "desc" };
      }
    }
  }
};

const onAdvertisementRowClick = rowData => {

  switch (rowData[5]) {
    case "INITIATED":
      window.location.href = `apply?applicationNumber=${rowData[0]}&tenantId=` + getOPMSTenantId();
      break;
    default:
      window.location.href = `advertisementnoc-search-preview?applicationNumber=${
        rowData[0]
        }&tenantId=` + getOPMSTenantId();
      break;
  }
};



export const searchResultsMaser = {
  uiFramework: "custom-molecules",
  // moduleName: "egov-OPMS",
  componentPath: "Table",
  visible: true,
  props: {
    id: "datagridsummary",
    data: [],
    // data: [{"PM_COMMON_TABLE_COL_APP_NO":"Frozen yoghurt","PM_COMMON_TABLE_COL_APP_Status":"abc"},{"PM_COMMON_TABLE_COL_APP_NO":"Frozen yoghurt","PM_COMMON_TABLE_COL_APP_Status":"abc"},{"PM_COMMON_TABLE_COL_APP_NO":"Frozen yoghurt","PM_COMMON_TABLE_COL_APP_Status":"abc"},{"PM_COMMON_TABLE_COL_APP_NO":"Frozen yoghurt","PM_COMMON_TABLE_COL_APP_Status":"abc"}],

    columns: [
      getTextToLocalMapping("Price Book Id"),
      getTextToLocalMapping("categoryId"),
      getTextToLocalMapping("subCategoryId"),
      getTextToLocalMapping("perDayPrice"),
      getTextToLocalMapping("perWeekPrice"),
      getTextToLocalMapping("perMonthPrice"),
      getTextToLocalMapping("annualPrice"),
      getTextToLocalMapping("effectiveFromDate"),
      getTextToLocalMapping("effectiveToDate"),

      {
        name: getTextToLocalMapping(),
        options: {
          filter: false,
          customBodyRender: value => (

            <span>
              {/* <a href="masterUpdateRate?applicationNumber="> <i class="material-icons"  >history</i></a> */}
              {/* <a onClick={onMasterRowClick}> <i class="material-icons"  >history</i></a> */}

            </span>
          )
        },
      },

    ],
    //title: getTextToLocalMapping("Search Results for Egov-OPMS-NOC Applications"),
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20],
      onRowClick: (row, index) => {
        onMasterRowClick(row);
      }
    },
    customSortColumn: {
      column: "Application Date",
      sortingFn: (data, i, sortDateOrder) => {
        const epochDates = data.reduce((acc, curr) => {
          acc.push([...curr, getEpochForDate(curr[4], "dayend")]);
          return acc;
        }, []);
        const order = sortDateOrder === "asc" ? true : false;
        const finalData = sortByEpoch(epochDates, !order).map(item => {
          item.pop();
          return item;
        });
        return { data: finalData, currentOrder: !order ? "asc" : "desc" };
      }
    }

  }
};
const onMasterRowClick = rowData => {
  // alert('aa')
  // 
  if (JSON.parse(getUserInfo()).roles[0].code == "OSD") {
    window.location.href = `masterUpdateRate?pricebookid=${rowData[0]}`;

  }
  else {

  }

};









export const searchResultsReports = {
  uiFramework: "custom-molecules",
  // moduleName: "egov-OPMS",
  componentPath: "Table",
  visible: true,
  props: {
    data: [],
    //data: [{"PM_COMMON_TABLE_COL_APP_NO":"Frozen yoghurt","PM_COMMON_TABLE_COL_APP_Status":"abc"},{"PM_COMMON_TABLE_COL_APP_NO":"Frozen yoghurt","PM_COMMON_TABLE_COL_APP_Status":"abc"},{"PM_COMMON_TABLE_COL_APP_NO":"Frozen yoghurt","PM_COMMON_TABLE_COL_APP_Status":"abc"},{"PM_COMMON_TABLE_COL_APP_NO":"Frozen yoghurt","PM_COMMON_TABLE_COL_APP_Status":"abc"}],

    columns: [
      getTextToLocalMapping("applcationType"),
      getTextToLocalMapping("totalNoOfApplicationReceived"),
      getTextToLocalMapping("noOfApplicationProcessed"),
      getTextToLocalMapping("noOfApplicationPending"),
      getTextToLocalMapping("noOfApplicationRejected")

    ],
    //title: getTextToLocalMapping("Search Results for Egov-OPMS-NOC Applications"),
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20],

    },
    customSortColumn: {
      column: "Application Date",
      sortingFn: (data, i, sortDateOrder) => {
        const epochDates = data.reduce((acc, curr) => {
          acc.push([...curr, getEpochForDate(curr[4], "dayend")]);
          return acc;
        }, []);
        const order = sortDateOrder === "asc" ? true : false;
        const finalData = sortByEpoch(epochDates, !order).map(item => {
          item.pop();
          return item;
        });
        return { data: finalData, currentOrder: !order ? "asc" : "desc" };
      }
    }
  }
};

export const searchResultsReports2 = {
  uiFramework: "custom-molecules",
  // moduleName: "egov-OPMS",
  componentPath: "Table",
  visible: true,
  props: {
    data: [],
    //data: [{"PM_COMMON_TABLE_COL_APP_NO":"Frozen yoghurt","PM_COMMON_TABLE_COL_APP_Status":"abc"},{"PM_COMMON_TABLE_COL_APP_NO":"Frozen yoghurt","PM_COMMON_TABLE_COL_APP_Status":"abc"},{"PM_COMMON_TABLE_COL_APP_NO":"Frozen yoghurt","PM_COMMON_TABLE_COL_APP_Status":"abc"},{"PM_COMMON_TABLE_COL_APP_NO":"Frozen yoghurt","PM_COMMON_TABLE_COL_APP_Status":"abc"}],

    columns: [
      getTextToLocalMapping("applcationType"),
      getTextToLocalMapping("totalNoOfApplicationReceived"),
      getTextToLocalMapping("revenueCollected"),
      getTextToLocalMapping("totalNoApplicationApprovedWithNilCharges")

    ],
    //title: getTextToLocalMapping("Search Results for Egov-OPMS-NOC Applications"),
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20],

    },
    customSortColumn: {
      column: "Application Date",
      sortingFn: (data, i, sortDateOrder) => {
        const epochDates = data.reduce((acc, curr) => {
          acc.push([...curr, getEpochForDate(curr[4], "dayend")]);
          return acc;
        }, []);
        const order = sortDateOrder === "asc" ? true : false;
        const finalData = sortByEpoch(epochDates, !order).map(item => {
          item.pop();
          return item;
        });
        return { data: finalData, currentOrder: !order ? "asc" : "desc" };
      }
    }
  }
};


export const searchResultsReports3 = {
  uiFramework: "custom-molecules",
  // moduleName: "egov-OPMS",
  componentPath: "Table",
  visible: true,
  props: {
    data: [],
    //data: [{"PM_COMMON_TABLE_COL_APP_NO":"Frozen yoghurt","PM_COMMON_TABLE_COL_APP_Status":"abc"},{"PM_COMMON_TABLE_COL_APP_NO":"Frozen yoghurt","PM_COMMON_TABLE_COL_APP_Status":"abc"},{"PM_COMMON_TABLE_COL_APP_NO":"Frozen yoghurt","PM_COMMON_TABLE_COL_APP_Status":"abc"},{"PM_COMMON_TABLE_COL_APP_NO":"Frozen yoghurt","PM_COMMON_TABLE_COL_APP_Status":"abc"}],

    columns: [
      getTextToLocalMapping("applcationType"),
      getTextToLocalMapping("sector"),
      getTextToLocalMapping("totalNoOfApplicationApproved"),
      getTextToLocalMapping("revenueCollected"),
      getTextToLocalMapping("totalNoApplicationApprovedWithNilCharges"),


    ],
    //title: getTextToLocalMapping("Search Results for Egov-OPMS-NOC Applications"),
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20],

    },
    customSortColumn: {
      column: "Application Date",
      sortingFn: (data, i, sortDateOrder) => {
        const epochDates = data.reduce((acc, curr) => {
          acc.push([...curr, getEpochForDate(curr[4], "dayend")]);
          return acc;
        }, []);
        const order = sortDateOrder === "asc" ? true : false;
        const finalData = sortByEpoch(epochDates, !order).map(item => {
          item.pop();
          return item;
        });
        return { data: finalData, currentOrder: !order ? "asc" : "desc" };
      }
    }
  }
};


export const searchResultsReports4 = {
  uiFramework: "custom-molecules",
  // moduleName: "egov-OPMS",
  componentPath: "Table",
  visible: true,
  props: {
    data: [],
    //data: [{"PM_COMMON_TABLE_COL_APP_NO":"Frozen yoghurt","PM_COMMON_TABLE_COL_APP_Status":"abc"},{"PM_COMMON_TABLE_COL_APP_NO":"Frozen yoghurt","PM_COMMON_TABLE_COL_APP_Status":"abc"},{"PM_COMMON_TABLE_COL_APP_NO":"Frozen yoghurt","PM_COMMON_TABLE_COL_APP_Status":"abc"},{"PM_COMMON_TABLE_COL_APP_NO":"Frozen yoghurt","PM_COMMON_TABLE_COL_APP_Status":"abc"}],

    columns: [
      getTextToLocalMapping("applcationType"),
      getTextToLocalMapping("avgTimeTakenToProcessRequest"),
      getTextToLocalMapping("pendingMoreThan10AndLessThan30Days"),
      getTextToLocalMapping("pendingMoreThan30Days"),

    ],
    //title: getTextToLocalMapping("Search Results for Egov-OPMS-NOC Applications"),
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20],

    },
    customSortColumn: {
      column: "Application Date",
      sortingFn: (data, i, sortDateOrder) => {
        const epochDates = data.reduce((acc, curr) => {
          acc.push([...curr, getEpochForDate(curr[4], "dayend")]);
          return acc;
        }, []);
        const order = sortDateOrder === "asc" ? true : false;
        const finalData = sortByEpoch(epochDates, !order).map(item => {
          item.pop();
          return item;
        });
        return { data: finalData, currentOrder: !order ? "asc" : "desc" };
      }
    }
  }
};


export const searchResultsReports5 = {
  uiFramework: "custom-molecules",
  // moduleName: "egov-OPMS",
  componentPath: "Table",
  visible: true,
  props: {
    data: [],
    //data: [{"PM_COMMON_TABLE_COL_APP_NO":"Frozen yoghurt","PM_COMMON_TABLE_COL_APP_Status":"abc"},{"PM_COMMON_TABLE_COL_APP_NO":"Frozen yoghurt","PM_COMMON_TABLE_COL_APP_Status":"abc"},{"PM_COMMON_TABLE_COL_APP_NO":"Frozen yoghurt","PM_COMMON_TABLE_COL_APP_Status":"abc"},{"PM_COMMON_TABLE_COL_APP_NO":"Frozen yoghurt","PM_COMMON_TABLE_COL_APP_Status":"abc"}],

    columns: [
      getTextToLocalMapping("applcationType"),
      getTextToLocalMapping("YearMonth"),
      getTextToLocalMapping("approve"),
      getTextToLocalMapping("rev"),
      getTextToLocalMapping("exempted"),

    ],
    //title: getTextToLocalMapping("Search Results for Egov-OPMS-NOC Applications"),
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20],

    },
    customSortColumn: {
      column: "Application Date",
      sortingFn: (data, i, sortDateOrder) => {
        const epochDates = data.reduce((acc, curr) => {
          acc.push([...curr, getEpochForDate(curr[4], "dayend")]);
          return acc;
        }, []);
        const order = sortDateOrder === "asc" ? true : false;
        const finalData = sortByEpoch(epochDates, !order).map(item => {
          item.pop();
          return item;
        });
        return { data: finalData, currentOrder: !order ? "asc" : "desc" };
      }
    }
  }
};
