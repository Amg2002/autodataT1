/* eslint-disable no-unused-vars */
import {
    withStyles,
    Button,
    Paper,
    Grid,
    ExpansionPanel,
    ExpansionPanelSummary,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    AccordionActions,
    InputLabel,
    MenuItem,
    Select,
    FormControl,
    IconButton,
    Typography,
    Dialog,
    DialogContent,
    AppBar,
    Toolbar
} from '@material-ui/core';
import {
    Close,
    TableChart,
    Timeline,
    People,
    AddBox,
    ArrowDownward,
    Check,
    ChevronLeft,
    ChevronRight,
    Clear,
    DeleteOutline,
    Edit,
    FilterList,
    FirstPage,
    LastPage,
    Remove,
    SaveAlt,
    Search,
    ViewColumn,
    Map,
} from '@material-ui/icons';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import RefreshIcon from '@material-ui/icons/Refresh';
import ViewCompactIcon from '@material-ui/icons/ViewCompact';
import EditLocationIcon from '@material-ui/icons/EditLocation';
import CompareIcon from '@material-ui/icons/Compare';
import React, { forwardRef } from 'react';
import moment from "moment";
import momentDurationFormatSetup  from 'moment-duration-format';
// Local
import { DEFAULT_CASE_CHECK_OT, FONT_SIZE, HEADER_FONT_SIZE } from '../../../config';
import {getCdrColumnName, hiddenFields} from '../../getCdrColumns';
import DataTableContent from '../../FencingOT/Reports/Content/DataTable';
import HandsetHistoryContent from '../../FencingOT/Reports/Content/HandsetHistory';
import MaterialTable from "material-table";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MapToolsQuery from '../../FencingOT/Reports/Query/MapTools';
import DataMapQuery from './Query/DataMap';
import DataTableQuery from './Query/DataTable';
import HandsetHistoryQuery from './Query/HandsetHistory';
import LinkTreeQuery from './Query/LinkTree';
import LinkTree from "../../FencingOT/Reports/Content/LinkTree";
import PivotTable from '../../FencingOT/Reports/Content/PivotTable';
import CompareGeoFence from '../../FencingOT/Reports/Content/DataMap/CompareGeoFence'
import ClusterMap from '../../FencingOT/Reports/Content/DataMap/ClusterMap';
import ZoneDataMap from '../../FencingOT/Reports/Content/DataMap/ZoneDataMap';
import POIMapPreview from '../../CaseOT/POI/POIMapPreview';
import ZoneMapPreview from '../../CaseOT/Zones/ZoneMapPreview';

import AlertCard from '../../../components/alert-card/alert-card.component';
import Loader from '../../../components/loader/loader.component';
import { 
    addJob, 
    deleteJob, 
    getAllCases, 
    getCdrColumns, 
    getCdrComparision, 
    getCdrForLocation, 
    getJobs, 
    getPois, 
    getZones ,
    getCdrForJob,
    getClusterData,
    getCellSites
} from '../../../util/network';


momentDurationFormatSetup(moment);

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
        fontSize: FONT_SIZE
    },
    widgetListItem: {
        marginLeft: 16,
        marginBottom: 6,
        textAlign: 'right',
        align: 'center'
    },
    container:{
        width: '40%',
        height: '60%',
        align: 'center',
    },
    title: {
        padding: 10,
    },
    modal:{
        position: 'absolute',
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    }
});


