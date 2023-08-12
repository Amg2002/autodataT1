/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import {
        Button,
        AppBar,
        Toolbar,
        Dialog,
        DialogContent,
        Grid,
        TextField,
        Typography,
        withStyles,
        IconButton,
        Paper
} from '@material-ui/core';
import {
        Add,
        AddBox,
        ArrowDownward,
        Check,
        ChevronLeft,
        ChevronRight,
        Clear, 
        Close,
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
import VisibilityIcon from '@material-ui/icons/Visibility';
import { Autocomplete } from '@material-ui/lab';
import MaterialTable from "material-table";
import React, { forwardRef } from 'react';

// Local
import { FONT_SIZE, HEADER_FONT_SIZE } from '../../../config';
import MapBoxMaps from "./MapBoxMaps";
import MapBoxMapsPreview from "./MapBoxMapsPreview";
import AlertCard from '../../../components/alert-card/alert-card.component';
import { addZone, deleteZone, editZone, getAllCases, getZones } from '../../../util/network';


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
        ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
        VisibilityIcon: forwardRef((props, ref) => <VisibilityIcon {...props} ref={ref} />)
};


const styles = (theme) => ({
        chip: {
                margin: theme.spacing(0.5),
                fontSize: FONT_SIZE
        },
        drawerPaper: {
                width: '40%',
                align: 'center',
                fontSize: FONT_SIZE
        },
        container: {
                width: '40%',
                height: '60%',
                align: 'center',
                fontSize: FONT_SIZE
        },
        title: {
                padding: 10,
        },
        field:{
                fontSize: FONT_SIZE
        }
});

class Zones extends React.Component {
        constructor(props) {
                super(props);
                this.getDrawer = this.getDrawer.bind(this);
                this.getCases = this.getCases.bind(this);
                this.resetToDefault = this.resetToDefault.bind(this);
                this.onCreateOrEditButtonPress = this.onCreateOrEditButtonPress.bind(this);
                this.onDeleteButtonPress = this.onDeleteButtonPress.bind(this);
                this.updateCoordinates = this.updateCoordinates.bind(this);
                this.fetchZones = this.fetchZones.bind(this);
                this.onClose = this.onClose.bind(this);
        }

        state = {
                currentAccount: this.props.currentAccount,
                drawerOpen: false,
                showMapPreview: false,
                editMode: false,
                editableItem: {
                        name: '',
                        description: '',
                        lat1: '',
                        lng1: '',
                        lat2: '',
                        lng2: '',
                        cases: [],
                        area: 0,
                },
                tableData: [],
                casesObject: [],
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
                alertOpen: false,
                alertType: '',
                alertTitle: '',
                alertMessage: '',
        }

