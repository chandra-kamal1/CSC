import { getBreak, getCommonCard, getCommonParagraph, getCommonTitle } from "egov-ui-framework/ui-config/screens/specs/utils";

export const documentDetails = getCommonCard({
  header: getCommonTitle(
    {
      abelName: "Documents",
      labelKey: "ADV_DOCUMENTS_NOC"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  subText: getCommonParagraph({
    labelName:
      "Only one file can be uploaded for one document. If multiple files need to be uploaded then please combine all files in a pdf and then upload",
    labelKey: "ROADCUT_DOCUMENT_DETAILS_SUBTEXT_NOC"
  }),
  break: getBreak(),
  documentList: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-opms",
    componentPath: "DocumentListContainer",
    props: {
      buttonLabel: {
        labelName: "UPLOAD FILE",
        labelKey: "ROADCUT_DOCUMENT_DETAILS_BUTTON_UPLOAD_FILE_NOC"
      },
      description: "Only .jpg and .pdf files. 1MB max file size.",
      inputProps: {
        accept: "image/*, .pdf, .png, .jpeg"
      },
      maxFileSize: 1000
    },
    type: "array"
  },
  subText1: getCommonParagraph({
    labelName:
      "1. Stamped Notarized 4 set drawing"
  }),
  subText2: getCommonParagraph({
    labelName:
      "2. Authorized GPS survey"
  }),
  subText3: getCommonParagraph({
    labelName:
      "3. Authorization letter of co.(to nominate the authorized person)",
  }),
  subText4: getCommonParagraph({
    labelName:
      "4. Authorized person' ID Card"
  }),
});
