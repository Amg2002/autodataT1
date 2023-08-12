/* eslint-disable no-unused-vars */
/* eslint-disable react/no-direct-mutation-state */
import {
    Button,
    Dialog,
    AppBar,
    Toolbar,
    IconButton,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper, Select,
    TextField,
    Typography,
    Slide,
    withStyles
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
    ViewColumn
} from '@material-ui/icons';
import RefreshIcon from '@material-ui/icons/Refresh';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import moment from 'moment';
import MaterialTable from "material-table";
import LuxonUtils from '@date-io/luxon';
import {
    MuiPickersUtilsProvider,
    KeyboardDateTimePicker
} from '@material-ui/pickers';
import React, { forwardRef } from 'react';
// Local
import { drawerWidth, DEFAULT_CASE_CHECK_OT, FONT_SIZE, HEADER_FONT_SIZE } from '../../../config';
import MapContainer from '../../CaseOT/Map.js'
import { addJob, deleteJob, editJob, getJobs, getUsers, getAllCases } from '../../../util/network';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};


const styles = (theme) => ({
    root:{
        fontSize: FONT_SIZE
    },
    chip: {
        margin: theme.spacing(0.5),
        fontSize: FONT_SIZE
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: '100%',
        height:'100%',
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

class Jobs extends React.Component {
    constructor(props) {
        super(props);
        this.getDrawer = this.getDrawer.bind(this);
        this.getJobsTableComponent = this.getJobsTableComponent.bind(this);
        this.getDefaultCase = this.getDefaultCase.bind(this);
        this.resetToDefault = this.resetToDefault.bind(this);
        this.onClickEdit = this.onClickEdit.bind(this);
        this.getAllAccounts = this.getAllAccounts.bind(this);
        this.fetchJobsForCase = this.fetchJobsForCase.bind(this);
        this.onCreateJobButtonPress = this.onCreateJobButtonPress.bind(this);
        this.onDeleteButtonPress = this.onDeleteButtonPress.bind(this);
    }

    state = {
        mapKey: 1,
        currentAccount: this.props.currentAccount,
        editMode: false,
        drawerOpen: false,
        selectedCase: null,
        accountIdNameLookupMap: {},
        selectedCaseJobsList: [],
        newJob: {
            id: -1,
            case: -1,
            category: 'IMSI',
            status: '',
            latitude: -1,
            longitude: -1,
            distance: -1,
            lac: -1,
            cellId: -1,
            startTime: new Date().setDate((new Date()).getDate() - 7).valueOf(),
            endTime: new Date().valueOf(),
            query: '',    
        },
        markers: [
                  {
                    name: "Current position",
                    position: {
                      lat: 9.58817943397567,
                      lng: 8.016038970947266
                    }
                  },
                ],
        mapPosition:{
                lat: 9.58817943397567,
                lng: 8.016038970947266
        }
    }

    onPlaceSelected = (place) => {
        let lat = place.geometry.location.lat(),
        lng = place.geometry.location.lng();

        this.setState(prevState => {
                const markers = [...this.state.markers];
                this.state.mapPosition.lat = lat;
                this.state.mapPosition.lng = lng;
                let index = markers.length-1;
                markers[index] = { ...markers[index], position: { lat, lng } };
                return { markers };
                }
        );

    }

    onMarkerDragEnd = (coord, index) => {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();

    this.setState(prevState => {
      const markers = [...this.state.markers];
      markers[index] = { ...markers[index], position: { lat, lng } };
      return { markers };
    });

    this.setState({
        newJob: { 
            ...this.state.newJob, 
            latitude: lat,
            longitude: lng 
        }
    })
  };


    onClickEdit( rowData ){
        let query = rowData.query;
        let latitude = rowData.category === 'Location' ? query.split(',')[0] : -1,
        longitude = rowData.category === 'Location' ? query.split(',')[1] : -1,
        distance = rowData.category === 'Location' ? query.split(',')[2] : -1; 
        console.log(rowData)
        
        this.setState({
            editMode: true,
            mapKey: this.state.mapKey+1,
            mapPosition: {
                lat: latitude,
                lng: longitude
            },
            newJob: {
                id: rowData.id,
                case: rowData.case,
                name: rowData.name,
                category: rowData.category,
                status: rowData.status,
                latitude: latitude,
                longitude: longitude,
                distance: distance,
                lac: -1,
                cellId: -1,
                startTime: rowData.startTime,
                endTime: rowData.endTime,
                query: rowData.query,    
            },
        }, () => {
            this.setState({
                drawerOpen: !this.state.drawerOpen
            })
        })
    }

    render() {
        console.log(this.state)
        return (
            <div style={{ paddingBottom: 32 }}>
                {this.state.selectedCase && this.getDrawer()}
                   { this.state.selectedCase ?
                        <Grid container>
                                <Grid style={{width:'96%'}}>
                                     {(this.state.currentAccount.modules.checkot.add || this.state.currentAccount.designation === 'Admin' ) ? (
                                     <div style={{display:'flex', justifyContent:'flex-end',marginTop:8}}>
                                      <Button variant="contained" color="primary" style={{backgroundColor: '#18202c',}}
                                       onClick={
                                         () => this.setState({
                                                drawerOpen: true,
                                            })}
                                      >
                                        Add Job
                                      </Button>
                                    </div>
                                     ) : null }
                                    {this.getJobsTableComponent()}
                                </Grid>
                        </Grid>
   
                        : <div/>
                    }

            </div>
        );
    }

Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

    getDrawer() {
        const {
            classes
        } = this.props;

        return (
            <Dialog 
                fullScreen 
                open={this.state.drawerOpen} 
                onClose={()=>this.resetToDefault()} 
                TransitionComponent={this.Transition}
                style={{zIndex: 12}}
            >
                <AppBar className={classes.appBar}>
                  <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={()=>this.resetToDefault()} aria-label="close">
                      <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                      {this.state.editMode? 'Edit Job' : 'Add Job'}
                    </Typography>
                     <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={this.onCreateJobButtonPress}
                    >
                        {this.state.editMode? 'Edit' : 'Create'}
                    </Button>
                  </Toolbar>
                </AppBar>
                <div className={classes.drawercontent}>
                     <FormControl style={{ marginTop: 32,minWidth: '100%' }}>
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select
                            labelId="category-label"
                            className={classes.field}
                            fullWidth
                            value={this.state.newJob.category}
                            onChange={event => {
                                if(event.target.value === 'Location'){
                                    this.setState({
                                        newJob:{
                                            ...this.state.newJob,
                                            category: event.target.value,
                                            latitude: this.state.markers[0].position.lat,
                                            longitude: this.state.markers[0].position.lng,
                                        }
                                    })
                                }else{
                                    this.setState({ newJob: { 
                                        ...this.state.newJob, 
                                        category: event.target.value, 
                                        latitude: -1,
                                        longitude: -1, } 
                                    })
                                }
                            }}
                        >
                            <MenuItem value={'IMSI'} className={classes.field}>IMSI</MenuItem>
                            <MenuItem value={'IMEI'} className={classes.field}>IMEI</MenuItem>
                            <MenuItem value={'MSISDN'} className={classes.field}>MSISDN</MenuItem>
                            <MenuItem value={'Location'} className={classes.field}>Location</MenuItem>
                            <MenuItem value={'LAC/Cell-ID'} className={classes.field} >LAC/Cell-ID</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        required
                        InputProps={{
                            classes: {
                                input: classes.field,
                            }
                        }}
                        InputLabelProps={{
                            classes: {
                                input: classes.field,
                            },
                            shrink: true
                        }}
                        style={{ marginTop: 32, minWidth: '100%' }}
                        label="Name"
                        value={this.state.newJob.name}
                        onChange={event => this.setState({ newJob: { ...this.state.newJob, name: event.target.value } })}
                        
                    />
                    <MuiPickersUtilsProvider utils={LuxonUtils}>
                        <KeyboardDateTimePicker
                            style={{ marginTop: 32,minWidth: '100%' }}
                            InputProps={{
                                classes: {
                                  input: classes.field,
                                }
                            }}
                            InputLabelProps={{classes: {
                                input: classes.field,
                            }}}
                            disableToolbar
                            autoOk={true}
                            variant="inline"
                            margin="normal"
                            format="dd/MM/yyyy HH:mm"
                            ampm={false}
                            openTo="year"
                            label="Target Start Date"
                            value={new Date(this.state.newJob.startTime)}
                            onChange={newDate => {
                                const dateTimeData = newDate.c
                                const startDate = new Date(dateTimeData.year, dateTimeData.month - 1, dateTimeData.day, dateTimeData.hour, dateTimeData.minute, dateTimeData.second)
                                this.setState({ newJob: { ...this.state.newJob, startTime: startDate.valueOf() } })

                            }}
                        />
                    </MuiPickersUtilsProvider>

                    <MuiPickersUtilsProvider utils={LuxonUtils}>
                        <KeyboardDateTimePicker
                            style={{ marginTop: 32,minWidth: '100%' }}
                            InputProps={{
                                classes: {
                                  input: classes.field,
                                }
                            }}
                            InputLabelProps={{classes: {
                                input: classes.field,
                            }}}
                            disableToolbar
                            autoOk={true}
                            variant="inline"
                            margin="normal"
                            openTo="year"
                            format="dd/MM/yyyy HH:mm"
                            ampm={false}
                            label="Target End Date"
                            value={new Date(this.state.newJob.endTime)}
                            onChange={newDate => {
                                const dateTimeData = newDate.c
                                const endDate = new Date(dateTimeData.year, dateTimeData.month - 1, dateTimeData.day, dateTimeData.hour, dateTimeData.minute, dateTimeData.second)
                                this.setState({ newJob: { ...this.state.newJob, endTime: endDate.valueOf() } })
                    
                                }}
                        />
                    </MuiPickersUtilsProvider>


                    {
                        this.state.newJob.category === 'Location' &&
                        <TextField
                            style={{ marginTop: 32 ,minWidth: '100%'}}
                            InputProps={{
                                classes: {
                                  input: classes.field,
                                }
                            }}
                            InputLabelProps={{
                                classes: {
                                    input: classes.field,
                                },
                                shrink: true
                            }}
                            label="Target Location (Latitude)"
                            type="number"
                            defaultValue={ this.state.newJob.latitude === -1? this.state.markers[0].position.lat : this.state.newJob.latitude}
                            value={ this.state.newJob.latitude === -1? this.state.markers[0].position.lat : this.state.newJob.latitude}
                            onChange={event => this.setState({ newJob: { ...this.state.newJob, latitude: event.target.value }
                            })}
                        />

                    }

                    {
                        this.state.newJob.category === 'Location' &&
                        <TextField
                            style={{ marginTop: 32,minWidth: '100%' }}
                            InputProps={{
                                classes: {
                                  input: classes.field,
                                }
                            }}
                            InputLabelProps={{
                                classes: {
                                    input: classes.field,
                                },
                                shrink: true
                            }}
                            label="Target Location (Longitude)"
                            type="number"
                            defaultValue={ this.state.newJob.longitude === -1? this.state.markers[0].position.lng : this.state.newJob.longitude}
                            value={ this.state.newJob.longitude === -1? this.state.markers[0].position.lng : this.state.newJob.longitude}
                            onChange={event => this.setState({ newJob: { ...this.state.newJob, longitude: event.target.value } })}
                        
                        />
                    }

                    {
                        this.state.newJob.category === 'LAC/Cell-ID' &&
                        <TextField
                            style={{ marginTop: 32 ,minWidth: '100%'}}
                            InputProps={{
                                classes: {
                                  input: classes.field,
                                }
                            }}
                            InputLabelProps={{
                                classes: {
                                    input: classes.field,
                                },
                                shrink: true
                            }}
                            label="Target LAC"
                            type="number"
                            value={this.state.newJob.lac === -1 ? '' : this.state.newJob.lac}
                            onChange={event => this.setState({ newJob: { ...this.state.newJob, lac: event.target.value } })}
                            
                        />
                    }

                    {
                        this.state.newJob.category === 'LAC/Cell-ID' &&
                        <TextField
                            style={{ marginTop: 32,minWidth: '100%' }}
                            InputProps={{
                                classes: {
                                  input: classes.field,
                                }
                            }}
                            InputLabelProps={{
                                classes: {
                                    input: classes.field,
                                },
                                shrink: true
                            }}
                            label="Target Cell-ID"
                            type="number"
                            value={this.state.newJob.cellId === -1 ? '' : this.state.newJob.cellId}
                            onChange={event => this.setState({ newJob: { ...this.state.newJob, cellId: event.target.value } })}
                            
                        />
                    }

                    {
                        (this.state.newJob.category === 'Location' || this.state.newJob.category === 'LAC/Cell-ID') &&
                        <div>
                        <TextField
                            style={{ marginTop: 32,minWidth: '100%',marginBottom:12 }}
                            InputProps={{
                                classes: {
                                  input: classes.field,
                                }
                            }}
                            InputLabelProps={{
                                classes: {
                                    input: classes.field,
                                },
                                shrink: true
                            }}
                            label="Target Distance(in mts)"
                            type="number"
                            value={this.state.newJob.distance === -1 ? '' : this.state.newJob.distance}
                            onChange={event => this.setState({ newJob: { ...this.state.newJob, distance: event.target.value } })}
                            
                        />
                            
                        </div>
                    }

                    {
                        (this.state.newJob.category === 'IMSI' || this.state.newJob.category === 'IMEI' || this.state.newJob.category === 'MSISDN') &&
                        <TextField
                            style={{ marginTop: 32,minWidth: '100%' }}
                            InputProps={{
                                classes: {
                                  input: classes.field,
                                }
                            }}
                            InputLabelProps={{
                                classes: {
                                    input: classes.field,
                                },
                                shrink: true
                            }}
                            label="Target"
                            value={this.state.newJob.query}
                            onChange={event => this.setState({ newJob: { ...this.state.newJob, query: event.target.value } })}
                            
                        />

                    }

                    {
                        (this.state.newJob.category === 'Location') &&
                        <MapContainer
                            key={this.state.mapKey}
                            width={'97%'}
                            mapPosition={this.state.mapPosition}
                            markers={this.state.markers} 
                            onMarkerDragEnd={this.onMarkerDragEnd} 
                            onPlaceSelected={this.onPlaceSelected}
                        />
                    }
                          
               </div>
              </Dialog>
        );
    }

    getJobsTableComponent() {

        return (
            <MaterialTable
                icons={tableIcons}
                style={{ marginTop: 16, marginLeft:'3.8rem' }}
                components={{
                    Container: props => <Paper {...props} elevation={4} />
                }}
                options={{
                    grouping: false,
                    exportButton: this.state.currentAccount.modules.export || this.state.currentAccount.designation === 'Admin',
                    paging: true,
                    pageSize: 10,
                    actionsColumnIndex: -1,
                    rowStyle: {
                        fontSize: FONT_SIZE
                    },
                    headerStyle:{
                        fontSize: HEADER_FONT_SIZE,
                    }

                }}
                columns={[
                    { 
                        title:"Sr No", 
                        field: 'tableData.id' ,
                        render:rowData => { return( <span>{rowData.tableData.id+1}</span> ) }
                    },
                    { title: "ID", field: "id", type: "numeric", align: "left", width: 16 },
                    { title: "Name", field: "name" },
                    { title: "Category", field: "category" },
                    {
                        title: "Target",
                        field: "query",
                        render: rowData => {
                            let jobCategory = rowData['category'];
                            let resultantHtmlElement = null;
                            if (jobCategory === 'Location') {
                                let queryArr = rowData['query'].split(',');
                                resultantHtmlElement = <span>
                                    <b>Latitude: </b>{queryArr[0]}<br />
                                    <b>Longitude: </b>{queryArr[1]}<br />
                                    <b>Distance: </b>{queryArr[2]}<br />
                                </span>;
                            }
                            else if (jobCategory === 'LAC/Cell-ID') {
                                let queryArr = rowData['query'].split(',');
                                resultantHtmlElement = <span>
                                    <b>LAC: </b>{queryArr[0]}<br />
                                    <b>Cell-ID: </b>{queryArr[1]}<br />
                                    <b>Distance: </b>{queryArr[2]}<br />
                                </span>;
                            }
                            else resultantHtmlElement = rowData['query'];
                            return resultantHtmlElement;
                        }
                    },
                    {
                        title: "Status",
                        field: "status",
                        render: rowData =>
                            <span style={{ color: rowData.status === 'PENDING' ? 'red' : 'green' }}>
                                {rowData.status}
                            </span>
                    },
                    {
                        title: "Start Date",
                        field: "startTime",
                        align: "center",
                        render: rowData => moment.unix(rowData['startTime']/1000).format("DD/MM/YYYY"),
                    },
                    {
                        title: "Start Time",
                        field: "startTime",
                        align: "center",
                        render: rowData => moment(rowData['startTime']).format('HH:mm:ss'),
                    },
                    {
                        title: "End Date",
                        field: "endTime",
                        align: "center",
                        render: rowData => moment.unix(rowData['endTime']/1000).format("DD/MM/YYYY"),
                    },
                    {
                        title: "End Time",
                        field: "endTime",
                        align: "center",
                        render: rowData => moment.unix(rowData['endTime']/1000).format("HH:mm"),
                    },
                    { 
                        title: "Created On(Date)", 
                        field: "createdAt" ,
                        align: "center",
                        render: rowData => moment(rowData['createdAt']).format("DD/MM/YYYY"),
                    },
                    { 
                        title: "Created On(Time)", 
                        field: "createdAt" ,
                        align: "center",
                        render: rowData => moment(rowData['createdAt']).format("HH:mm"),
                    },
                ]}
                data={this.state.selectedCaseJobsList}
                title='Jobs List'
                actions={
                    (this.state.currentAccount.modules.checkot.edit || this.state.currentAccount.designation === 'Admin') ?
                    [
                    {
                        icon: () => <EditIcon color='primary'/>,
                        tooltip: 'Edit Job',
                        onClick: (event, rowData) => {
                            this.onClickEdit(rowData);       
                        },
                    },
                    {
                        icon: () => <Delete color='error' />,
                        tooltip: 'Delete Job',
                        onClick: (event, rowData) => {
                            // Do Delete operation
                            this.onDeleteButtonPress(rowData);
                        },
                    },
                    {
                        icon: () => <RefreshIcon color='primary' />,
                        tooltip: 'Refresh Table',
                        isFreeAction: true,
                        onClick: (event) => this.fetchJobsForCase(this.state.selectedCase)
                    }
                ] : [] }
            />
        );
    }

    componentDidMount() {
        this.getAllAccounts();
        this.getDefaultCase();
    }

    resetToDefault() {
        this.setState({
            drawerOpen: false,
            editMode: false,
            newJob: {
                id: -1,
                name:null,
                case: -1,
                category: 'IMSI',
                status: '',
                latitude: -1,
                longitude: -1,
                distance: -1,
                lac: -1,
                cellId: -1,
                startTime: new Date().setDate((new Date()).getDate() - 7).valueOf(),
                endTime: new Date().valueOf(),
                query: '',
            },
            mapPosition: {
                lat: 9.58817943397567,
                lng: 8.016038970947266
            },
            markers: [
                  {
                    name: "Current position",
                    position: {
                      lat: 9.58817943397567,
                      lng: 8.016038970947266
                    }
                  },
                ],
        });
    }


    async getAllAccounts() {
        try {
            let response = await getUsers();
            let accountIdNameLookupMap = {};

            response.forEach(account => {
                let accountId = account['id'];
                let accountName = account['first_name'] + ' ' + account['last_name'];
                accountIdNameLookupMap[accountId] = accountName;
            });


            this.setState({
                accountIdNameLookupMap: accountIdNameLookupMap,
            });
        } catch (error) {
            console.log(error);
        }
    }


    async getDefaultCase() {
        try {
            let response = await getAllCases();
            response.every((caseItem, index) => {
                let caseName = caseItem['name'];
                if (caseName === DEFAULT_CASE_CHECK_OT) {
                    this.setState({ selectedCase: caseItem });
                    this.fetchJobsForCase(caseItem);
                    return false;
                }
                return true;
            });
        } catch (error) {
            console.log(error);
        }
    }

    async fetchJobsForCase(selectedCase) {
        try {
            this.setState({ selectedCase: selectedCase });
            let response = await getJobs(selectedCase.id);
            response.sort(function(a, b){return b.id - a.id});
            this.setState({ selectedCaseJobsList: response });
        } catch (error) {
            console.log(error);
        }
    }

    async onCreateJobButtonPress() {
        try {
            let payload = this.state.newJob;

            if (payload.category === 'Location') {
                payload['query'] = payload['latitude']+ ',' + payload['longitude'] + ',' + payload['distance'];
                delete payload['latitude'];
                delete payload['longitude'];
                delete payload['distance'];
            }
            else if (payload.category === 'LAC/Cell-ID') {
                payload['query'] = payload['lac'] + ',' + payload['cellId'] + ',' + payload['distance'];
                delete payload['lac'];
                delete payload['cellId'];
                delete payload['distance'];
            }
            payload['status'] = 'PENDING';
            // eslint-disable-next-line
            payload['startTime'] = payload['startTime'];
            // eslint-disable-next-line
            payload['endTime'] = payload['endTime'];
            payload['case'] = this.state.selectedCase['id'];
            console.log(payload)
            if(this.state.editMode){
                let response = await editJob(payload.id, payload);
            }else{
                let response = await addJob(payload);
            }
            this.resetToDefault();
            this.fetchJobsForCase(this.state.selectedCase);
        } catch (error) {
            console.log(error);
        }
    }

    async onDeleteButtonPress(rowData) {
        try {
            let response = await deleteJob(rowData.id);
            this.resetToDefault();
            this.fetchJobsForCase(this.state.selectedCase);
        } catch (error) {
            console.log(error);
        }
    }
};

export default withStyles(styles)(Jobs);