        onClose(){
                this.setState({
                        alertOpen: false
                })
        }
        render() {
                const {
                        classes
                } = this.props;

                return (
                        <div >
                                {this.state.alertOpen && 
                                (<AlertCard 
                                        onClose={this.onClose} 
                                        type={this.state.alertType} 
                                        title={this.state.alertTitle} 
                                        message={this.state.alertMessage} 
                                />)
                                } 
                                {this.state.drawerOpen
                                        ? <div>
                                                <Grid container>
                                                        <Grid item md={3}>
                                                                {this.getDrawer()}
                                                        </Grid>
                                                        <Grid item md={9} >
                                                                <MapBoxMaps updateCoordinates={this.updateCoordinates} />
                                                        </Grid>
                                                </Grid>
                                        </div>
                                        : <div>
                                                <Grid container>
                                                        {(this.state.currentAccount.modules.caseot.addzone || this.state.currentAccount.designation === 'Admin') ? (
                                                        <Grid item style={{ width: "4%", backgroundColor: '#18202c' }}>
                                                                {this.getDrawer()}
                                                        </Grid>
                                                        ) : null }
                                                        <Grid item style={{ padding: 16, width: '94%' }} >
                                                                <MaterialTable
                                                                        icons={tableIcons}

                                                                        components={{
                                                                                Container: props => <Paper {...props} elevation={0} />
                                                                        }}
                                                                        options={{
                                                                                actionsColumnIndex: -1,
                                                                                paging: false,
                                                                                grouping: true,
                                                                                rowStyle:{
                                                                                        fontStyle: FONT_SIZE,
                                                                                },
                                                                                headerStyle:{
                                                                                        fontStyle: HEADER_FONT_SIZE
                                                                                }
                                                                        }}
                                                                        columns={[
                                                                                { title: "ID", field: "id", type: "numeric", align: "left", width: 16 },
                                                                                { title: "Zone", field: "name" },
                                                                                { title: "Zone Description", field: "description" },
                                                                                { title: "Lat1,Lng1", field: "lat1" },
                                                                                { title: "Lat2,Lng2", field: "lng1" },
                                                                                { title: "Lat3,Lng3", field: "lat2" },
                                                                                { title: "Lat4,Lng4", field: "lng2" },
                                                                        ]}
                                                                        data={this.state.tableData}
                                                                        title='Zones List'
                                                                        actions={[
                                                                                {
                                                                                        icon: () => <VisibilityIcon />,
                                                                                        tooltip: 'Preview Zone',
                                                                                        onClick: (event, rowData) => {
                                                                                                // Do edit operation
                                                                                                this.setState({ showMapPreview: true })
                                                                                                this.updateCoordinates(rowData.lat1, rowData.lng1, rowData.lat2, rowData.lng2)
                                                                                        },
                                                                                },
                                                                                {
                                                                                        icon: () => <Edit />,
                                                                                        tooltip: 'Edit Zone',
                                                                                        onClick: (event, rowData) => {
                                                                                                let cases = [];
                                                                                                for(let i=0; i<this.state.casesObject.length; i++){
                                                                                                        if(rowData.cases.includes(this.state.casesObject[i].id)){
                                                                                                                cases.push(this.state.casesObject[i])
                                                                                                        }
                                                                                                }
                                                                                                // Do edit operation
                                                                                                this.setState({
                                                                                                        drawerOpen: true,
                                                                                                        editableItem: {
                                                                                                                ...rowData,
                                                                                                                cases: cases
                                                                                                        },
                                                                                                        editMode: true
                                                                                                });
                                                                                        },
                                                                                },
                                                                                {
                                                                                        icon: () => <Delete color='error' />,
                                                                                        tooltip: 'Delete Zone',
                                                                                        onClick: (event, rowData) => {
                                                                                                // Do Delete operation
                                                                                                this.onDeleteButtonPress(rowData);
                                                                                        },
                                                                                },
                                                                        ]}
                                                                />
                                                        </Grid>
                                                </Grid>
                                                <Dialog
                                                        aria-labelledby='customized-dialog-title'
                                                        classes={{
                                                                paper: classes.container,
                                                        }}
                                                        open={this.state.showMapPreview}
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
                                                                                                variant='h6'
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
                                                                                                onClick={this.resetToDefault}
                                                                                                color='inherit'
                                                                                        >
                                                                                                <Close />
                                                                                        </IconButton>
                                                                                </Grid>
                                                                        </Grid>
                                                                </Toolbar>
                                                        </AppBar>
                                                        <DialogContent style={{ marginLeft: '-1.25rem', marginTop: '-0.5rem' }}>
                                                                <MapBoxMapsPreview points={this.state.previewPane} />
                                                        </DialogContent>
                                                </Dialog>
                                        </div>
                                }



                        </div >
                );
        }

        updateCoordinates = (lat1, lng1, lat2, lng2) => {
                var previewA = lat1.split(',');
                var previewB = lng1.split(',');
                var previewC = lat2.split(',');
                var previewD = lng2.split(',');
                var arr1 = [], arr2 = [], arr3 = [], arr4 = [], arr5 = [], arrF = [], arrFinal = [];
                for (var i = 0; i < previewA.length; i++) {
                        arr1.push(parseFloat(previewA[i]))
                }
                for ( i = 0; i < previewB.length; i++) {
                        arr2.push(parseFloat(previewB[i]))
                }
                for ( i = 0; i < previewC.length; i++) {
                        arr3.push(parseFloat(previewC[i]))
                }
                for ( i = 0; i < previewD.length; i++) {
                        arr4.push(parseFloat(previewD[i]))
                }
                for ( i = 0; i < previewA.length; i++) {
                        arr5.push(parseFloat(previewA[i]))
                }
                arrF.push(arr1);
                arrF.push(arr2);
                arrF.push(arr3);
                arrF.push(arr4);
                arrF.push(arr5);
                arrFinal.push(arrF);

                this.setState({
                        editableItem: { ...this.state.editableItem, lat1: lat1, lat2: lat2, lng1: lng1, lng2: lng2 },
                        previewPane: arrFinal,
                });

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
        };

