import React, { Component } from "react";
import formHoc from "egov-ui-kit/hocs/form";
import RegisterForm from "./components/RegisterForm";
import { Banner } from "modules/common";
import { connect } from "react-redux";
import get from "lodash/get";
import { getLocale, getTenantId, setTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { getQueryArg } from "egov-ui-kit/utils/commons";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";

const RegisterFormHOC = formHoc({ formKey: "register" })(RegisterForm);

class Register extends Component {
  state = {
    languageSelected: getLocale(),
  }
  onLanguageChange = (event, index, value) => {
    //const {setRote} = this.props;
    this.setState({ languageSelected: value });
    let tenantId = getTenantId();

    if (process.env.REACT_APP_NAME === "Citizen") {
      const tenantInfo=getQueryArg(window.location.href, "tenantId")
      const userInfo = JSON.parse(getUserInfo());
      tenantId = userInfo && userInfo.permanentCity;
      tenantId = tenantInfo?tenantInfo:tenantId;
    }
    this.props.fetchLocalizationLabel(value, tenantId, tenantId);
  };
  render() {
    const { bannerUrl, logoUrl,qrCodeURL,enableWhatsApp,languages,hasLocalisation } = this.props;
    return (
      <Banner hideBackButton={true} bannerUrl={bannerUrl} logoUrl={logoUrl}>
        <RegisterFormHOC logoUrl={logoUrl} qrCodeURL={qrCodeURL} enableWhatsApp={enableWhatsApp} languages ={languages} onLanguageChange={this.onLanguageChange} hasLocalisation={hasLocalisation} languageSelected={this.state.languageSelected}/>
      </Banner>
    );
  }
}

const mapStateToProps = ({ common }) => {
  const { stateInfoById } = common;
  let bannerUrl = get(stateInfoById, "0.bannerUrl");
  let logoUrl = get(stateInfoById, "0.logoUrl");
  let qrCodeURL = get(stateInfoById, "0.qrCodeURL");
  let enableWhatsApp=get(stateInfoById,"0.enableWhatsApp");
  let languages = get(stateInfoById, "0.languages", []);
  let hasLocalisation;
  if (stateInfoById && stateInfoById.length > 0) {
   hasLocalisation = stateInfoById[0].hasLocalisation;
  }
  return { bannerUrl, logoUrl ,qrCodeURL,enableWhatsApp ,languages , hasLocalisation};
};

const dispatchToProps = dispatch => {
  return {
    fetchLocalizationLabel: (locale, tenantId,tenant) => dispatch(fetchLocalizationLabel(locale, tenantId, tenant))
  };
};
export default connect(
  mapStateToProps,
  dispatchToProps
)(Register);