class Reports extends React.Component {
    constructor(props) {
        super(props);
        this.getMainContent = this.getMainContent.bind(this);
        this.getLeftDrawer = this.getLeftDrawer.bind(this);
        this.getRightDrawer = this.getRightDrawer.bind(this);
        this.getJobsTableComponent = this.getJobsTableComponent.bind(this);
        this.getWidgetsListComponent = this.getWidgetsListComponent.bind(this);
        this.onDeleteButtonPress = this.onDeleteButtonPress.bind(this);
        this.getDefaultCase = this.getDefaultCase.bind(this);
        this.getCdrDataTable = this.getCdrDataTable.bind(this);
        this.fetchJobsForCase = this.fetchJobsForCase.bind(this);
        this.fetchCdrForJob = this.fetchCdrForJob.bind(this);
        this.fetchCompareGeoFenceData=this.fetchCompareGeoFenceData.bind(this);
        this.onCreateJobButtonPress = this.onCreateJobButtonPress.bind(this);
        this.getPOIs = this.getPOIs.bind(this);
        this.fetchZones = this.fetchZones.bind(this);
        this.getZoom = this.getZoom.bind(this);
        this.getCellSitesDetails = this.getCellSitesDetails.bind(this);
        this.getMapEditData = this.getMapEditData.bind(this);
        this.getMapToolsSPData = this.getMapToolsSPData.bind(this);
        this.getMapToolsCoordinates = this.getMapToolsCoordinates.bind(this);
        this.getMapToolsLength = this.getMapToolsLength.bind(this);
        this.getMapToolsArea = this.getMapToolsArea.bind(this);
        this.handleFeatureChange = this.handleFeatureChange.bind(this)
        this.handleClusterChange = this.handleClusterChange.bind(this);
        this.resetMapToolsData = this.resetMapToolsData.bind(this);
        this.activateMap=this.activateMap.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    state = {
        mapKey:1,
        showDataTable:true,
        loaderStatus: true,
        loadingLocationCdr: false,
        compareLoader: false,
        clusterLoaderStatus: false,
        currentAccount: this.props.currentAccount,
        expanded: 'panel1',
        leftDrawerOpen: true,
        rightDrawerOpen: true,
        activeWidget: 'Table',
        targetWidgetStatus: false,
        locationWidgetStatus:false,
        selectedCase: this.props.selectedCase,
        selectedCaseJobsList: [],
        selectedCaseLocationJobList: [],
        selectedJob: null,
        selectedJobCdrId: null,
        selectedJobCdrList: [],
        selectedCaseLocationJobCdrList: [],
        newJob: {
            id: -1,
            name: null,
            case: -1,
            category: 'IMSI',
            status: '',
            latitude: -1,
            longitude: -1,
            distance: -1,
            lac: -1,
            cellId: -1,
            startTime: new Date(),
            endTime: new Date(),
            query: '',
        },
        mapEditMode: true,
        featureMode: false,
        clusterMode: false,
        clusterType: 'K-MEANS',
        clusterData: [],
        poiMode: false,
        zoneMode: false,
        compareGeoFenceMode: true,
        compareGeoFenceData: {},
        poiValue: '',
        zoneValue: '',
        showPOIMapPreview: false,
        showZoneMapPreview: false,
        selectedCasePOIData:[],
        selectedCaseZoneData:[],
        dataTableSelectedColumns: ['timestampdate', 'timestamptime', 'servedmsisdn', 'callingnumber','callednumber','locationlat','locationlon','callduration','locationnum'].map((colName) => getCdrColumnName(colName)),
        allCdrColumns: [],
        mapEditToolsData:{
            spData: null,
            coordinatesData: null,
            lengthData: null,
            areaData: null
        },
        mapEditData:null,
        zoom: null,
        currentCenter: null,
        mapToolsAllMarker:{},
        markers: [
            {
              name: "Current position",
              position: {
                lat: 9.58817943397567,
                lng: 8.016038970947266
              }
            },
        ],
        previewPane: [
            [
                [7.749339232174151, 9.798932035516],
                [7.920703352793623, 9.810189396699982],
                [7.934412510891349, 9.652551028808134],
                [7.7996060464202515, 9.659308497487146],
            ]
        ],
        cellSitesDetails:{
            lat1: null,
            lat2: null,
            lon1: null,
            lon2: null,
            operator: 'MTN'
        },
        cellSites: [], //[{mcc: 621, mnc: 30, lac: 10026, cellSite: 35, operator: 'MTN', latitude: 6.4592, longitude: 3.42917, geoHash: 's14kw', address: '', city: 'ETI OSA', lga: 'ETI OSA'}],
        coordinatesZoneDataPreview:[],
        selectedRow:[],
        selectedRowData: [],
        selectedRowIndex: [],
        multipleMarkers: [],
        alertType: '',
        alertTitle: '',
        alertMessage: '',
        alertOpen: false,
        openConfirmation: false,
        jobsExpansionOpen:false,
        queryExpansionOpen:true,
        widgetsExpansionOpen:true,
    }

    onClose(){
        this.setState({
            alertOpen: false
        })
    }

    getselectedCaseZoneDataFromName=(zoneName)=>{
       
        let selectedZoneObj=[];
        selectedZoneObj=this.state.selectedCaseZoneData.filter((zone)=>{
          return zone.name.toLowerCase()===zoneName.toLowerCase();
        })
        this.updateCoordinates(selectedZoneObj[0].lat1,selectedZoneObj[0].lng1,selectedZoneObj[0].lat2,selectedZoneObj[0].lng2);
    }

    getselectedCasePOIDataFromName=(poiName)=>{       
        let selectedPOIObj=[];
        selectedPOIObj=this.state.selectedCasePOIData.filter((poi)=>{
         return poi.name.toLowerCase()===poiName.toLowerCase();
        })
        this.setState({
            markers:  [
                {
                    name: selectedPOIObj[0].name,
                    position: {
                    lat: selectedPOIObj[0].lat,
                    lng: selectedPOIObj[0].lng,
                    }
                },
            ],
        });
    }

    updateCoordinates = (lat1,lng1,lat2,lng2) => {
        var previewA=lat1.split(',');
        var previewB=lng1.split(',');
        var previewC=lat2.split(',');
        var previewD=lng2.split(',');
        
        var arr1=[],arr2=[],arr3=[],arr4=[],arr5=[],arrF=[],arrFinal=[];
        
        for( var i=0;i<previewA.length;i++){
            arr1.push(parseFloat(previewA[i]))
        }
        
        for( i=0;i<previewB.length;i++){
            arr2.push(parseFloat(previewB[i]))
        }
        
        for( i=0;i<previewC.length;i++){
            arr3.push(parseFloat(previewC[i]))
        }
        
        for( i=0;i<previewD.length;i++){
            arr4.push(parseFloat(previewD[i]))
        }
        
        for( i=0;i<previewA.length;i++){
            arr5.push(parseFloat(previewA[i]))
        }
        arrF.push(arr1);
        arrF.push(arr2);
        arrF.push(arr3);
        arrF.push(arr4);
        arrF.push(arr5);
        arrFinal.push(arrF);
            
        this.setState({ 
            showZoneMapPreview:false,
            previewPane: arrFinal,
        });     
    }

    updateZonePreviewCoordinates = (lat1,lng1,lat2,lng2) => { 
        let previewA=lat1.split(',');
        let previewB=lng1.split(',');
        let previewC=lat2.split(',');
        let previewD=lng2.split(',');
        let obj;
        let multipleMarkers=[];
           obj={
                   lat:parseFloat(previewA[0]),
                   lng:parseFloat(previewA[1])
           }
           multipleMarkers.push(obj);
           obj={
                   lat:parseFloat(previewB[0]),
                   lng:parseFloat(previewB[1])
           }
           multipleMarkers.push(obj);
           obj={
                   lat:parseFloat(previewC[0]),
                   lng:parseFloat(previewC[1])
           }
           multipleMarkers.push(obj);
           obj={
                   lat:parseFloat(previewD[0]),
                   lng:parseFloat(previewD[1])
           }
           multipleMarkers.push(obj);
           obj={
                   lat:parseFloat(previewA[0]),
                   lng:parseFloat(previewA[1])
           }
           multipleMarkers.push(obj);

           
       this.setState({ 
            showZoneMapPreview:true,
            coordinatesZoneDataPreview: multipleMarkers,
        });
            
    }

    getRow=(selectedRows, selectedRowIndex)=>{
    this.setState({
        selectedRowData: selectedRows,
        selectedRowIndex: selectedRowIndex
    });
    } 

    getCompareGeoLocationDetails = (latitude, longitude, distance ) => {
        let updatedNewJob = this.state.newJob;
        updatedNewJob.latitude= latitude;
        updatedNewJob.longitude= longitude;
        updatedNewJob.distance= distance;
        
        this.setState({
            newJob: updatedNewJob
        })
    }

    getMapEditData(data){
        this.setState({
            mapEditData: data
        })
    }

    getCellSitesDetails(csDetails){
        csDetails['operator'] = this.state.cellSitesDetails.operator;
        this.setState({
            cellSitesDetails: csDetails
        }, () => {
            this.fetchCellSites();
        })
    }

    getZoom(zoomLvl, currentCenter){
        this.setState({
            zoom: zoomLvl,
            currentCenter: currentCenter
        });
    }

    getMapToolsSPData(startPoint, endPoint){
        let updatedMapToolsData = this.state.mapEditToolsData;
        updatedMapToolsData.spData = [startPoint, endPoint];
        this.setState({
            mapEditToolsData: updatedMapToolsData
        })
    }

    getMapToolsCoordinates(dataCoordinates){
        let updatedMapToolsData = this.state.mapEditToolsData;
        updatedMapToolsData.coordinatesData = dataCoordinates;
        this.setState({
            mapEditToolsData: updatedMapToolsData
        }) 
    }

    getMapToolsLength(length){
        let updatedMapToolsData = this.state.mapEditToolsData;
        updatedMapToolsData.lengthData = length;
        this.setState({
            mapEditToolsData: updatedMapToolsData
        }) 
    }

    getMapToolsArea(area){
        let updatedMapToolsData = this.state.mapEditToolsData;
        updatedMapToolsData.areaData = area;
        this.setState({
            mapEditToolsData: updatedMapToolsData
        })
    }

    handleFeatureChange(feature){
        this.setState({
            featureMode: feature,
            mapKey: this.state.mapKey+1
        })
    }

    handleClusterChange(type){
        this.setState({
            clusterType: type,
        }, () => {
            this.fetchClusterData(this.state.selectedRowData);
        })
    }

    getCdrDataTable(){
        return <DataTableContent
            allColumns={this.state.allCdrColumns}
            selectedColumns={this.state.dataTableSelectedColumns} 
            selectedJob={this.state.selectedJob}
            selectedJobCdrList={this.state.selectedJobCdrList}
            selectedRowIndex={this.state.selectedRowIndex}
            getRow={this.getRow}
            exportRight={this.state.currentAccount.modules.checkot.export}
        />
    }

    render() {

        let leftDrawerSize = this.state.leftDrawerOpen ? 3 : 1;
        let rightDrawerSize = this.state.rightDrawerOpen ? 3 : 1;
        let mainContentSize = 12 - (leftDrawerSize + rightDrawerSize);


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
                <Grid container>
                    { this.state.leftDrawerOpen
                        ?<Grid item md={leftDrawerSize} style={{backgroundColor: '#18202c' }}>
                            {this.getLeftDrawer()}
                         </Grid>   
                        :<Grid item style={{width:"4%",backgroundColor: '#18202c' }}>
                            {this.getLeftDrawer()}
                         </Grid>    
                    }
                    {
                        this.state.leftDrawerOpen && this.state.rightDrawerOpen
                            ?    <Grid item md={mainContentSize} style={{ padding: 16 }}>
                                    {this.state.loaderStatus && this.state.activeWidget ==='Table' && this.state.selectedJob && (<Loader />)}
                                    <div style={{display: (this.state.selectedJob && this.state.showDataTable && !this.state.loaderStatus)? 'block' : 'none'}}>
                                        {this.getCdrDataTable()}
                                    </div>
                                    {
                                        this.state.selectedJob && (
                                            <div style={{display: this.state.showDataTable? 'none' : 'block'}}>
                                                {this.getMainContent()}
                                            </div>
                                        )
                                    }
                                </Grid>
                            :   this.state.leftDrawerOpen || this.state.rightDrawerOpen
                                ?   <Grid item style={{width:'71%',padding: 16}}>
                                        {this.state.loaderStatus && this.state.activeWidget ==='Table' && this.state.selectedJob && (<Loader />)}
                                        <div style={{display: (this.state.showDataTable && !this.state.loaderStatus && this.state.selectedJob)? 'block' : 'none'}}>
                                            {this.getCdrDataTable()}
                                        </div>    
                                        {this.state.selectedJob && (<div style={{display: this.state.showDataTable? 'none' : 'block'}}>
                                            {this.getMainContent()}
                                        </div>)
                                        }    
                                    </Grid> 
                                :   <Grid item style={{width:'92%',padding:16}}>
                                        {this.state.loaderStatus && this.state.activeWidget ==='Table' && this.state.selectedJob && (<Loader />)}
                                        <div style={{display: (this.state.showDataTable && !this.state.loaderStatus && this.state.selectedJob)? 'block' : 'none'}}>
                                            {this.getCdrDataTable()}
                                        </div>
                                        {
                                            this.state.selectedJob && (<div style={{display: this.state.showDataTable? 'none' : 'block'}}>
                                                {this.getMainContent()}
                                            </div>)

                                        }
                                    </Grid>          
                    }
                    { this.state.rightDrawerOpen
                        ?<Grid item md={rightDrawerSize} style={{backgroundColor: '#18202c' }}>
                            {this.getRightDrawer()}
                         </Grid>   
                        :<Grid item style={{width:'4%',backgroundColor: '#18202c' }}>
                            {this.getRightDrawer()}
                         </Grid>    
                    }
                </Grid>
            </div >
        );
    }

