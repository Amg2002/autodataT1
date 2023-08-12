/* eslint-disable no-unused-vars */
/* eslint-disable react/no-direct-mutation-state */
import {
    Button, Card,
    CardContent, Chip,
    FormControl,
    AppBar,
    Toolbar,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper, Select,
    TextField,
    Typography,
    Dialog,
    DialogContent,
    withStyles,
    Slide
} from '@material-ui/core';
import {
    Add,
    AddBox,
    Close,
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
import EditIcon from '@material-ui/icons/Edit';
import { Autocomplete } from '@material-ui/lab';
import MaterialTable from "material-table";
import LuxonUtils from '@date-io/luxon';
import {
    MuiPickersUtilsProvider,
    KeyboardDateTimePicker
} from '@material-ui/pickers';
import moment from 'moment';
import React, { forwardRef } from 'react';
// Local
import { drawerWidth, DEFAULT_CASE_CHECK_OT, FONT_SIZE, HEADER_FONT_SIZE } from '../../../config';
import AlertCard from '../../../components/alert-card/alert-card.component';
import MapContainer from '../../CaseOT/Map.js'
import { addJob, getAllCases, getJobs, editJob, deleteJob, getUsers } from '../../../util/network';

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
        padding: 16,
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


class CaseIntel extends React.Component {
    constructor(props) {
        super(props);
        this.getDrawer = this.getDrawer.bind(this);
        this.getCaseSelectionComponent = this.getCaseSelectionComponent.bind(this);
        this.getCaseMetadataComponent = this.getCaseMetadataComponent.bind(this);
        this.getJobsTableComponent = this.getJobsTableComponent.bind(this);
        this.fetchAllCases = this.fetchAllCases.bind(this);
        this.resetToDefault = this.resetToDefault.bind(this);
        this.getAllAccounts = this.getAllAccounts.bind(this);
        this.fetchJobsForCase = this.fetchJobsForCase.bind(this);
        this.onCreateJobButtonPress = this.onCreateJobButtonPress.bind(this);
        this.onDeleteButtonPress = this.onDeleteButtonPress.bind(this);
        this.onMarkerDragEnd = this.onMarkerDragEnd.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    state = {
        currentAccount: this.props.currentAccount,
        mapKey: 1,
        editMode: false,
        drawerOpen: false,
        selectedCase: null,
        accountIdNameLookupMap: {},
        cases: [],
        selectedCaseJobsList: [],
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
        alertOpen: false,
        alertType: '',
        alertTitle: '',
        alertMessage: '',
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
            newJob:{
                ...this.state.newJob,
                latitude: lat,
                longitude: lng,
            }
        })
    };

    onClose(){
        this.setState({
            alertOpen: false
        });
    }

    onClickEdit( rowData ){
        let query = rowData.query;
        let latitude = rowData.category === 'Location' ? query.split(',')[0] : -1,
        longitude = rowData.category === 'Location' ? query.split(',')[1] : -1,
        distance = rowData.category === 'Location' ? query.split(',')[2] : -1; 
        
        let queryString = rowData.category === 'IMSI' ? 'IMSI:'+query : 
            rowData.category === 'MSISDN' ? 'MSIS:'+query:
            rowData.category === 'IMEI' ? 'IMEI:'+query:
            query;

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
                startTime: rowData.startTime ,
                endTime: rowData.endTime,
                query: queryString,    
            },
        }, () => {
            this.setState({
                drawerOpen: !this.state.drawerOpen
            })
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
                {this.state.selectedCase && this.getDrawer()}

                {this.getCaseSelectionComponent()}
                
                {
                    this.state.selectedCase ?
                        <Grid container>
                            <Grid item style={{
                                textAlign: 'center',
                                width: '4%',
                                minHeight: window.innerHeight,
                                backgroundColor: '#18202c',
                                marginRight: '3%',
                                cursor: 'pointer'
                            }}
                                onClick={
                                    () => this.setState({
                                        drawerOpen: true,
                                        editMode: false,
                                    })}
                            >
                                <span
                                    style={{ fontSize: 21, color: 'white', }}

                                >
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                            A<br />
                            D<br />
                            D<br />
                            <br />
                            J<br />
                            O<br />
                            B<br />
                                </span>
                            </Grid>
                            <Grid item md={11}>
                                {this.getCaseMetadataComponent()}

                                {this.getJobsTableComponent()}
                            </Grid>
                        </Grid>
                        : <div />
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
                aria-labelledby='customized-dialog-title'
                //classes={{ paper: classes.drawerPaper}}
                open={this.state.drawerOpen}
                onClose={
                    () => this.resetToDefault()
                }
                TransitionComponent={this.Transition}
                style={{zIndex: 12}}
            >
                <form onSubmit={(event) => {
                    event.preventDefault();
                    this.onCreateJobButtonPress();
                }}>
                <AppBar className={classes.appBar} >
                    <Toolbar>
                        <IconButton
                            aria-label='close'
                            className={classes.closeButton}
                            onClick={this.resetToDefault}
                            color='inherit'
                        >
                            <Close />
                        </IconButton>
                        <Typography
                            variant='h2'
                            color='inherit'
                            className={classes.title}
                        >
                            {this.state.editMode? 'Edit Job' : 'Create Job'}
                        </Typography>
                        <Button
                            type='submit'
                            variant="contained"
                            color="primary"
                            //style={{ marginTop: 16 }}
                            startIcon={<Add />}
                            //onClick={this.onCreateJobButtonPress}
                        >
                            {this.state.editMode? 'Edit' : 'Create'}
                        </Button>
                    </Toolbar>
                </AppBar>
                <DialogContent>
                    <FormControl style={{ marginTop: 32, minWidth: '100%' }}>
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select
                            required
                            className={classes.field}
                            labelId="category-label"
                            value={this.state.newJob.category}
                            onChange={event => this.setState({ newJob: { ...this.state.newJob, category: event.target.value } })}
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
                            style={{ marginTop: 32, minWidth: '100%'  }}
                            InputProps={{
                                classes: {
                                  input: classes.field,
                                }
                              }}
                              InputLabelProps={{classes: {
                                input: classes.field,
                              }}}
                            autoOk={true}
                            disableToolbar
                            fullWidth
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
                                this.setState({ newJob: { ...this.state.newJob, startTime: startDate.valueOf() }})}}
                        />
                    </MuiPickersUtilsProvider>

                    <MuiPickersUtilsProvider utils={LuxonUtils}>
                        <KeyboardDateTimePicker 
                            style={{ marginTop: 32, minWidth: '100%'  }}
                            InputProps={{
                                classes: {
                                  input: classes.field,
                                }
                              }}
                              InputLabelProps={{classes: {
                                input: classes.field,
                              }}}
                            autoOk={true}
                            fullWidth
                            disableToolbar
                            variant="inline"
                            margin="normal"
                            openTo="year"
                            format="dd/MM/yyyy HH:mm"
                            ampm={false}
                            label="Target End Date"
                            value={new Date(this.state.newJob.endTime )}
                            onChange={ newDate => {
                                const dateTimeData = newDate.c
                                const endDate = new Date(dateTimeData.year, dateTimeData.month - 1, dateTimeData.day, dateTimeData.hour, dateTimeData.minute, dateTimeData.second)
                                this.setState({ newJob: { ...this.state.newJob, endTime: endDate.valueOf()}})}}
                        />
                    </MuiPickersUtilsProvider>


                    {
                        this.state.newJob.category === 'Location' &&
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
                            label="Target Location (Latitude)"
                            type="number"
                            value={this.state.newJob.latitude === -1 ? '' : this.state.newJob.latitude}
                            onChange={event => this.setState({ newJob: { ...this.state.newJob, latitude: event.target.value } })}
                            
                        />
                    }

                    {
                        this.state.newJob.category === 'Location' &&
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
                            label="Target Location (Longitude)"
                            type="number"
                            value={this.state.newJob.longitude === -1 ? '' : this.state.newJob.longitude}
                            onChange={event => this.setState({ newJob: { ...this.state.newJob, longitude: event.target.value } })}
                            
                        />
                    }

                    {
                        this.state.newJob.category === 'LAC/Cell-ID' &&
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
                            label="Target LAC"
                            type="number"
                            value={this.state.newJob.lac === -1 ? '' : this.state.newJob.lac}
                            onChange={event => this.setState({ newJob: { ...this.state.newJob, lac: event.target.value } })}
                            
                        />
                    }

                    {
                        this.state.newJob.category === 'LAC/Cell-ID' &&
                        <TextField
                            style={{ marginTop: 32, minWidth: '100%' }}
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
                            required
                            value={this.state.newJob.cellId === -1 ? '' : this.state.newJob.cellId}
                            onChange={event => this.setState({ newJob: { ...this.state.newJob, cellId: event.target.value } })}
                            
                        />
                    }

                    {
                        (this.state.newJob.category === 'Location' || this.state.newJob.category === 'LAC/Cell-ID') &&
                        <TextField
                            style={{ marginTop: 32 }}
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
                            fullWidth
                            required
                            type="number"
                            value={this.state.newJob.distance === -1 ? '' : this.state.newJob.distance}
                            onChange={event => this.setState({ newJob: { ...this.state.newJob, distance: event.target.value } })}
                            
                        />
                    }

                    {
                        (this.state.newJob.category === 'IMSI') &&
                        <FormControl variant="outlined" style={{ marginTop: 32, minWidth: '100%' }}>
                            <InputLabel id="target-selector-label">Target</InputLabel>
                            <Select
                                labelId="target-selector-label"
                                className={classes.field}
                                value={this.state.newJob.query}
                                onChange={event => this.setState({ newJob: { ...this.state.newJob, query: event.target.value } })}
                                label="Age"
                                required
                            >
                                {  
                                    this.state.selectedCase.targets.filter(t=> t.substring(2,3) ==='S').map(target => 
                                        <MenuItem 
                                            key={target} 
                                            value={target} 
                                        >{target.substring(5,target.length)}</MenuItem>)
                                }
                            </Select>
                        </FormControl>
                    }
                    {
                        (this.state.newJob.category === 'IMEI') &&
                        <FormControl variant="outlined" style={{ marginTop: 32, minWidth: '100%' }}>
                            <InputLabel id="target-selector-label">Target</InputLabel>
                            <Select
                                labelId="target-selector-label"
                                className={classes.field}
                                value={this.state.newJob.query}
                                onChange={event => this.setState({ newJob: { ...this.state.newJob, query: event.target.value } })}
                                label="Age"
                                required
                            >
                                {  
                                    this.state.selectedCase.targets.filter(t=> t.substring(2,3) ==='E')
                                    .map(target => 
                                        <MenuItem 
                                            key={target} 
                                            value={target}
                                        >{target.substring(5,target.length)}</MenuItem>)
                                }
                            </Select>
                        </FormControl>
                    }
                    {
                        (this.state.newJob.category === 'MSISDN') &&
                        <FormControl variant="outlined" style={{ marginTop: 32, minWidth: '100%' }}>
                            <InputLabel id="target-selector-label">Target</InputLabel>
                            <Select
                                labelId="target-selector-label"
                                className={classes.field}
                                value={this.state.newJob.query}
                                onChange={event => this.setState({ newJob: { ...this.state.newJob, query: event.target.value } })}
                                label="Age"
                                required
                            >
                                {  
                                    this.state.selectedCase.targets.filter(t=> t.substring(2,3) ==='I')
                                    .map(target => 
                                        <MenuItem 
                                            key={target} 
                                            value={target} 
                                        >{target.substring(5,target.length)}</MenuItem>)
                                }
                            </Select>
                        </FormControl>
                    }
                    {
                        (this.state.newJob.category === 'Location') &&
                        <Grid container>
                            <Grid item md={12}>
                                <MapContainer
                                    width={'97%'}
                                    mapPosition={this.state.mapPosition}
                                    markers={this.state.markers} 
                                    onMarkerDragEnd={this.onMarkerDragEnd} 
                                    onPlaceSelected={this.onPlaceSelected}
                                />
                            </Grid>
                        </Grid>
                    }
                </DialogContent>
                </form>
            </Dialog>
        );
    }


    getCaseSelectionComponent() {
        return (
            <Autocomplete
                style={{ marginTop: 16, marginLeft: 16, marginRight: 16 }}
                options={this.state.cases}
                getOptionLabel={(option) => `Case ${option.id} - ${option.name}`}
                value={this.state.selectedCase}
                onChange={(event, value) => this.fetchJobsForCase(value)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        label="Cases"
                        placeholder="Select Case by entering ID or name"
                    />
                )}
            />
        );
    }

    getCaseMetadataComponent() {
        const {
            classes
        } = this.props;

        return (
            <Card
                elevation={4}
                style={{ marginTop: 32, marginRight: 16, fontSize: FONT_SIZE }}
            >
                <CardContent>
                    <Typography component='h2' variant='h2' style={{ marginBottom: 24 }}>
                        Case Summary
                    </Typography>

                    <b>ID: </b>
                    {
                        this.state.selectedCase ? this.state.selectedCase.id : ''
                    }
                    <br />

                    <b>Name: </b>
                    {
                        this.state.selectedCase ? this.state.selectedCase.name : ''
                    }
                    <br />

                    <b>Description: </b>
                    {

                        this.state.selectedCase ? this.state.selectedCase.description : ''
                    }
                    <br />

                    <b>Category: </b>
                    {

                        this.state.selectedCase ? this.state.selectedCase.category : ''
                    }
                    <br />

                    <b>Status: </b>
                    {
                        this.state.selectedCase ?
                            <span style={{ color: this.state.selectedCase.status === 'Open' ? 'green' : 'red' }}>
                                {this.state.selectedCase.status}
                            </span>
                            : ''
                    }
                    <br />

                    <div style={{ marginTop: 16 }} />

                    <b>Users: </b>
                    {
                        this.state.selectedCase ?
                            this.state.selectedCase.accounts.map((accountId, index) =>
                                <Chip
                                    key={index}
                                    label={this.state.accountIdNameLookupMap[accountId]}
                                    className={classes.chip}
                                />
                            )
                            : ''
                    }
                    <br />

                    <b>Targets: </b>
                    {
                        this.state.selectedCase ?
                            this.state.selectedCase.targets.map((target, index) =>
                                <Chip
                                    key={index}
                                    label={target.substring(5,target.length)}
                                    className={classes.chip}
                                />
                            )
                            : ''
                    }
                    <br />
                </CardContent>
            </Card>
        );
    }

    getJobsTableComponent() {

        return (
            <MaterialTable
                icons={tableIcons}
                style={{ marginTop: 32, marginRight: 16, marginBottom: 32 }}
                components={{
                    Container: props => <Paper {...props} elevation={4} />
                }}
                options={{
                    grouping: false,
                    exportButton: this.state.currentAccount.modules.caseot.export,
                    paging: true,
                    pageSize: 10,
                    actionsColumnIndex: -1,
                    rowStyle:{
                        fontSize: FONT_SIZE
                    },
                    headerStyle:{
                        fontSize: HEADER_FONT_SIZE
                    }
                }}
                columns={[
                    { 
                        title:"Sr No", 
                        field: 'tableData.id' ,
                        render:rowData => { return( <span>{rowData.tableData.id+1}</span> ) }
                    },
                    { title: "ID", field: "id", type: "numeric", align: "left", width: 16, defaultSort: 'desc' },
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
                        render: rowData => moment(rowData['startTime']).format('DD/MM/YYYY'),
                        grouping: false,
                    },
                    {
                        title: "Start Time",
                        field: "startTime",
                        align: "center",
                        render: rowData => moment(rowData['startTime']).format('HH:mm:ss'),
                        grouping: false,
                    },
                    {
                        title: "End Date",
                        field: "endTime",
                        align: "center",
                        render: rowData => moment(rowData['endTime']).format('DD/MM/YYYY'),
                        grouping: false,
                    },
                    {
                        title: "End Time",
                        field: "endTime",
                        align: "center",
                        render: rowData => moment(rowData['endTime']).format('HH:mm:ss'),
                        grouping: false,
                    },
                    { 
                        title: "Created On (Date)", 
                        field: "createdAt" ,
                        align: "center",
                        render: rowData => moment(Date.parse(rowData['createdAt'])).format("DD/MM/YYYY"),
                    },
                    { 
                        title: "Created On (Time)", 
                        field: "createdAt" ,
                        align: "center",
                        render: rowData => moment(Date.parse(rowData['createdAt'])).format("HH:mm:ss"),
                    },
                ]}
                data={this.state.selectedCaseJobsList}
                title='Jobs List'
                actions={[
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
                ]}
            />
        );
    }

    componentDidMount() {
        this.getAllAccounts();
        this.fetchAllCases();

        
    }
    componentDidUpdate(){
        if(this.state.alertOpen){
          setTimeout(() => this.setState({alertOpen:false}), 5000);
        }
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


    async fetchAllCases() {
        try {
            let response = [];
            if(this.state.currentAccount['designation'] === 'Admin'){
                response = await getAllCases();
            }else{
                response = await getAllCases(this.state.currentAccount['id']);
            }
            response = response.filter((caseItem, index) => caseItem['name'] !== DEFAULT_CASE_CHECK_OT );
            this.setState({ cases: response });
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
            payload.query = payload.query.substring(5,payload.query.length);
            if (payload.category === 'Location') {
                payload['query'] = payload['latitude'] + ',' + payload['longitude'] + ',' + payload['distance'];
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
            // payload['startTime'] = payload['startTime'];
            // payload['endTime'] = payload['endTime']*1000;
            payload['case'] = this.state.selectedCase['id'];
            
            if(this.state.editMode){
                let response = await editJob(payload.id, payload);
            }else{
                let response = await addJob(payload);
            }         
            

            let message = this.state.editMode ? 'Job Edited Successfully' : 'Job Created Successfully';  
            this.setState({
                alertType: 'success',
                alertTitle: 'Case Intel',
                alertMessage: message,
                alertOpen: true,
            });

            this.resetToDefault();
            this.fetchJobsForCase(this.state.selectedCase);
        } catch (error) {
            console.log(error);
            this.setState({
                alertType: 'error',
                alertTitle: 'Error',
                alertMessage: error.toString(),
                alertOpen: true,
              });
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

export default withStyles(styles)(CaseIntel);
