/* eslint-disable no-unused-vars */
import {
  AppBar, Button,
  Dialog,
  FormControl,
  FormControlLabel,
  FormLabel, Grid,
  IconButton, InputLabel,
  MenuItem,
  Paper,
  Radio, RadioGroup,
  Toolbar, Typography,
  withStyles,
  FormHelperText,
} from '@material-ui/core';
import {
  Add,
  AddBox,
  ArrowDownward,
  Check,
  ChevronLeft,
  ChevronRight,
  Clear,
  Delete,
  DeleteOutline,
  Edit,
  FilterList,
  FirstPage,
  LastPage,
  Lock,
  Remove,
  SaveAlt,
  Search,
  ViewColumn
} from '@material-ui/icons';
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MaterialTable from 'material-table';
import React, { forwardRef } from 'react';
import CloseIcon from '@material-ui/icons/Close';

// Local
import { drawerWidth, DEFAULT_CASE_CHECK_OT, FONT_SIZE, HEADER_FONT_SIZE } from '../../../config';
import AccessForm from '../../../components/access-form';
import AlertCard from '../../../components/alert-card/alert-card.component';
import ChangePasswordDialog from '../../../components/change-password-dialog-box/change-password-dialog.component';

//Date Utils
import LuxonUtils from '@date-io/luxon';

//Formik and Yup
import { Formik, Form, Field } from 'formik';
import {TextField as FormikTextField, Select as FormikSelect} from 'formik-material-ui';
import * as Yup from 'yup';
import { getAllCases, getUsers, getDepartments, getGroups, createAccount, deleteAccount, editAccount } from '../../../util/network';

const defaultModules = {
  "caseot": {
      "view": false,
      "add": false,
      "edit": false,
      "closecase": false,
      "printcase": false,
      "addzone": false,
      "addpoi": false,
      "export": false
  },
  "locateot": {
      "view": false,
      "add": false,
      "edit": false,
      "newnumber": false,
      "schedule": false
  },
  "checkot": {
      "view": false,
      "add": false,
      "edit": false,
      "export": false,
      "newnumber": false,
      "schedule": false
  },
  "fenceot": {
      "view": false,
      "add": false,
      "edit": false,
      "addzone": false,
      "addpoi": false,
      "export": false
  },
  "mobileot": {
      "view": false,
      "add": false,
      "edit": false
  }
}


const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

