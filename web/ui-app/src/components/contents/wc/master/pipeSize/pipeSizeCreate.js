import React, { Component } from 'react';
import { connect } from 'react-redux';
import SimpleMap from '../../../../common/GoogleMaps.js';

import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import { brown500, red500, white, orange800 } from 'material-ui/styles/colors';
import Checkbox from 'material-ui/Checkbox';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Api from '../../../../../api/api';
import { translate } from '../../../../common/common';

var flag = 0;
const styles = {
  headerStyle: {
    fontSize: 19,
  },
  marginStyle: {
    margin: '15px',
  },
  paddingStyle: {
    padding: '15px',
  },
  errorStyle: {
    color: red500,
  },
  underlineStyle: {
    borderColor: brown500,
  },
  underlineFocusStyle: {
    borderColor: brown500,
  },
  floatingLabelStyle: {
    color: brown500,
  },
  floatingLabelFocusStyle: {
    color: brown500,
  },
  customWidth: {
    width: 100,
  },
  checkbox: {
    marginTop: 37,
  },
};

var _this;

class PipeSizeCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      data: '',
      open: false,
    };
    this.handleOpenNClose = this.handleOpenNClose.bind(this);
  }

  handleOpenNClose() {
    this.setState({
      open: !this.state.open,
    });

    let { initForm } = this.props;
    initForm();
  }

  componentWillMount() {
    if (this.props.match.params.id) {
      console.log();
      this.setState({ id: this.props.match.params.id });
      var body = {};
      let current = this;
      let { setForm } = this.props;

      Api.commonApiPost('/wcms/masters/pipesize/_search', { id: this.props.match.params.id }, body, false, true).then(
        function(response) {
          console.log('response', response);
          console.log('response object', response.pipeSizes[0]);
          current.setState({ data: response.pipeSizes });
          setForm(response.pipeSizes[0]);
        },
        function(err) {
          current.props.toggleSnackbarAndSetText(true, err.message);
          current.props.setLoadingStatus('hide');
        }
      );
    } else {
      let { initForm } = this.props;
      initForm();
    }
  }

  componentDidMount() {
    //   this.props.setForm({
    //     active : true
    // })
  }

  componentDidUpdate() {}
  close() {
    window.close();
  }

  handleChangeState = (e, name, isRequired, pattern) => {
    if (e.target.value === 0.0) {
      this.props.toggleSnackbarAndSetText('0.0 not a valid size');
    } else {
      this.props.handleChange(e, name, isRequired, pattern);
      var inches = e.target.value * 0.03937;
      this.props.handleChange({ target: { value: inches } }, 'sizeInInch', false, '');
    }
  };

  submitForm = e => {
    e.preventDefault();
    var current = this;

    var body = {
      pipeSize: {
        id: this.props.createPipeSize.id,
        sizeInMilimeter: this.props.createPipeSize.sizeInMilimeter,
        code: this.props.createPipeSize.code,
        active: !this.props.createPipeSize.active ? false : this.props.createPipeSize.active,
        description: this.props.createPipeSize.description,
        tenantId: 'default',
      },
    };

    if (this.props.match.params.id) {
      Api.commonApiPost('/wcms/masters/pipesize/' + body.pipeSize.code + '/_update', {}, body, false, true).then(
        function(response) {
          console.log(response);
          current.setState({
            open: true,
          });
        },
        function(err) {
          current.props.toggleSnackbarAndSetText(true, err.message);
          current.props.setLoadingStatus('hide');
        }
      );
    } else {
      Api.commonApiPost('/wcms/masters/pipesize/_create', {}, body, false, true).then(
        function(response) {
          console.log(response);
          current.setState({
            open: true,
          });
          current.props.resetObject('createPipeSize');
        },
        function(err) {
          current.props.toggleSnackbarAndSetText(true, err.message);
          current.props.setLoadingStatus('hide');
        }
      );
    }
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    let {
      createPipeSize,
      fieldErrors,
      isFormValid,
      isTableShow,
      handleUpload,
      files,
      handleChange,
      handleMap,
      handleChangeNextOne,
      handleChangeNextTwo,
      buttonText,
    } = this.props;

    let { submitForm, handleOpenNClose, handleChangeState } = this;
    console.log('createPipeSize', createPipeSize);

    return (
      <div className="createPipeSize">
        <form
          autoComplete="off"
          onSubmit={e => {
            submitForm(e);
          }}
        >
          <Card style={styles.marginStyle}>
            <CardHeader
              style={{ paddingBottom: 0 }}
              title={<div style={styles.headerStyle}> {this.state.id != '' ? 'Update Pipe Size' : 'Create Pipe Size'} </div>}
            />
            <CardText style={{ padding: 0 }}>
              <Grid>
                <Row>
                  <Col xs={12} md={3} sm={6}>
                    <TextField
                      fullWidth={true}
                      floatingLabelText={'H.S.C Pipe Size (mm):' + '*'}
                      value={createPipeSize.sizeInMilimeter ? createPipeSize.sizeInMilimeter : ''}
                      errorText={fieldErrors.sizeInMilimeter ? fieldErrors.sizeInMilimeter : ''}
                      maxLength={100}
                      onChange={e => {
                        createPipeSize.active = true;
                        handleChangeState(e, 'sizeInMilimeter', true, /^\d+(\.\d+)?$/);
                      }}
                      id="sizeInMilimeter"
                    />
                  </Col>
                  <Col xs={12} md={3} sm={6}>
                    <TextField
                      fullWidth={true}
                      floatingLabelText={'H.S.C Pipe Size (Inches):' + '*'}
                      value={createPipeSize.sizeInInch ? createPipeSize.sizeInInch : '0.0'}
                      errorText={fieldErrors.sizeInInch ? fieldErrors.sizeInInch : ''}
                      maxLength={100}
                      onChange={e => {
                        createPipeSize.active = true;
                        handleChange(e, 'sizeInInch', true, /^[a-zA-Z0-9 ]*$/g);
                      }}
                      id="sizeInInch"
                      disabled={true}
                    />
                  </Col>
                  <div className="clearfix" />
                  <Col xs={12} md={3} sm={6}>
                    <TextField
                      fullWidth={true}
                      maxLength={250}
                      floatingLabelText={translate('core.lbl.description')}
                      value={createPipeSize.description ? createPipeSize.description : ''}
                      errorText={fieldErrors.description ? fieldErrors.description : ''}
                      onChange={e => {
                        handleChange(e, 'description', false, /^[a-zA-Z0-9 ]*$/g);
                      }}
                      multiLine={true}
                      id="description"
                    />
                  </Col>
                  <Col xs={12} md={3} sm={6}>
                    {console.log(createPipeSize.active)}
                    <Checkbox
                      label={translate('pgr.lbl.active')}
                      style={styles.checkbox}
                      defaultChecked={this.state.id != '' ? createPipeSize.active || false : createPipeSize.active || true}
                      onCheck={(e, i, v) => {
                        console.log(createPipeSize.active, i);

                        var e = {
                          target: {
                            value: i,
                          },
                        };
                        handleChange(e, 'active', false, '');
                      }}
                      id="active"
                    />
                  </Col>
                </Row>
              </Grid>
            </CardText>
          </Card>
          <div style={{ textAlign: 'center' }}>
            <RaisedButton
              primary="true"
              style={{ margin: '15px 5px' }}
              type="submit"
              disabled={!isFormValid}
              label={this.state.id != '' ? translate('pgr.lbl.update') : translate('pgr.lbl.create')}
            />
          </div>
        </form>

        <Dialog
          title={
            this.state.id != ''
              ? 'Pipe Size ' + createPipeSize.sizeInMilimeter + ' Updated Successfully'
              : 'Pipe Size ' + createPipeSize.sizeInMilimeter + ' Created Successfully'
          }
          actions={
            <FlatButton label={translate('core.lbl.close')} primary={true} onTouchTap={this.state.id != '' ? this.handleClose : handleOpenNClose} />
          }
          modal={false}
          open={this.state.open}
          onRequestClose={this.state.id != '' ? this.handleClose : handleOpenNClose}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    createPipeSize: state.form.form,
    files: state.form.files,
    fieldErrors: state.form.fieldErrors,
    isFormValid: state.form.isFormValid,
    isTableShow: state.form.showTable,
    buttonText: state.form.buttonText,
  };
};

