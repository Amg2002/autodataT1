/* eslint-disable no-unused-vars */
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  FormHelperText,
  Typography,
  withStyles,
  Paper,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
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
  Remove,
  SaveAlt,
  Search,
  ViewColumn,
} from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';
import MaterialTable from 'material-table';
import React, { forwardRef } from 'react';
import { drawerWidth, FONT_SIZE, HEADER_FONT_SIZE } from '../../../config';
import AlertCard from '../../../components/alert-card/alert-card.component';
import { Formik, Form, Field } from 'formik';
import {TextField as FormikTextField, Select as FormikSelect} from 'formik-material-ui';
import * as Yup from 'yup';
import { getDepartments, createDepartment, editDepartment, deleteDepartment, getUsers } from '../../../util/network';

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
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  appBar: {
    position: 'relative',
    backgroundColor: '#18202c'
  },
  field:{
    fontSize: FONT_SIZE
  }
});

class Departments extends React.Component {
  constructor(props) {
    super(props);
    this.getDrawer = this.getDrawer.bind(this);
    this.getAllAccounts = this.getAllAccounts.bind(this);
    this.getDepartmentsList = this.getDepartmentsList.bind(this);
    this.onCreateOrEditButtonPress = this.onCreateOrEditButtonPress.bind(this);
    this.onDeleteButtonPress = this.onDeleteButtonPress.bind(this);
    this.resetToDefault = this.resetToDefault.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  state = {
    currentAccount: this.props.currentAccount,
    drawerOpen: false,
    editMode: false,
    editableItem: {
      name: '',
      zone: '',
      head: '',
      city: '',
      lga: '',
      state: ''
    },
    tableData: [],
    departmentHeadOptions: [],
    departmentZoneOptions: [],
    alertType: '',
    alertTitle: '',
    alertMessage: '',
    alertOpen: false
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
        {this.getDrawer()}
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
                      department: -1,
                      phone: '',
                      start_date: Math.round(new Date() / 1000),
                      end_date: Math.round(new Date() / 1000),
                    },
                    drawerOpen: true,
                    editMode: false,
                  })
                }
              >
                Create Department
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
                search: true,
                rowStyle:{
                  fontSize: FONT_SIZE
                },
                headerStyle:{
                  fontSize: HEADER_FONT_SIZE
                }
              }}
              columns={[
                { title: 'Name', field: 'name' },
                { title: 'Head', field: 'head' },
                { title: 'City', field: 'city' },
                { title: 'LGA', field: 'lga' },
                { title: 'State', field: 'state' },
              ]}
              data={this.state.tableData}
              title='Departments List'
              actions={[
                {
                  icon: () => <Edit />,
                  tooltip: 'Edit Department',
                  onClick: (event, rowData) => {
                    // Do edit operation
                    this.setState({
                      drawerOpen: true,
                      editableItem: rowData,
                      editMode: true,
                    });
                  },
                },
                {
                  icon: () => <Delete color='error' />,
                  tooltip: 'Delete Department',
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
  onClose(){
    this.setState({
      alertOpen: false
    })
  }
  getDrawer() {
    const { classes } = this.props;
    const validationSchema = Yup.object().shape({
      name: Yup.string()
        .required('Required'),
      head: Yup.string()
        .required('Required'),
      city: Yup.string()
        .required('Required'),
      state: Yup.string()
        .required('Required'),
      lga: Yup.string()
      .required('Required'),
      
    });

    return (
      <div>
        <Dialog fullScreen open={this.state.drawerOpen} TransitionComponent={this.Transition}
          onClose={() => this.resetToDefault()}
        >
        <Formik
          initialValues={this.state.editableItem}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
              setSubmitting(false);
              this.onCreateOrEditButtonPress();
          }}
        >
          {({errors, touched, handleChange, submitForm, isSubmitting}) => (
          <Form id='DepartmentForm'>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={() => this.resetToDefault()} aria-label="close">
                <CloseIcon />
              </IconButton>
              <Typography variant="h2" className={classes.title}>
                {this.state.editMode ? 'Edit Department' : 'Add Department'}
              </Typography>
              <Button
                variant="contained"
                color="primary"
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
              InputProps={{
                classes: {
                  input: classes.field,
                }
              }}
              InputLabelProps={{classes: {
                input: classes.field,
              }}}
              component={FormikTextField}
              name='name'
              label='Name'
              fullWidth
              required
              value={this.state.editableItem.name}
              onChange={(event) =>{
                event.persist = () => {}
                handleChange(event)
                this.setState({
                  editableItem: {
                    ...this.state.editableItem,
                    name: event.target.value,
                  },
                })
              }
              }
            />
            <br />
            <FormControl style={{ marginTop: 16, minWidth: '100%' }}  error={errors.head? true : false} >
              <InputLabel id='head-label'>Department Head*</InputLabel>
              <Field
                component={FormikSelect}
                className={classes.field}
                labelId='head-label'
                name='head'
                value={this.state.editableItem.head}
                onChange={(event) => {
                  event.persist = () => {}
                  handleChange(event);
                  this.setState({
                    editableItem: {
                      ...this.state.editableItem,
                      head: event.target.value,
                    }
                  })

                }
                }
              >
                {this.state.departmentHeadOptions.map((name) => (
                  <MenuItem key={name} value={name} className={classes.field}>
                    {name}
                  </MenuItem>
                ))}
              </Field>
              <FormHelperText>{errors.head? errors.head : null}</FormHelperText>
            </FormControl>
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
              label='City'
              name='city'
              fullWidth
              required
              value={this.state.editableItem.city}
              style={{ marginTop: 16 }}
              onChange={(event) =>{
                event.persist = () => {}
                handleChange(event);
                this.setState({
                  editableItem: {
                    ...this.state.editableItem,
                    city: event.target.value,
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
              label='LGA'
              name='lga'
              fullWidth
              required
              style={{ marginTop: 16 }}
              value={this.state.editableItem.lga}
              onChange={(event) =>{
                event.persist = () => {}
                handleChange(event);
                this.setState({
                  editableItem: {
                    ...this.state.editableItem,
                    lga: event.target.value,
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
              name='state'
              label='State'
              fullWidth
              required
              style={{ marginTop: 16 }}
              value={this.state.editableItem.state}
              onChange={(event) =>{
                event.persist = () => {}
                handleChange(event);
                this.setState({
                  editableItem: {
                    ...this.state.editableItem,
                    state: event.target.value,
                  },
                })
              }
              }
            />
          </div>
           </Form>
           )}
          </Formik>
        </Dialog>

      </div>
    );
  }

  async componentDidMount() {
    await this.getAllAccounts();
    await this.getDepartmentsList();
  }

  async getDepartmentsList() {
    try {
      let response = await getDepartments();
      let departmentZoneOptions = new Set();

      response.forEach((department) => {
        let departmentName = department['zone'];
        departmentZoneOptions.add(departmentName);
      });

      departmentZoneOptions = Array.from(departmentZoneOptions);

      this.setState({
        tableData: response,
        departmentZoneOptions: departmentZoneOptions,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getAllAccounts() {
    try {
      let response = await getUsers();

      let departmentHeadOptions = new Set();

      response.forEach((account) => {
        let accountName = account['first_name'] + ' ' + account['last_name'];
        departmentHeadOptions.add(accountName);
      });

      departmentHeadOptions = Array.from(departmentHeadOptions);

      this.setState({
        departmentHeadOptions: departmentHeadOptions,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async onCreateOrEditButtonPress() {
    try {
      let payload = this.state.editableItem;
      payload.zone = "Zone A";
      let message;

      if (this.state.editMode) {
        let response = await editDepartment(payload.id, payload);
        message='Department Updated Successfully';
      } else {
        let response = await createDepartment(payload);
        message='Department Added Successfully';
      }
      this.setState({
        drawerOpen: false,
        editMode: false,
        editableItem: {
          name: '',
          zone: '',
          head: '',
        },
        alertType: 'success',
        alertTitle: 'Department',
        alertMessage: message,
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

  async onDeleteButtonPress(rowData) {
    try {
      let response = await deleteDepartment(rowData.id);
      this.setState({
        alertType: 'success',
        alertTitle: 'Department',
        alertMessage: 'Department Deleted Successfully',
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

  resetToDefault() {
    this.setState({
      drawerOpen: false,
      editMode: false,
      editableItem: {
        name: '',
        zone: '',
        head: '',
        city: '',
        lga: '',
        state: '',
      },
    })
  }
}

export default withStyles(styles)(Departments);