        changeMode() {
                this.state.drawerOpen === true ? this.setState({ editMode: false, drawerOpen: false }) : this.setState({ drawerOpen: true })

        }

        getDrawer() {
                const {
                        classes
                } = this.props;

                return (<div>
                        <Paper
                                elevation={4}
                                style={this.state.drawerOpen === false ? { backgroundColor: '#18202c' } : { backgroundColor: '#ffffff' }}
                        >

                                <div style={{ textAlign: 'right', backgroundColor: '#18202c' }}>
                                        <IconButton
                                                onClick={() => this.changeMode()}
                                        >
                                                {this.state.drawerOpen ? <ChevronLeft fontSize="large" style={{ color: 'white' }} /> : <ChevronRight fontSize="large" style={{ color: 'white' }} />}
                                        </IconButton>
                                </div>
                                {this.state.drawerOpen
                                        ? <div>
                                                <Typography component='h2' variant='h2' style={{ marginBottom: 32, marginLeft: 16 }}>
                                                        {this.state.editMode ? 'Edit Zone' : 'Add Zone'}
                                                </Typography>
                                                <form onSubmit={(e) => {
                                                        e.preventDefault();
                                                        this.onCreateOrEditButtonPress();
                                                }}>
                                                <TextField
                                                        label='Zone Name'
                                                        InputProps={{
                                                                classes: {
                                                                        input: classes.field,
                                                                }
                                                        }}
                                                        InputLabelProps={{classes: {
                                                                input: classes.field,
                                                        }}}
                                                        required
                                                        style={{ minWidth: '80%', marginLeft: 16 }}
                                                        value={this.state.editableItem.name}
                                                        onChange={event => this.setState({ editableItem: { ...this.state.editableItem, name: event.target.value } })}
                                                />

                                                <TextField
                                                        label=' Zone Description'
                                                        InputProps={{
                                                                classes: {
                                                                        input: classes.field,
                                                                }
                                                        }}
                                                        InputLabelProps={{classes: {
                                                                input: classes.field,
                                                        }}}
                                                        multiline
                                                        required
                                                        style={{ marginTop: 16, minWidth: '80%', marginLeft: 16 }}
                                                        value={this.state.editableItem.description}
                                                        onChange={event => this.setState({ editableItem: { ...this.state.editableItem, description: event.target.value } })}
                                                />
                                                <TextField
                                                        label='Lat1,Lng1'
                                                        InputProps={{
                                                                classes: {
                                                                        input: classes.field,
                                                                }
                                                        }}
                                                        InputLabelProps={{classes: {
                                                                input: classes.field,
                                                        }}}
                                                        multiline
                                                        required
                                                        style={{ marginTop: 16, minWidth: '80%', marginLeft: 16 }}
                                                        defaultValue={this.state.editableItem.lat1}
                                                        value={this.state.editableItem.lat1}
                                                        onChange={event => this.setState({ editableItem: { ...this.state.editableItem, lat1: event.target.value } })}
                                                />
                                                <TextField
                                                        label='Lat2,Lng2'
                                                        InputProps={{
                                                                classes: {
                                                                        input: classes.field,
                                                                }
                                                        }}
                                                        InputLabelProps={{classes: {
                                                                input: classes.field,
                                                        }}}
                                                        multiline
                                                        required
                                                        style={{ marginTop: 16, minWidth: '80%', marginLeft: 16 }}
                                                        defaultValue={this.state.editableItem.lng1}
                                                        value={this.state.editableItem.lng1}
                                                        onChange={event => this.setState({ editableItem: { ...this.state.editableItem, lng1: event.target.value } })}
                                                />
                                                <TextField
                                                        label='Lat3,Lng3'
                                                        InputProps={{
                                                                classes: {
                                                                        input: classes.field,
                                                                }
                                                        }}
                                                        InputLabelProps={{classes: {
                                                                input: classes.field,
                                                        }}}
                                                        multiline
                                                        required
                                                        style={{ marginTop: 16, minWidth: '80%', marginLeft: 16 }}
                                                        defaultValue={this.state.editableItem.lat2}
                                                        value={this.state.editableItem.lat2}
                                                        onChange={event => this.setState({ editableItem: { ...this.state.editableItem, lat2: event.target.value } })}
                                                />
                                                <TextField
                                                        label='Lat4,Lng4'
                                                        InputProps={{
                                                                classes: {
                                                                        input: classes.field,
                                                                }
                                                        }}
                                                        InputLabelProps={{classes: {
                                                                input: classes.field,
                                                        }}}
                                                        multiline
                                                        required
                                                        style={{ marginTop: 16, minWidth: '80%', marginLeft: 16 }}
                                                        defaultValue={this.state.editableItem.lng2}
                                                        value={this.state.editableItem.lng2}
                                                        onChange={event => this.setState({ editableItem: { ...this.state.editableItem, lng2: event.target.value } })}
                                                />
                                                <Autocomplete
                                                        style={{ marginTop: 16, minWidth: '60%', maxWidth:'80%', paddingLeft: '16px'}}
                                                        multiple
                                                        options={this.state.casesObject}
                                                        getOptionLabel={(option) => option['name']}
                                                        value={this.state.editableItem.cases}
                                                        onChange={(event,value) =>
                                                                this.setState({
                                                                        editableItem: {
                                                                                ...this.state.editableItem,
                                                                               cases: value,
                                                                        },
                                                                })
                                                        } renderInput={(params) => (
                                                                <TextField
                                                                        {...params}
                                                                        variant="standard"
                                                                        label="Cases"
                                                                />
                                                        )}
                                                />
                                                
                                                <Button
                                                        type='submit'
                                                        variant="contained"
                                                        color="primary"
                                                        fullWidth
                                                        style={{ marginTop: 32 }}
                                                        startIcon={this.state.editMode ? <Edit /> : <Add />}
                                                        //onClick={this.onCreateOrEditButtonPress}
                                                >
                                                        {this.state.editMode ? 'Update' : 'Create'}
                                                </Button>
                                                </form>
                                        </div>
                                        : <Grid container>
                                                <Grid item md={11}  style={{
                                                textAlign: 'center',
                                                width: '4%',
                                                height: window.innerHeight,
                                                backgroundColor: '#18202c',
                                                marginRight: '3%',
                                                cursor: 'pointer'
                                        }}
                                        >
                                                <span
                                                        style={{ fontSize: 21, color: 'white' }}
                                                        onClick={() => this.setState({ drawerOpen: !this.state.drawerOpen })}
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
                                                        Z<br />
                                                        O<br />
                                                        N<br />
                                                        E<br />
                                                </span>
                                        </Grid>
                                        </Grid>
                                }

                        </Paper>
                </div>
                );
        }