const mapDispatchToProps = dispatch => ({
  initForm: () => {
    dispatch({
      type: 'RESET_STATE',
      validationData: {
        required: {
          current: ['active'],
          required: ['sizeInMilimeter', 'active'],
        },
        pattern: {
          current: [],
          required: [],
        },
      },
    });
  },

  setForm: data => {
    dispatch({
      type: 'SET_FORM',
      data,
      isFormValid: false,
      fieldErrors: {},
      validationData: {
        required: {
          current: ['sizeInMilimeter'],
          required: ['sizeInMilimeter'],
        },
        pattern: {
          current: [],
          required: [],
        },
      },
    });
  },

  resetObject: object => {
    console.log(object);
    dispatch({
      type: 'RESET_OBJECT',
      object,
    });
  },

  handleChange: (e, property, isRequired, pattern) => {
    console.log('handlechange' + e + property + isRequired + pattern);
    dispatch({
      type: 'HANDLE_CHANGE',
      property,
      value: e.target.value,
      isRequired,
      pattern,
    });
  },
  setLoadingStatus: loadingStatus => {
    dispatch({ type: 'SET_LOADING_STATUS', loadingStatus });
  },
  toggleSnackbarAndSetText: (snackbarState, toastMsg) => {
    dispatch({ type: 'TOGGLE_SNACKBAR_AND_SET_TEXT', snackbarState, toastMsg });
  },
  setInitalObject: (createPipeSize, object) => {
    dispatch({
      type: 'EDIT_OBJECT',
      objectName: createPipeSize,
      object: object,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PipeSizeCreate);