    handlePOIChange = (event) => {

        this.setState({
            poiValue: event.target.value,
            poiMode:true,
            zoneValue: '',
            zoneMode: false,
        })
        this.getselectedCasePOIDataFromName(event.target.value);
    }
    
    handleZoneChange = (event) => {
        this.setState({
            poiValue: '',
            poiMode: false,
            zoneValue: event.target.value,
            zoneMode:true, 

        })
        this.getselectedCaseZoneDataFromName(event.target.value);
    }

    getMarkersFromRowData = (rowData) => {
          if(rowData){
            var multipleMarkers=[];
            for(var i=0;i<rowData.length;i++)
            {
                var obj = { name:rowData[i].id, 
                            position: {
                                lat: rowData[i].locationlat,
                                lng: rowData[i].locationlon
                            }
                        };
                multipleMarkers.push(obj);    
            }
            this.setState({multipleMarkers: multipleMarkers});
          }
    }

    getMainContent() {
        switch (this.state.activeWidget) {
            case 'Handset':
                return <HandsetHistoryContent
                    selectedJob={this.state.selectedJob}
                    selectedCaseJobsList={this.state.selectedJobCdrList}
                />;
            case 'Map':
                return <ZoneDataMap 
                    key={this.state.mapKey}
                    zoom={this.state.zoom}
                    currentCenter={this.state.currentCenter}
                    points={this.state.previewPane} 
                    multipleMarkers={this.state.multipleMarkers}
                    zoneMode={this.state.zoneMode}
                    poiMode={this.state.poiMode}
                    markers={this.state.markers}
                    mapEditMode={this.state.mapEditMode}
                    mapEditData={this.state.mapEditData}
                    featureMode={this.state.featureMode}
                    cellSites={this.state.cellSites}
                    getZoom={this.getZoom}
                    getCellSitesDetails={this.getCellSitesDetails}
                    getMapEditData={this.getMapEditData}
                    getMapToolsSPData={this.getMapToolsSPData}
                    getMapToolsCoordinates={this.getMapToolsCoordinates}
                    getMapToolsLength={this.getMapToolsLength}
                    getMapToolsArea={this.getMapToolsArea}
                />;
            case 'Cluster': 
                return <div>
                    <div style={{display: this.state.clusterLoaderStatus? 'block': 'none'}}>
                        <Loader />
                    </div>
                    <div style={{display: this.state.clusterLoaderStatus? 'none': 'block'}}><ClusterMap
                    key={this.state.mapKey}
                    zoom={this.state.zoom}
                    currentCenter={this.state.currentCenter}
                    getZoom={this.getZoom}
                    clusterType={this.state.clusterType}
                    clusterData={this.state.clusterData}
                    marker={this.state.markers}
                    handleClusterChange={this.handleClusterChange}
                /></div></div>; 
            case 'CompareGeoFence_Select':
                return (this.getLocationJobsTableComponent());
            case 'CompareGeoFence_Compare':
                return <div>
                    <div style={{display: this.state.compareLoader? 'block': 'none'}}>
                        <Loader />
                    </div>
                    <div style={{display: this.state.compareLoader? 'none': 'block'}}><CompareGeoFence
                        key={this.state.mapKey}
                        zoom={this.state.zoom}
                        currentCenter={this.state.currentCenter}
                        getZoom={this.getZoom}
                        getCompareGeoLocationDetails={this.getCompareGeoLocationDetails}
                        compareGeoFenceMode={this.state.compareGeoFenceMode}
                        compareGeoFenceData={this.state.compareGeoFenceData}
                        selectedCaseLocationJobCdrList={this.state.selectedCaseLocationJobCdrList}
                    />
                </div></div>;
            case 'Linktree':
                return <LinkTree selectedJob={this.state.selectedJob} />;
            case 'PivotTable':
                return <PivotTable data={this.state.selectedJobCdrList} />;
            default:
                return ;
        }
    }

    handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false
    });
    };

    getLeftDrawer() {
        const {
            classes,
        } = this.props;

        let leftDrawerOpen = this.state.leftDrawerOpen;

        return (
            <div>
                <Paper
                    className={classes.drawer}
                    elevation={4}
                    style={{backgroundColor: '#18202c', boxShadow:'none'}}
                >
                    <div style={{ textAlign: 'right',  backgroundColor: '#18202c' }}>
                        <IconButton 
                            onClick={() => this.setState({ leftDrawerOpen: !leftDrawerOpen, mapKey: this.state.mapKey+1 })}
                        >
                            {leftDrawerOpen ? <ChevronLeft fontSize="large" style={{ color: 'white'}}/> : <ChevronRight fontSize="large" style={{ color: 'white' }} />}
                        </IconButton>
                    </div>
                    {
                        leftDrawerOpen ?
                            <div style={{ padding: 8,height: '100%', minHeight: window.innerHeight*0.8,}}>
                                <ExpansionPanel 
                                     expanded={this.state.expanded === 'panel1'}
                                     onChange={this.handleChange('panel1')}
                                       ltExpanded
                                   >
                                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography component='h3' variant='h3'>
                                            <strong>Jobs</strong>
                                        </Typography>
                                    </ExpansionPanelSummary>
                                    {this.getJobsTableComponent()}
                               </ExpansionPanel>
                            </div>
                            : <div />
                    }

                    {
                        leftDrawerOpen ?
                            <div />
                            :
                            <div style={{
                                textAlign: 'center',
                                marginTop: window.innerHeight / 5,
                                paddingBottom: window.innerHeight / 3.2,
                                height: window.innerHeight*1.1,
                                backgroundColor: '#18202c',
                                cursor: 'pointer'
                            }}>
                                <span
                                    style={{ fontSize: 27, textAlign: 'center',color:'white' }}
                                    onClick={() => this.setState({ leftDrawerOpen: !leftDrawerOpen })}
                                >
                                    J<br />
                                    O<br />
                                    B<br />
                                    S<br />
                                </span>
                            </div>
                    }

                </Paper>
            </div>
        );
    }

    getJobsTableComponent() {

        return (
            <MaterialTable
                icons={tableIcons}
                style={{ marginTop: 12, marginRight: 12 }}
                components={{
                    Container: props => <Paper {...props} elevation={0} />
                }}
                localization={{
                    toolbar: {
                        nRowsSelected: '',
                    },
                }}
                actions={[
                    {
                        icon: () => <RefreshIcon color='primary' />,
                        tooltip: 'Refresh Table',
                        isFreeAction: true,
                        onClick: (event) => this.fetchJobsForCase(this.state.selectedCase)
                    }
                ]}
                options={{
                    grouping: false,
                    exportButton: false,
                    paging: true,
                    rowStyle: rowData => ({
                        backgroundColor: (this.state.selectedJob.id === rowData.id) ? '#EEE' : '#FFF',
                        fontSize: FONT_SIZE
                    }),
                    headerStyle: {
                        fontSize: HEADER_FONT_SIZE
                    }
                }}
                columns={[
                    { title: "ID", field: "id", type: "numeric", align: "left", width: 8 },
                    { title: "Name", field: "name" },
                    { title: "Category", field: "category" },
                    {
                        title: "Query",
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
                        title: "Start Date",
                        field: "startTime",
                        align: "center",
                        render: rowData => moment.unix(rowData['startTime']/1000).format("DD/MM/YYYY"),
                    },
                    {
                        title: "Start Time",
                        field: "startTime",
                        align: "center",
                        render: rowData => moment.unix(rowData['startTime']/1000).format("HH:mm"),
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
                        title: "Created On (Date)", 
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
                title=''
                onRowClick={(event, selectedRow) => { this.setState({
                    activeWidget: 'Table', 
                    featureMode: false, 
                    showDataTable: true
                }, () => {
                    this.fetchCdrForJob(selectedRow)
                    this.resetMapToolsData();
                }) }}
            />
        );
    }

    getLocationJobsTableComponent() {
        const {
            classes, 
        } = this.props;

        return (
            <div style={{marginTop:'50px'}}>
                <div style={{display: this.state.compareLoader? 'block': 'none'}}>
                    <Loader />
                </div>
                <div style={{display: this.state.compareLoader? 'none': 'block'}}>
                <Grid container>
                    <Grid item xs={4}>
                        <Typography component='h2' variant='h2'><strong>Compare Geo Fence</strong></Typography>
                    </Grid>
                    <Grid item xs={8} style={{textAlign: 'right'}}>
                        <Button 
                            variant="contained" 
                            color="primary"
                            style={{margin: '5px'}}
                            onClick={() => {
                                if(this.state.selectedCaseLocationJobCdrList.length === 2){
                                    this.setState({openConfirmation: true})
                                }else{
                                    let message = 'Please select two jobs';
                                    if(this.state.selectedCaseLocationJobCdrList.length > 2) message = 'Please select only 2 jobs';

                                    this.setState({
                                        alertType: 'error',
                                        alertTitle: 'Compare Geo Fence',
                                        alertMessage: message,
                                        alertOpen: true,
                                    });
                                }
                            }}
                        >
                            Compare
                        </Button>
                        <Dialog
                            aria-labelledby='customized-dialog-title'
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            open={this.state.openConfirmation}
                            onClose={
                                () => {
                                    this.setState({openConfirmation: false})
                                }
                            }
                        >
                            <AppBar position='static' style={{ backgroundColor: '#18202c' }}>
                                <Toolbar>
                                    <Grid
                                        justify='space-between'
                                        container
                                    >
                                        <Grid item>
                                            <Typography
                                                variant='h2'
                                                color='inherit'
                                                className={classes.title}
                                            >
                                                Confirm Selected Jobs
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <IconButton
                                                aria-label='close'
                                                className={classes.closeButton}
                                                onClick={() => {
                                                    this.setState({openConfirmation: false})
                                                }}
                                                color='inherit'
                                            >
                                                <Close />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </Toolbar>
                            </AppBar>
                            <DialogContent>
                                <div className={classes.drawercontent}>
                                    <TableContainer component={Paper}>
                                        <Table className={classes.table} aria-label="simple table">
                                            <TableHead>
                                            <TableRow>
                                                <TableCell>ID</TableCell>
                                                <TableCell>Name</TableCell>
                                                <TableCell>Category</TableCell>
                                                <TableCell>Query</TableCell>
                                                <TableCell>Start Date</TableCell>
                                                <TableCell>Start Time</TableCell>
                                                <TableCell>End Date</TableCell>
                                                <TableCell>End Time</TableCell>
                                            </TableRow>
                                            </TableHead>
                                            <TableBody>
                                            {this.state.selectedCaseLocationJobCdrList.map((row) => (
                                                <TableRow key={row.id}>
                                                <TableCell component="th" scope="row">
                                                    {row.id}
                                                </TableCell>
                                                <TableCell>{row.name}</TableCell>
                                                <TableCell>{row.category}</TableCell>
                                                <TableCell align="left"><span>
                                                            <b>Latitude: </b>{row['query'].split(',')[0]}<br />
                                                            <b>Longitude: </b>{row['query'].split(',')[1]}<br />
                                                            <b>Distance: </b>{row['query'].split(',')[2]}<br />
                                                        </span>
                                                
                                                </TableCell>
                                                <TableCell>{moment.unix(row['startTime']/1000).format("DD/MM/YYYY")}</TableCell>
                                                <TableCell>{moment.unix(row['startTime']/1000).format("HH:mm")}</TableCell>
                                                <TableCell>{moment.unix(row['endTime']/1000).format("DD/MM/YYYY")}</TableCell>
                                                <TableCell>{moment.unix(row['endTime']/1000).format("HH:mm")}</TableCell>
                                                </TableRow>
                                            ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <div style={{textAlign: 'right', marginTop: 15}}>
                                        <Button
                                            variant="contained" 
                                            color="primary"
                                            className={classes.button}
                                            onClick={() => { 
                                                this.setState({
                                                    openConfirmation: false,
                                                    compareLoader: true,
                                                })
                                                this.fetchCompareGeoFenceData();
                                            }}
                                        >Confirm</Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </Grid>
                </Grid>
                <MaterialTable
                    icons={tableIcons}
                    style={{ marginTop: 32, marginRight: 16 }}
                    components={{
                        Container: props => <Paper {...props} elevation={0} />
                    }}
                    localization={{
                        toolbar: {
                            nRowsSelected: '',
                        },
                    }}
                    options={{
                        grouping: false,
                        exportButton: false,
                        paging: true,
                        selection: true,
                        rowStyle: {
                            fontSize: FONT_SIZE,
                        },
                        headerStyle:{
                            fontSize: HEADER_FONT_SIZE
                        }
                    }}
                    onSelectionChange={(rows) => {
                        if(!(rows.length)) {this.setState({ selectedCaseLocationJobCdrList: [] });}
                        else{
                            let newList = [];   
                            rows.forEach((row) => { newList.push(row); })
                            this.setState({ selectedCaseLocationJobCdrList: newList });
                        }
                        
                    }}
                    columns={[
                        { title: "ID", field: "id", type: "numeric", align: "left", width: 8 },
                        { title: "Category", field: "category" },
                        {
                            title: "Query",
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
                                else resultantHtmlElement = rowData['query'];
                                return resultantHtmlElement;
                            }
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
                            render: rowData => moment.unix(rowData['startTime']/1000).format("HH:mm"),
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
                    ]}
                    data={this.state.selectedCaseLocationJobList}
                    title='Select Location'
                />
                </div>
            </div>
        );
    }


    getRightDrawer() {
        const {
            classes,
        } = this.props;

        let rightDrawerOpen = this.state.rightDrawerOpen;

        return (
            <div>
                <Paper
                    className={classes.drawer}
                    elevation={4}
                    style={{backgroundColor: '#18202c', boxShadow:'none' }}
                >
                    <div style={{ textAlign: 'left',backgroundColor: '#18202c'  }}>
                        <IconButton
                            onClick={() => this.setState({ rightDrawerOpen: !rightDrawerOpen, mapKey: this.state.mapKey+1 })}
                        >
                             {rightDrawerOpen ?<ChevronRight fontSize="large" style={{ color: 'white'}}/> : <ChevronLeft fontSize="large" style={{ color: 'white' }} />}
                        </IconButton>
                    </div>

                    {
                        rightDrawerOpen ?
                            <div style={{ padding: 10 ,height: '100%', minHeight: window.innerHeight*0.8,}}>
                                

                             
                                <ExpansionPanel     
                                     defaultexpanded={this.state.queryExpansionOpen}
                                     onChange={(event,queryExpansionOpen) => this.setState({ queryExpansionOpen: !queryExpansionOpen })}
                                       ltExpanded
                                   >
                               <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                               <Typography component='h3' variant='h3' >
                                    <strong>Data</strong>
                                </Typography>
                               </ExpansionPanelSummary>
                                {
                                    this.state.activeWidget === 'Table' ?
                                        <DataTableQuery
                                            allColumns={this.state.allCdrColumns.map((col) => getCdrColumnName(col))}
                                            selectedColumns={this.state.dataTableSelectedColumns}
                                            onChange={(event, newVal) => this.setState({ dataTableSelectedColumns: newVal })}
                                        /> :
                                        <div />
                                }
                               {
                                    this.state.activeWidget === 'Handset' ?
                                        <HandsetHistoryQuery />
                                        : <div />
                                }

                                {
                                    this.state.activeWidget === 'Map' ?
                                        <DataMapQuery />
                                        : <div />
                                }

                                {
                                    this.state.activeWidget === 'Linktree' ?
                                        <LinkTreeQuery />
                                        : <div />
                                }
                                {
                                    this.state.activeWidget === 'PivotTable' ?
                                        <LinkTreeQuery />
                                        : <div />
                                }
                                {
                                    (this.state.activeWidget === 'Map' && this.state.mapEditMode) ?
                                        <MapToolsQuery
                                            mapEditMode={this.state.mapEditMode}
                                            featureMode={this.state.featureMode}
                                            mapEditToolsData={this.state.mapEditToolsData}
                                            handleFeatureChange={this.handleFeatureChange}
                                        /> :
                                        <div />
                                }
                    
                               </ExpansionPanel>
                                <ExpansionPanel  
                                     className={classes.expansion}
                                     defaultexpanded={this.state.widgetsExpansionOpen}
                                     onChange={(event,widgetsExpansionOpen) => this.setState({ widgetsExpansionOpen: !widgetsExpansionOpen })}
                                       ltExpanded
                                   >
                               <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                               <Typography component='h3' variant='h3' >
                                    <strong>Widgets</strong>
                                </Typography>
                               </ExpansionPanelSummary>
                               {this.getWidgetsListComponent()}

                               </ExpansionPanel>
                                
                                <Accordion>
                                    <AccordionSummary
                                      expandIcon={<ExpandMoreIcon />}
                                      aria-controls="panel2a-content"
                                      id="panel2a-header"
                                    >
                                      <Typography component='h3' variant='h3'><strong>POI</strong></Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <FormControl variant="outlined" style={{width:'100%'}}>
                                            <InputLabel>Select a POI</InputLabel>
                                            <Select
                                                aria-label="names" 
                                                name="names"
                                                value={this.state.poiValue} 
                                                onChange={this.handlePOIChange}
                                                label="names"
                                            >
                                                {this.state.selectedCasePOIData.map((poi)=>{
                                                    return(
                                                        <MenuItem value={poi.name}>{poi.name}</MenuItem>
                                                    )
                                                })}
                                            </Select>
                                        </FormControl>
                                        <Dialog
                                            aria-labelledby='customized-dialog-title'
                                            classes={{
                                                paper: classes.container,
                                            }}
                                            open={this.state.showPOIMapPreview}
                                            onClose={
                                                () => this.resetToDefault()
                                            }> 
                                                <AppBar position='static' style={{ backgroundColor: '#18202c' }}>
                                                    <Toolbar>
                                                        <Grid
                                                            justify='space-between'
                                                            container
                                                        >
                                                            <Grid item>
                                                                <Typography
                                                                    variant='h5'
                                                                    color='inherit'
                                                                    className={classes.title}
                                                                >
                                                                    Preview POI
                                                                    </Typography>
                                                            </Grid>
                                                            <Grid item>
                                                                <IconButton
                                                                    aria-label='close'
                                                                    className={classes.closeButton}
                                                                    onClick={() => this.setState({ showPOIMapPreview: !this.state.showPOIMapPreview })}
                                                                    color='inherit'
                                                                >
                                                                    <Close />
                                                                </IconButton>
                                                            </Grid>
                                                        </Grid>
                                                    </Toolbar>
                                                </AppBar>
                                                <DialogContent style={{marginLeft:'-1.25rem',marginTop:'-0.5rem'}}>    
                                                    <POIMapPreview markers={this.state.markers} onMarkerDragEnd={this.onMarkerDragEnd}/>
                                                </DialogContent>                                           
                                            </Dialog>
                                    </AccordionDetails> 
                                    <AccordionActions style={{justifyContent:'center'}}>
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            onClick={() =>{
                                                this.setState({
                                                    poiMode: false,
                                                    zoneMode: false,
                                                    mapKey: this.state.mapKey+1,
                                                    mapEditMode: false,
                                                    clusterMode: false,
                                                    showDataTable: false
                                                }, this.activateMap)
                                            }}
                                        >Show Data</Button>
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            onClick={() =>{
                                                if(this.state.poiValue){
                                                    this.setState({
                                                        poiMode: true,
                                                        zoneMode: false,
                                                        mapEditMode: false,
                                                        clusterMode: false,
                                                        showDataTable: false,
                                                        mapKey: this.state.mapKey+1
                                                    }, this.activateMap)
                                                }
                                            }}
                                        >Show POI</Button>
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            onClick={() => {
                                                if(this.state.poiValue){
                                                    this.setState({
                                                        showPOIMapPreview:true,
                                                    })
                                                }
                                            }}
                                        >Preview</Button>
                                    </AccordionActions> 
                                </Accordion>

                                <Accordion>
                                    <AccordionSummary
                                      expandIcon={<ExpandMoreIcon />}
                                      aria-controls="panel2a-content"
                                      id="panel2a-header"
                                    >
                                      <Typography component='h3' variant='h3'><strong>Zones</strong></Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <FormControl variant="outlined" style={{width:'100%'}}>
                                            <InputLabel>Select a Zone</InputLabel>
                                            <Select
                                                aria-label="names" 
                                                name="names"
                                                value={this.state.zoneValue}
                                                onChange={this.handleZoneChange}
                                                label="names"
                                            >
                                                {this.state.selectedCaseZoneData.map((zone)=>{
                                                    return(
                                                        <MenuItem value={zone.name}>{zone.name}</MenuItem>
                                                    )
                                                })}
                                            </Select>
                                        </FormControl>
                                        <Dialog
                                            aria-labelledby='customized-dialog-title'
                                            classes={{
                                                paper: classes.container,
                                            }}
                                            open={this.state.showZoneMapPreview}
                                            onClose={
                                                () => this.resetToDefault()
                                            }> 
                                                <AppBar position='static' style={{ backgroundColor: '#18202c' }}>
                                                    <Toolbar>
                                                        <Grid
                                                            justify='space-between'
                                                            container
                                                        >
                                                            <Grid item>
                                                                <Typography
                                                                    variant='h5'
                                                                    color='inherit'
                                                                    className={classes.title}
                                                                >
                                                                    Preview Zone
                                                                    </Typography>
                                                            </Grid>
                                                            <Grid item>
                                                                <IconButton
                                                                    aria-label='close'
                                                                    className={classes.closeButton}
                                                                    onClick={() => this.setState({ showZoneMapPreview: !this.state.showZoneMapPreview })}
                                                                    color='inherit'
                                                                >
                                                                    <Close />
                                                                </IconButton>
                                                            </Grid>
                                                        </Grid>
                                                    </Toolbar>
                                                </AppBar>
                                                <DialogContent style={{marginLeft:'-1.25rem',marginTop:'-0.5rem'}}>    
                                                    <ZoneMapPreview coordinates={this.state.coordinatesZoneDataPreview} /> 
                                                </DialogContent>                                           
                                            </Dialog>
                                    </AccordionDetails>
                                    <AccordionActions style={{justifyContent:'center'}}>
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            onClick={() =>{
                                                this.setState({
                                                    poiMode: false,
                                                    zoneMode: false,
                                                    mapEditMode: false,
                                                    clusterMode: false,
                                                    showDataTable: false,
                                                    mapKey: this.state.mapKey+1
                                                }, this.activateMap)
                                            }}
                                        >Show Data</Button>
                                        <Button 
                                        variant="contained" 
                                        color="primary" 
                                        onClick={() =>{
                                            if(this.state.zoneValue){
                                                this.setState({
                                                    poiMode: false,
                                                    zoneMode: true,
                                                    mapEditMode: false,
                                                    clusterMode: false,
                                                    showDataTable: false,
                                                    mapKey: this.state.mapKey+1
                                                }, this.activateMap)   
                                            }
                                        }}
                                    >Show Zone</Button>
                                   <Button 
                                        variant="contained" 
                                        color="primary" 
                                        onClick={() => {
                                            if(this.state.zoneValue){
                                                this.setState({
                                                    showZoneMapPreview :true,
                                                })
                                            }
                                        }}    
                                    >Preview</Button>
                                    </AccordionActions>
                                </Accordion>
                            </div>
                            : <div />
                    }

                    {
                        rightDrawerOpen ?
                            <div />
                            :
                            <div style={{
                                textAlign: 'center',
                                marginTop: window.innerHeight / 7,
                                paddingBottom: window.innerHeight / 5.8,
                                height: window.innerHeight*1.1,
                                cursor: 'pointer'
                            }}>
                                <span
                                    style={{ fontSize: 27, textAlign: 'center', height: window.innerHeight*1.1,color:'white'
                                    }}
                                    onClick={() => this.setState({ rightDrawerOpen: !rightDrawerOpen })}
                                >
                                    W<br />
                                    I<br />
                                    D<br />
                                    G<br />
                                    E<br />
                                    T<br />
                                    S<br />
                                </span>
                            </div>
                    }

                </Paper>
            </div>
        );
    }

    activateMap(){
        this.setState({ activeWidget: 'Map' })
        this.getMarkersFromRowData(this.state.selectedRowData);
    }

    resetMapToolsData(){
        this.setState({
            mapEditToolsData:{
                spData: null,
                coordinatesData: null,
                lengthData: null,
                areaData: null
            },
            zoom: null,
            currentCenter: null
        })
    }

    getWidgetsListComponent() {
        const {
            classes
        } = this.props;

        return (
            <Grid container spacing={7}>
                <Grid item md={2} className={classes.widgetListItem}>
                    <IconButton onClick={() => this.setState({ 
                        activeWidget: 'Table', 
                        featureMode: false, 
                        showDataTable: true }, () => {
                        this.resetMapToolsData();
                    })}>
                        <TableChart />
                    </IconButton>
                    <br />
                    <span>Table</span>
                </Grid>
                {(this.state.targetWidgetStatus) && (
                <Grid item md={2} className={classes.widgetListItem}>
                    <IconButton onClick={() => this.setState({ 
                        activeWidget: 'Handset', 
                        featureMode: false,
                        showDataTable: false }, () => {
                            this.resetMapToolsData();
                        })}>
                        <Timeline />
                    </IconButton>
                    <br />
                    <span> Handset History</span>
                </Grid>
                )}
                {(this.state.targetWidgetStatus) && (
                <Grid item md={2} className={classes.widgetListItem}>
                    <IconButton onClick={() => this.setState({ 
                        activeWidget: 'Linktree',
                        featureMode: false, 
                        showDataTable: false }, () => {
                            this.resetMapToolsData();
                        }) }>
                        <People />
                    </IconButton>
                    <br />
                    <span>Linktree</span>
                </Grid>
                )}
                {(this.state.targetWidgetStatus) && (
                <Grid item md={2} className={classes.widgetListItem}>
                    <IconButton onClick={() => this.setState({ 
                        activeWidget: 'PivotTable',
                        featureMode: false, 
                        showDataTable: false }, () => {
                            this.resetMapToolsData();
                         })}>
                        <ViewCompactIcon/>
                    </IconButton>
                    <br />
                    <span>Pivot Table</span>
                </Grid>
                )}
                {(this.state.targetWidgetStatus) && (
                <Grid item md={2} className={classes.widgetListItem}>
                    <IconButton onClick={() => this.setState({ mapEditMode: true, featureMode: 'shortestPath', poiMode: false, zoneMode: false, showDataTable: false, clusterMode: false, mapKey: this.state.mapKey+1 }, () => {this.activateMap(); this.resetMapToolsData();})}>
                        <Map />
                    </IconButton>
                    <br />
                    <span>Map</span>
                </Grid>
                )}
                {this.state.locationWidgetStatus && (
                <Grid item md={2} className={classes.widgetListItem}>
                    <IconButton onClick={() => {
                        this.resetMapToolsData();
                        this.fetchClusterData(this.state.selectedRowData);
                    }}>
                        <EditLocationIcon/>
                    </IconButton>
                    <br />
                    <span>Cluster</span>
                </Grid>
                )}
                {this.state.locationWidgetStatus && (
                <Grid item md={2} className={classes.widgetListItem}>
                    <IconButton onClick={() => {
                        let newJob = this.state.newJob;
                        newJob.category = 'Location';
                        this.setState({ mapKey: this.state.mapKey+1, featureMode: false, showDataTable: false, activeWidget: 'CompareGeoFence_Select', compareLoader: false,  newJob: newJob }, ()=>{this.resetMapToolsData();})
                    }}>
                        <CompareIcon/>
                    </IconButton>
                    <br />
                    <span>Compare Geo Fence</span>
                </Grid>
                )}
            </Grid>
        );
    }

    async componentDidMount() {

        await this.getAllCdrColumns();
        await this.getDefaultCase();
        await this.getPOIs(this.state.selectedCase);
        await this.fetchZones(this.state.selectedCase);
        await this.getMainContent();
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
                startTime: new Date(),
                endTime: new Date(),
                query: '',
            }
        });
    }


    async getAllCdrColumns() {
        try {
           let response = await getCdrColumns();
            response = response.filter(col => !hiddenFields.includes(col))
            response = response.filter((name) => {
                return name !== 'timestamp'
            });
            response = ['timestampdate', 'timestamptime', 'answerdate', 'releasedate', ...response ];
            this.setState({ allCdrColumns: response });
        } catch (error) {
            console.log(error);
        }
    }

    async getPOIs(selectedCase) {
        try {
            let response = await getPois();
            response=response.filter((poiData,index)=> poiData.cases.includes(selectedCase['id']))
            this.setState({ selectedCasePOIData: response });
        } catch (error) {
            console.log(error);
        }
    }

    async fetchZones(selectedCase) {
        try {
            let response = await getZones();
            response=response.filter((zoneData,index)=> zoneData.cases.includes(selectedCase['id']))
            this.setState({ selectedCaseZoneData: response });
        } catch (error) {
            console.log(error);
        }
    }

    async getDefaultCase() {
        try {
            let response = await getAllCases();
            response.every(async (caseItem, index) => {
                let caseName = caseItem['name'];
                if (caseName === DEFAULT_CASE_CHECK_OT) {
                    this.setState({ selectedCase: caseItem });
                    await this.fetchJobsForCase(caseItem);
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
            response = response.filter((jobItem, index) => jobItem['status'] === 'FINISHED');
            response.sort(function(a, b){return b.id - a.id});
            let selectedCaseLocationJobList = response.filter((jobItem, index) => jobItem['category'] === 'Location');
            
            if(!this.state.selectedJob && response.length) this.fetchCdrForJob(response[0]);

            this.setState({
                selectedCaseJobsList: response,
                selectedJob: this.state.selectedJob? this.state.selectedJob : response[0],
                selectedCaseLocationJobList: selectedCaseLocationJobList
            });

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
    async onCreateJobButtonPress() {
        try {
            let payload = this.state.newJob;
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
            payload['startTime'] = payload['startTime']*1000;
            payload['endTime'] = payload['endTime']*1000;
            payload['case'] = this.state.selectedCase['id'];
            let response = await addJob(payload);
            this.resetToDefault();
            this.setState({ jobsExpansionOpen: false});
            this.fetchJobsForCase(this.state.selectedCase);
        } catch (error) {
            console.log(error);
        }
    }
    async fetchCdrForJob(selectedJob) {

        let selectedJobCdrList = [];
        let widgetStatus;
        if (selectedJob){
            widgetStatus = (selectedJob.category === 'Location' || selectedJob.category === 'LAC/Cell-ID')
        }else{
            widgetStatus = false
        }

        this.setState({
            selectedJob: selectedJob, 
            loaderStatus: true,
            locationWidgetStatus: widgetStatus,
            targetWidgetStatus: !widgetStatus,
            selectedJobCdrId: selectedJob.id,
            selectedJobCdrList: []
        })

        try {

            let response = await getCdrForJob(selectedJob.id);
            let currentPage = response['current'];
            let totalPages = response['total_pages'];
            let results = response['results'];
            
            selectedJobCdrList = selectedJobCdrList.concat(results);
            
            if (currentPage < totalPages) {
                for (let i = currentPage + 1; i <= totalPages; i++) {
                    response = await getCdrForJob(selectedJob.id, i);
                    results = response['results'];
                    selectedJobCdrList = selectedJobCdrList.concat(results);
                    if(selectedJobCdrList.length >= 500) break;
                }
            }
            selectedJobCdrList.forEach(cdr => {
                cdr.timestampdate = cdr.timestamp ? moment.unix(cdr.timestamp/1000).format("DD/MM/YYYY") : 0;
                cdr.timestamptime = cdr.timestamp ? moment.unix(cdr.timestamp/1000).format("HH:mm") : 0;
                cdr.answerdate = cdr.answertime ? moment.unix(cdr.answertime/1000).format('DD/MM/YYYY') : 0;
                cdr.answertime = cdr.answertime ? moment.unix(cdr.answertime/1000).format('HH:mm') : 0;
                cdr.releasedate = cdr.releasetime ? moment.unix(cdr.releasetime/1000).format('DD/MM/YYYY') : 0;
                cdr.releasetime = cdr.releasetime ? moment.unix(cdr.releasetime/1000).format('HH:mm') : 0;
                cdr.callduration = cdr.callduration ? moment.duration(cdr.callduration, 'seconds').format('HH:mm:ss', { trim: false }) : '00:00:00';
             });
             delete selectedJobCdrList['timestamp'];
             selectedJobCdrList.filter((cdr) => (cdr.callednumber !== 0 && cdr.callingnumber !== 0));

             if(selectedJob.id === this.state.selectedJobCdrId){
                this.setState({ selectedJobCdrList: selectedJobCdrList, loaderStatus: false });
            }else{
                this.setState({ loaderStatus: false,});
            }
            
        } catch (error) {
            console.log(error);
            this.setState({ 
                alertType: 'error',
                alertTitle: 'Error',
                alertMessage: `${error}`,
                alertOpen: true,
                loaderStatus: false
            });
        }
    }

    async fetchCdrForLocationJob(selectedJob) {
        let selectedJobCdrList = [];

        try {
            let response = await getCdrForLocation(selectedJob.id);
            
            let currentPage = response['current'];
            let totalPages = response['total_pages'];
            let results = response['results'];
            
            selectedJobCdrList = selectedJobCdrList.concat(results);
            
            if (currentPage < totalPages) {
                for (let i = currentPage + 1; i <= totalPages; i++) {
                    response = await getCdrForLocation(selectedJob.id, i);
                    results = response['results'];
                    selectedJobCdrList = selectedJobCdrList.concat(results);
                    if(selectedJobCdrList.length >= 500) break;
                }
            }

            let selectedJobCdrList_Id = selectedJobCdrList.map((cdr) => cdr.id )
            selectedJob.cdr = selectedJobCdrList_Id;
            let selectedCompareGeoFenceJob = [...this.state.selectedCompareGeoFenceJob]
            selectedCompareGeoFenceJob.push(selectedJob);
            this.setState({selectedCompareGeoFenceJob: selectedCompareGeoFenceJob});

            return selectedJob

        } catch (error) {
            console.log(error);
        }
    }

    async fetchClusterData(selectedData){
        let response = [];
        if(selectedData.length){
            this.setState({
                clusterLoaderStatus: true
            })
            try{
                let locationData = selectedData.map((data) => [data.locationlat, data.locationlon]);
                response = await getClusterData(this.state.clusterType, locationData);
            }catch(error){
                console.log(error)
                this.setState({
                    alertType: 'error',
                    alertTitle: 'Cluster',
                    alertMessage: `${error}`,
                    alertOpen: true,
                })
            }
        }
        this.setState({
            activeWidget: 'Cluster',
            clusterData: response,
            showDataTable: false,
            clusterLoaderStatus: false,
            mapKey: this.state.mapKey+1,
        })
    }

    async fetchCompareGeoFenceData(){
        let selectedCaseLocationJobCdrList = this.state.selectedCaseLocationJobCdrList;
        
        if(selectedCaseLocationJobCdrList.length === 2){
            let response = [];
            this.setState({ compareLoader: true })

            try{
                let response = await getCdrComparision(selectedCaseLocationJobCdrList[0].id, selectedCaseLocationJobCdrList[1].id);
            }catch(error){
                console.log(error)
                this.setState({
                    alertType: 'error',
                    alertTitle: 'Compare Geo Fence',
                    alertMessage: `${error}`,
                    alertOpen: true,
                })
            }
            if(this.state.activeWidget === 'CompareGeoFence_Select'){
                this.setState({
                    activeWidget: 'CompareGeoFence_Compare', 
                    compareGeoFenceMode: true,
                    compareGeoFenceData: response,
                    showDataTable: false,
                    mapKey: this.state.mapKey+1,
                    compareLoader: false
                })
            }else{
                this.setState({
                    compareLoader: false
                })
            }
        }else{
            let message = 'Please select two jobs';

            if(selectedCaseLocationJobCdrList.length > 2) message = 'Please select only 2 jobs';

            this.setState({
                alertType: 'error',
                alertTitle: 'Compare Geo Fence',
                alertMessage: message,
                alertOpen: true,
                compareLoader: false,
            });
        }
    }

    async fetchCellSites(){
        try{
            let { operator, lat1, lat2, lon1, lon2 } = this.state.cellSitesDetails;
            let response = await getCellSites(operator, lat1, lat2, lon1, lon2);
            this.setState({
                mapKey: this.state.mapKey+1,
                cellSites: response
            })
        }catch(error){
            console.log(error);
        }
    }
};

export default withStyles(styles)(Reports);