        componentDidMount() {
                this.getCases();
                this.fetchZones();

        }
        componentDidUpdate(){
                if(this.state.alertOpen){
                  setTimeout(() => this.setState({alertOpen:false}), 5000);
                }
        }
        async getCases() {
                try {
                        let response = await getAllCases();
                        //response = response.filter((caseItem, index) => caseItem['name'] !== DEFAULT_CASE_CHECK_OT);
                        this.setState({
                                casesObject: response,
                        });
                } catch (error) {
                        console.log(error);
                }
        }
        async fetchZones() {
                try {
                        let response = await getZones();
                        this.setState({ tableData: response });
                } catch (error) {
                        console.log(error);
                }
        }


        resetToDefault() {
                this.setState({
                        drawerOpen: false,
                        editMode: false,
                        showMapPreview: false,
                        editableItem: {
                                name: '',
                                description: '',
                                lat1: '',
                                lng1: '',
                                lat2: '',
                                lng2: '',
                                cases: [],
                                area: 0,
                        },
                });
        }

        async onCreateOrEditButtonPress() {
                try {
                        let payload = this.state.editableItem;
                        let message; 

                        let casesObjectsList = payload.cases;
                        let casesNames = [];
                        casesObjectsList.filter(caseObject => {
                                casesNames.push(caseObject['id']);
            
                        });
                        payload.cases = casesNames;
                        payload.area = 0;
                        if (this.state.editMode) {
                                let response = await editZone(payload.id, payload);
                                message='Zone Updated Successfully';
                        }
                        else {
                                let response = await addZone(payload);
                                message='Zone Added Successfully';
                        }
                        this.setState({
                                alertType: 'success',
                                alertTitle: 'Zones',
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
                        let response = await deleteZone(rowData.id);
                        this.resetToDefault();
                        this.componentDidMount();
                        this.setState({
                                alertType: 'success',
                                alertTitle: 'Zones',
                                alertMessage: 'Zone Deleted Successfully',
                                alertOpen: true,
                        });
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
};

export default withStyles(styles)(Zones);