const styles = (theme) => ({
  chip: {
    margin: theme.spacing(0.5),
    fontSize: FONT_SIZE
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    fontSize: FONT_SIZE
  },
  drawerPaper: {
    width: '40%',
    align: 'center',
    fontSize: FONT_SIZE
  },
  drawercontent: {
    padding: 32,
    fontSize: FONT_SIZE
  },
  buttonStyle: {
    width: 100,
    height: 30,
    margin: theme.spacing(0.5),
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  appBar: {
    position: 'relative',
    backgroundColor: '#18202c'
  },
  error:{
    color: 'red'
  },
  field:{
    fontSize: FONT_SIZE
  }
});




class Users extends React.Component {
  constructor(props) {
    super(props);
    this.getDrawer = this.getDrawer.bind(this);
    this.getAccessForm = this.getAccessForm.bind(this);
    this.getDepartmentsList = this.getDepartmentsList.bind(this);
    this.getGroupList = this.getGroupList.bind(this);
    this.getUsersList = this.getUsersList.bind(this);
    this.onCreateOrEditButtonPress = this.onCreateOrEditButtonPress.bind(this);
    this.resetToDefault = this.resetToDefault.bind(this);
    this.fetchAllCases = this.fetchAllCases.bind(this);
    this.onDeleteButtonPress = this.onDeleteButtonPress.bind(this);
    this.onClose=this.onClose.bind(this); 
    this.handleChangePassDialog = this.handleChangePassDialog.bind(this);
    this.openAdminAlert = this.openAdminAlert.bind(this);
  }

  state = {
    currentAccount: this.props.currentAccount,
    drawerOpen: false,
    showAccessForm: false,
    editMode: false,
    patchMode: false,
    error: null,
    loading: false,
    designationOptions: [],
    departmentOptions: [],
    groupOptions:[],
    cases: [],
    departmentNameIdMap: {},
    groupNameIdMap: {},
    tableData: [],
    editableItem: {
      first_name: '',
      last_name: '',
      email: '',
      username: '',
      disabled: false,
      password: '',
      designation: '',
      department: '',
      group: '',
      phone: '',
      start_date: Math.round(new Date() / 1000),
      end_date: Math.round(new Date() / 1000),
      modules: defaultModules
    },
    emailPattern: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
    addCasesDialogOpen: false,
    currentCaseAdd: 'Add Case',
    selectedCasesList: [],
    alertOpen: false,
    alertType: '',
    alertTitle: '',
    alertMessage: '',
    changePasswordDialogOpen: false,
    passwordChangeUsername: null,
  };

  getData = (data) => {
    this.setState({
      editableItem: {
        ...this.state.editableItem,
        modules: data
      }
    })
  }
  onClose(){
    this.setState({
      alertOpen: false
    })
  }

  openAdminAlert(type, title, message){
    this.setState({
      alertType: type,
      alertTitle: title,
      alertMessage: message,
      alertOpen: true
    })
  }

  handleChangePassDialog(){
    this.setState({
      changePasswordDialogOpen: !this.state.changePasswordDialogOpen,
      passwordChangeUsername: null
    })
  }

  render() {
    return (
      <div>
        {this.state.alertOpen && 
          (<AlertCard 
            onClose={this.onClose}
            type={this.state.alertType} 
            title={this.state.alertTitle} 
            message={this.state.alertMessage} 
          />)
        }
        {
          this.state.changePasswordDialogOpen && (
            <ChangePasswordDialog 
              adminReset={true}
              username={this.state.passwordChangeUsername} 
              open={this.state.changePasswordDialogOpen} 
              onClose={this.handleChangePassDialog}
              adminAlert = {this.openAdminAlert}
            />
          )
        }  
        {this.getDrawer()}
        {this.getAccessForm()}
        <Grid container>
          <Grid style={{ padding: 0, width: 36 }}></Grid>
          <Grid item md={11}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <Button variant="contained" color="primary" style={{ backgroundColor: '#18202c', }}
                onClick={() =>
                  this.setState({
                    editableItem: {
                      first_name: '',
                      last_name: '',
                      email: '',
                      username: '',
                      disabled: false,
                      password: '',
                      designation: '',
                      department: '',
                      group: '',
                      phone: '',
                      start_date: Math.round(new Date() / 1000),
                      end_date: Math.round(new Date() / 1000),
                      modules: defaultModules
                    },
                    drawerOpen: true,
                    editMode: false,
                    patchMode: false,
                  })
                }
              >
                Create User
              </Button>
            </div>
            <MaterialTable
              icons={tableIcons}
              components={{
                Container: (props) => <Paper {...props} elevation={0} />,
              }}
              options={{
                grouping: true,
                exportButton: true,
                actionsColumnIndex: -1,
                paging: false,
                rowStyle:{
                  fontSize: FONT_SIZE
                },
                headerStyle:{
                  fontSize: HEADER_FONT_SIZE
                }
              }}
              columns={[
                { title: 'First Name', field: 'first_name' },
                { title: 'Last Name', field: 'last_name' },
                { title: 'Email', field: 'email' },
                { title: 'Username', field: 'username' },
                { title: 'Designation', field: 'designation' },

                {
                  title: 'Department',
                  field: 'department',
                },
              ]}
              data={this.state.tableData}
              title='Users List'
              actions={[
                {
                  icon: () => <Add />,
                  tooltip: 'Add Access',
                  onClick: (event, rowData) => {

                    let editableItem = Object.assign({}, rowData);
                    editableItem.start_date = editableItem.startDate;
                    editableItem.end_date = editableItem.endDate;
                    editableItem.group = Object.keys(this.state.groupNameIdMap) 
                      .find(key => this.state.groupNameIdMap[key] === editableItem.group_id);
                    delete editableItem['startDate'];
                    delete editableItem['endDate'];
                    delete editableItem['tableData'];
                    this.setState({
                      showAccessForm: true,
                      editableItem: editableItem,
                      patchMode: true
                    })

                  },
                },
                {
                  icon: () => <Edit />,
                  tooltip: 'Edit User',
                  onClick: (event, rowData) => {
                    // Do edit operation
                    let editableItem = Object.assign({}, rowData);
                    editableItem.start_date = editableItem.startDate;
                    editableItem.end_date = editableItem.endDate;
                    editableItem.group = Object.keys(this.state.groupNameIdMap)
                      .find(key => this.state.groupNameIdMap[key] === editableItem.group_id);
                    delete editableItem['startDate'];
                    delete editableItem['endDate'];
                    delete editableItem['tableData'];
                    this.setState({
                      drawerOpen: true,
                      editableItem: editableItem,
                      editMode: true,
                    });
                  },
                },
                {
                  icon: () => <Lock />,
                  tooltip: 'Change Password',
                  onClick: (event, rowData) => {
                    this.setState({
                      changePasswordDialogOpen: true,
                      passwordChangeUsername: rowData.username,
                    });
                  },
                },
                {
                  icon: () => <Delete color='error' />,
                  tooltip: 'Delete User',
                  onClick: (event, rowData) => {
                    // Do Delete operation
                    this.onDeleteButtonPress(rowData);
                  },
                },
              ]}
            />
          </Grid>
        </Grid>
      </div>
    );
  }

  getAccessForm(){
    const { classes } = this.props;

    return (
      <div>
        <Dialog fullScreen open={this.state.showAccessForm} onClose={() => this.resetToDefault()} TransitionComponent={this.Transition}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={() => this.resetToDefault()} aria-label="close">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                {'Access Control'}
              </Typography>

              <Button  
                variant='contained'
                color='primary'
                style={{ position: 'absolute', right: '2rem' }}
                startIcon={<Add />}
                onClick={()=>{
                  this.onCreateOrEditButtonPress();
                }}
              >
                {'Add'}
              </Button>

            </Toolbar>
          </AppBar>
          <div className={classes.drawercontent}>
            <AccessForm data={this.state.editableItem} getData={this.getData} />
           </div>
        </Dialog>
      </div >
    );
  }

  getDrawer() {
    const { classes } = this.props;
    const validationSchema = Yup.object().shape({
      first_name: Yup.string().required('First Name Required'),
      username: Yup.string().required('Username Required'),
      email: Yup.string().email('Invalid Email').required('Email Required'),
      password: Yup.string().required('Password Required'),
      confirm_password: Yup.string()
        .required('Please confirm the entered password')
        .test('passwords-match', 'Passwords must match', function(value) {
          return this.parent.password === value;
        }),
      phone: Yup.string().required('Phone Number Required'),
      designation: Yup.string().required('Select a role'),
      group: Yup.string().required('Select a group'),
      department: Yup.string().required('Select a department')
    });

    const validationSchemaEdit = Yup.object().shape({
      first_name: Yup.string().required('First Name Required'),
      username: Yup.string().required('Username Required'),
      email: Yup.string().email('Invalid Email').required('Email Required'),
      phone: Yup.string().required('Phone Number Required'),
      designation: Yup.string().required('Select a role'),
      group: Yup.string().required('Select a group'),
      department: Yup.string().required('Select a department')
    });


    return (
      <div>
        <Dialog fullScreen open={this.state.drawerOpen} onClose={() => this.resetToDefault()} TransitionComponent={this.Transition}>
        <Formik
          initialValues={this.state.editableItem}
          validationSchema={this.state.editMode? validationSchemaEdit : validationSchema}
          onSubmit={(values, { setSubmitting }) => {
              setSubmitting(false);
              this.onCreateOrEditButtonPress();
          }}
        >
          {({errors, touched, handleChange, submitForm, isSubmitting}) => (
          <Form id='UserForm'>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={() => this.resetToDefault()} aria-label="close">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                {this.state.editMode ? 'Edit User' : 'Add User'}
              </Typography>

              <Button  
                variant='contained'
                color='primary'
                style={{ position: 'absolute', right: '2rem' }}
                startIcon={this.state.editMode ? <Edit /> : <Add />}
                disabled={isSubmitting}
                onClick={submitForm}
              >
                {this.state.editMode ? 'Update' : 'Create'}
              </Button>

            </Toolbar>
          </AppBar>
          <div className={classes.drawercontent}>
           <Field
              component={FormikTextField}
              InputProps={{
                classes: {
                  input: classes.field,
                }
              }}
              InputLabelProps={{classes: {
                input: classes.field,
              }}}
              label='First Name'
              name='first_name'
              fullWidth
              required
              value={this.state.editableItem.first_name}
              onChange={(event) =>{
                event.persist = () => {}
                handleChange(event)
                this.setState({
                  editableItem: {
                    ...this.state.editableItem,
                    first_name: event.target.value,
                  },
                })
              }
              }
            />
            <br />

            <Field
              component={FormikTextField}
              InputProps={{
                classes: {
                  input: classes.field,
                }
              }}
              InputLabelProps={{classes: {
                input: classes.field,
              }}}
              style={{ marginTop: 16 }}
              label='Last Name'
              name='last_name'
              fullWidth
              value={this.state.editableItem.last_name}
              onChange={(event) =>{
                event.persist = () => {}
                handleChange(event)
                this.setState({
                  editableItem: {
                    ...this.state.editableItem,
                    last_name: event.target.value,
                  },
                })
              }
              }
            />
            <br />

            <Field 
              component={FormikTextField}
              InputProps={{
                classes: {
                  input: classes.field,
                }
              }}
              InputLabelProps={{classes: {
                input: classes.field,
              }}}
              style={{ marginTop: 16 }}
              label='Username'
              name='username'
              fullWidth
              required
              value={this.state.editableItem.username}
              onChange={(event) =>{
                event.persist = () => {}
                handleChange(event)
                this.setState({
                  editableItem: {
                    ...this.state.editableItem,
                    username: event.target.value,
                  },
                })
              }  
              }
            />
            <br />

            <Field
              component={FormikTextField}
              InputProps={{
                classes: {
                  input: classes.field,
                }
              }}
              InputLabelProps={{classes: {
                input: classes.field,
              }}}
              style={{ marginTop: 16 }}
              label='Email'
              name='email'
              fullWidth
              required
              value={this.state.editableItem.email}
              onChange={(event) =>{
                event.persist = () => {}
                handleChange(event)
                this.setState({
                  editableItem: {
                    ...this.state.editableItem,
                    email: event.target.value,
                  },
                })
              }
              }
            />
            <br />

            {
              !this.state.editMode &&
              <div>
                <Field
                  component={FormikTextField}
                  style={{ marginTop: 16 }}
                  InputProps={{
                    classes: {
                      input: classes.field,
                    }
                  }}
                  InputLabelProps={{classes: {
                    input: classes.field,
                  }}}
                  label='Password'
                  type='password'
                  name='password'
                  fullWidth
                  required
                  value={this.state.editableItem.password}
                  onChange={(event) =>{
                    event.persist = () => {}
                    handleChange(event)
                    this.setState({
                      editableItem: {
                        ...this.state.editableItem,
                        password: event.target.value,
                      },
                    })
                  }
                }
                />
                <br />
                <Field
                  component={FormikTextField}
                  style={{ marginTop: 16 }}
                  InputProps={{
                    classes: {
                      input: classes.field,
                    }
                  }}
                  InputLabelProps={{classes: {
                    input: classes.field,
                  }}}
                  label='Confirm Password'
                  type='password'
                  name='confirm_password'
                  fullWidth
                  required
                />
                <br />
              </div>
            }

            <Field
              component={FormikTextField}
              style={{ marginTop: 16 }}
              InputProps={{
                classes: {
                  input: classes.field,
                }
              }}
              InputLabelProps={{classes: {
                input: classes.field,
              }}}
              label='Phone'
              name='phone'
              fullWidth
              required
              value={this.state.editableItem.phone}
              onChange={(event) =>{
                event.persist = () => {}
                handleChange(event)
                this.setState({
                  editableItem: {
                    ...this.state.editableItem,
                    phone: event.target.value,
                  },
                })
              }
              }
            />
            <br />

            <FormControl style={{ marginTop: 18, minWidth: '100%' }} error={errors.designation ? true : false} >
              <InputLabel id='designation-label'>Role*</InputLabel>
              <Field
                component={FormikSelect}
                className={classes.field}
                labelId='designation-label'
                name='designation'
                fullWidth
                required
                value={this.state.editableItem.designation}
                onChange={(event) =>{
                  event.persist = () => {}
                  handleChange(event);
                  this.setState({
                    editableItem: {
                      ...this.state.editableItem,
                      designation: event.target.value,
                    },
                  })
                }
                }
              >
                <MenuItem value={'Admin'} className={classes.field}>Admin</MenuItem>
                <MenuItem value={'Supervisor'} className={classes.field}>Supervisor</MenuItem>
                <MenuItem value={'Analyst'} className={classes.field}>Analyst</MenuItem>
              </Field>
              <FormHelperText>{errors.designation? errors.designation : null}</FormHelperText>
            </FormControl>
            <br />
              
            <FormControl style={{ marginTop: 18, minWidth: '100%' }} error={errors.group ? true : false} >
              <InputLabel id='group-label'>Group*</InputLabel>
              <Field
                component={FormikSelect}
                className={classes.field}
                labelId='group-label'
                name='group'
                fullWidth
                required
                value={this.state.editableItem.group}
                onChange={(event) =>{
                  event.persist = () => {}
                  handleChange(event);
                  this.setState({
                    editableItem: {
                      ...this.state.editableItem,
                      group: event.target.value,
                    },
                  })
                }
                }
              >
                 {
                  this.state.groupOptions.map((groupName, index) => <MenuItem key={index} value={groupName} className={classes.field}>{groupName}</MenuItem>)
                }
              </Field>
              <FormHelperText>{errors.group? errors.group : null}</FormHelperText>
            </FormControl>
            <br />

            <FormControl style={{ marginTop: 18, minWidth: '100%' }} error={errors.department? true : false} >
              <InputLabel id='department-label'>Department*</InputLabel>
              <Field
                component={FormikSelect}
                className={classes.field}
                labelId='department-label'
                name='department'
                fullWidth
                required
                value={this.state.editableItem.department}
                onChange={(event) =>{
                  event.persist = () => {}
                  handleChange(event);
                  this.setState({
                    editableItem: {
                      ...this.state.editableItem,
                      department: event.target.value,
                    },
                  })
                }
                }
              >
                {
                  this.state.departmentOptions.map((deptName, index) => <MenuItem key={index} value={deptName} className={classes.field}>{deptName}</MenuItem>)
                }
              </Field>
              <FormHelperText>{errors.department? errors.department : null}</FormHelperText>
            </FormControl>
            <br />

            <FormControl component="fieldset" style={{ marginTop: 24 }}>
              <FormLabel component="legend">System Access</FormLabel>
              <RadioGroup
                name='System Access'
                row
                onChange={event => this.setState({ editableItem: { ...this.state.editableItem, disabled: event.target.value === 'No' } })}
                value={this.state.editableItem.disabled ? 'No' : 'Yes'}
              >
                <FormControlLabel
                  value={'Yes'}
                  control={<Radio />}
                  label='Yes'
                />
                <FormControlLabel
                  value={'No'}
                  control={<Radio />}
                  label='No' />

              </RadioGroup>
            </FormControl>
            <br />

            <MuiPickersUtilsProvider utils={LuxonUtils}>
              <KeyboardDateTimePicker
                style={{ marginTop: 16, minWidth: '100%' }}
                InputProps={{
                  classes: {
                    input: classes.field,
                  }
                }}
                autoOk={true}
                disableToolbar
                variant='inline'
                margin='normal'
                format='dd/MM/yyyy HH:mm'
                ampm={false}
                openTo='year'
                label='Start Date'
                value={new Date(this.state.editableItem.start_date * 1000)}
                onChange={(newDate) =>
                  this.setState({
                    editableItem: { ...this.state.editableItem, start_date: Math.round(newDate / 1000) },
                  })
                }
              />
            </MuiPickersUtilsProvider>
            <br />

            <MuiPickersUtilsProvider utils={LuxonUtils}>
              <KeyboardDateTimePicker
                style={{ marginTop: 16, minWidth: '100%', fontSize: FONT_SIZE }}
                InputProps={{
                  classes: {
                    input: classes.field,
                  }
                }}
                autoOk={true}
                disableToolbar
                variant='inline'
                margin='normal'
                format='dd/MM/yyyy HH:mm'
                ampm={false}
                openTo='year'
                label='End Date'
                value={new Date(this.state.editableItem.end_date * 1000)}
                onChange={(newDate) =>
                  this.setState({
                    editableItem: { ...this.state.editableItem, end_date: Math.round(newDate / 1000) },
                  })
                }
              />
            </MuiPickersUtilsProvider>
            <br />
          </div>
          </Form>
           )}
          </Formik>
        </Dialog>
      </div >
    );
  }
  componentDidMount() {
    this.getDepartmentsList();
    this.getUsersList();
    this.fetchAllCases();
    this.getGroupList();
  }

  componentDidUpdate(){
    if(this.state.alertOpen){
      setTimeout(()=>{
        this.setState({
          alertOpen: false
        })
      }, 6000);
    }
  }

  resetToDefault() {
    this.setState({
      drawerOpen: false,
      showAccessForm: false,
      editMode: false,
      patchMode: false,
      editableItem: {
        first_name: '',
        last_name: '',
        email: '',
        username: '',
        disabled: false,
        password: '',
        designation: '',
        department: '',
        group: '',
        phone: '',
        start_date: Math.round(new Date() / 1000),
        end_date: Math.round(new Date() / 1000),
        modules: defaultModules,
      },
      addCasesDialogOpen: false,
      selectedCasesList: [],
    });
  }

  async getGroupList(){
    try{
      let response = await getGroups();

      let groupOptions = new Set();
      let groupNameIdMap = {};

      response.forEach((group) => {
        groupOptions.add(group['name']);
        groupNameIdMap[group['name']] = group['id'];
      });

      groupOptions = Array.from(groupOptions);
      this.setState({
        groupOptions: groupOptions,
        groupNameIdMap: groupNameIdMap,
      });

    }
    catch(error){
      console.log(error);
    }
  }

  async getDepartmentsList() {
    try {
      let response = await getDepartments();

      let departmentOptions = new Set();
      let departmentNameIdMap = {};

      response.forEach((department) => {
        departmentOptions.add(department['name']);
        departmentNameIdMap[department['name']] = department['id'];
      });

      departmentOptions = Array.from(departmentOptions);
      this.setState({
        departmentOptions: departmentOptions,
        departmentNameIdMap: departmentNameIdMap,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getUsersList() {
    try {
      let response = await getUsers();
      response.forEach((user, index) => {
        response[index]['department'] = user['department']['name'];
        let userCases = [];
        user['cases'].forEach((caseItem) => {
          userCases.push(caseItem['name']);
        });
        response[index]['cases'] = userCases;
      });
      this.setState({
        tableData: response,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async onCreateOrEditButtonPress() {
    try {
      let payload = this.state.editableItem;
      let departmentId = this.state.departmentNameIdMap[payload.department];
      let groupId = this.state.groupNameIdMap[payload.group];
      let message = 'User Added Successfully';

      payload.department = departmentId;
      payload.group = groupId;
      
      let response;

      if (this.state.editMode) {
        response = await editAccount(payload.id, payload);
        message='User Data Updated';
      }else if(this.state.patchMode){
        response = await editAccount(payload.id, payload);
        message='User Access Added';
      }else {
        response = await createAccount(payload);
      }
      this.setState({
        alertType: 'success',
        alertTitle: 'Users',
        alertMessage: message,
        alertOpen: true,
      });
      this.resetToDefault();
      this.componentDidMount();
    } catch (error) {
      this.setState({
        alertType: 'error',
        alertTitle: 'Error',
        alertMessage: error.toString(),
        alertOpen: true,
      });
      console.log(error);
    }
  }

  async onDeleteButtonPress(rowData) {
    try {
      
      let response = await deleteAccount(rowData.id);
      this.resetToDefault();
      this.setState({
        alertType: 'success',
        alertTitle: 'User Deleted Successfully',
        alertMessage: '',
        alertOpen: true,
      });
      this.componentDidMount();
    } catch (error) {
      this.setState({
        alertType: 'error',
        alertTitle: 'Error',
        alertMessage: error.toString(),
        alertOpen: true,
      });
      console.log(error);
    }
  }

  async fetchAllCases() {
    try {
      let response = await getAllCases();
      response = response.filter((caseItem, index) => caseItem['name'] !== DEFAULT_CASE_CHECK_OT);
      this.setState({ cases: response });
    } catch (error) {
      console.log(error);
    }
  }
}

export default withStyles(styles)(Users);
