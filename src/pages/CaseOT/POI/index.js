/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable react/no-direct-mutation-state */
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
        ViewColumn
} from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import VisibilityIcon from '@material-ui/icons/Visibility';
import MaterialTable from "material-table";
import React, { forwardRef } from 'react';
// Local
import { FONT_SIZE, HEADER_FONT_SIZE} from '../../../config';
import MapContainer from '../Map.js'
import POIMapPreview from './POIMapPreview.js'
import AlertCard from '../../../components/alert-card/alert-card.component';
import { addPoi, editPoi, deletePoi, getPois, getAllCases } from '../../../util/network';

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
                fontSize: FONT_SIZE
                // width: drawerWidth,
                // flexShrink: 0,
        },
        drawerPaper: {
                width: '40%',
                align: 'center',
                fontSize: FONT_SIZE
        },
         container:{
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

class POI extends React.Component {
        constructor(props) {
                super(props);
                this.getDrawer = this.getDrawer.bind(this);
                this.getCases = this.getCases.bind(this);
                this.resetToDefault = this.resetToDefault.bind(this);
                this.onCreateOrEditButtonPress = this.onCreateOrEditButtonPress.bind(this);
                this.onDeleteButtonPress = this.onDeleteButtonPress.bind(this);
                this.getPOIs = this.getPOIs.bind(this);
                this.onClose = this.onClose.bind(this);
        }

        state = {
                currentAccount: this.props.currentAccount,
                drawerOpen: false,
                editMode: false,
                showMapPreview:false,
                editableItem: {
                        name: '',
                        description: '',
                        lat: '',
                        lng: '',
                        cases:[],
                        area: '',
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
                mapPosition:{
                        lat: 9.58817943397567,
                        lng: 8.016038970947266
                },
                alertType: '',
                alertTitle: '',
                alertMessage: '',
                alertOpen: false
        };

onClose(){
        this.setState({
                alertOpen: false
        })
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

        render() {
                const {
                        classes
                } = this.props;

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
                             { this.state.drawerOpen
                                    ?<div>
                                    <Grid container>
                                      <Grid item md={3}>
                                        {this.getDrawer()}
                                      </Grid> 
                                      <Grid item md={9} >
                                         <div styles={{marginLeft: 16}}>
                                            <MapContainer
                                                mapPosition={this.state.mapPosition}
                                                markers={this.state.markers} 
                                                onMarkerDragEnd={this.onMarkerDragEnd} 
                                                onPlaceSelected={this.onPlaceSelected}
                                            />
                                         </div> 
                                      </Grid>
                                      </Grid>
                                     </div>  
                                    :<div>
                                    <Grid container>
                                        {(this.state.currentAccount.modules.caseot.addpoi || this.state.currentAccount.designation === 'Admin') ? (
                                      <Grid item style={{width:"4%" ,backgroundColor:'#18202c' }}>
                                        {this.getDrawer()}
                                      </Grid>
                                        ) : null }
                                      <Grid item style={{padding:16,width:'94%'}} >
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
                                                                    fontSize: FONT_SIZE
                                                            },
                                                            headerStyle:{
                                                                    fontSize: HEADER_FONT_SIZE
                                                            }
                                                    }}
                                                    columns={[
                                                            { title: "ID", field: "id", type: "numeric", align: "left", width: 16 },
                                                            { title: "POI", field: "name" },
                                                            { title: "POI Description", field: "description" },
                                                            { title: "POILat1", field: "lat" },
                                                            { title: "POILong1", field: "lng" },
                                                    ]}
                                                    data={this.state.tableData}
                                                    title='POIs List'
                                                    actions={[
                                                            {
                                                                    icon: () => <VisibilityIcon />,
                                                                    tooltip: 'Preview Zone',
                                                                    onClick: (event,rowData) => {
                                                                            // Do edit operation
                                                                            this.setState({showMapPreview:true,
                                                                                 markers: [
                                                                                      {
                                                                                        name: rowData.name,
                                                                                        position: {
                                                                                          lat: rowData.lat,
                                                                                          lng: rowData.lng
                                                                                        }
                                                                                      },
                                                                                    ]
                                                                            })
                                                                           
                                                                    },
                                                            },
                                                            {
                                                                    icon: () => <Edit />,
                                                                    tooltip: 'Edit POI',
                                                                    onClick: (event, rowData) => {
                                                                            // Do edit operation
                                                                            let cases = [];
                                                                            for(let i=0; i<this.state.casesObject.length; i++){
                                                                                    if(rowData.cases.includes(this.state.casesObject[i].id)){
                                                                                            cases.push(this.state.casesObject[i])
                                                                                        }
                                                                            }
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
                                                                    tooltip: 'Delete POI',
                                                                    onClick: (event, rowData) => {
                                                                            // Do Delete operation
                                                                            this.onDeleteButtonPress(rowData);
                                                                    },
                                                            }
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
                                                                variant='h3'
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
                                                                onClick={this.resetToDefault}
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
                                    </div >
                        }
                      </div>
                );
        }

        changeMode(){
            this.state.drawerOpen===true?this.setState({editMode:false,drawerOpen:false}): this.setState({drawerOpen: true})
            
        }

        getDrawer() {
                const {
                        classes
                } = this.props;
                return (
                       <div>     
                               <Paper
                                    className={classes.drawer}
                                    elevation={4}   
                                    style={this.state.drawerOpen===false? {backgroundColor: '#18202c'}: {backgroundColor: '#ffffff'}}        
                                >

                                    <div style={{ textAlign: 'right',  backgroundColor: '#18202c' }}>
                                        <IconButton
                                            onClick={() => this.changeMode()
                                                    }
                                        >
                                            {this.state.drawerOpen ?  <ChevronLeft fontSize="large" style={{ color: 'white'}}/> : <ChevronRight fontSize="large" style={{ color: 'white' }} />}
                                        </IconButton>
                                    </div>
                                { this.state.drawerOpen
                                   ?<div>    
                                        <Typography component='h2' variant='h2' style={{ marginBottom: 24, marginLeft:24 }}>
                                        {this.state.editMode ? 'Edit POI' : 'Add POI'}
                                        </Typography>
                                        <form id='DepartmentForm' onSubmit={(event) => {
                                                event.preventDefault();
                                                this.onCreateOrEditButtonPress();
                                        }}>

                                        <TextField
                                                label='POI Name'
                                                InputProps={{
                                                        classes: {
                                                          input: classes.field,
                                                        }
                                                      }}
                                                      InputLabelProps={{classes: {
                                                        input: classes.field,
                                                      }}}
                                                required
                                                style={{ minWidth: '80%',marginLeft:16 }}
                                                value={this.state.editableItem.name}
                                                onChange={event => this.setState({ editableItem: { ...this.state.editableItem, name: event.target.value } })}
                                        />

                                        <TextField
                                                label=' POI Description'
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
                                                style={{ marginTop: 16, minWidth: '80%',marginLeft:16  }}
                                                value={this.state.editableItem.description}
                                                onChange={event => this.setState({ editableItem: { ...this.state.editableItem, description: event.target.value } })}
                                        />
                                        <TextField
                                                label='POILat1'
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
                                                style={{ marginTop: 16, minWidth: '80%',marginLeft:16  }}
                                                defaultValue={this.state.markers[0].position.lat}
                                                value={this.state.markers[0].position.lat}
                                                onChange={event => this.setState({ editableItem: { ...this.state.editableItem, lat: event.target.value } })}
                                        />
                                        <TextField
                                                label='POILong1'
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
                                                style={{ marginTop: 16, minWidth: '80%',marginLeft:16  }}
                                                defaultValue={this.state.markers[0].position.lng}
                                                value={this.state.markers[0].position.lng}
                                                onChange={event => this.setState({ editableItem: { ...this.state.editableItem, lng: event.target.value } })}
                                        />
                                           <Autocomplete
                                                        style={{ marginTop: 16, minWidth: '80%', marginLeft: 16 }}
                                                        multiple
                                                        required
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
                                   :<Grid container>
                                        <Grid item md={11}  
                                        style={{
                                        textAlign: 'center',
                                        width: '4%',
                                        height: window.innerHeight,
                                        backgroundColor: '#18202c',
                                        cursor: 'pointer'
                                            }}
                                        >                                   
                                <span
                                    style={{ fontSize: 21, color: 'white', padding:'16' }}
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
                                    P<br />
                                    O<br />
                                    I<br />
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
                this.getPOIs();
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
        async getPOIs() {
                try {
                        let response = await getPois();
                        this.setState({ tableData: response });
                } catch (error) {
                        console.log(error);
                }
        }


        resetToDefault() {
                this.setState({
                        drawerOpen: false,
                        editMode: false,
                        showMapPreview:false,
                        editableItem: {
                                name: '',
                                description: '',
                                lat: '',
                                lng: '',
                                cases:[],
                                area: '',
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

        async onCreateOrEditButtonPress() {
                try {
                        let message;
                        let payload = this.state.editableItem;
                        payload.area = 800;
                        payload.lat = this.state.markers[0].position.lat;
                        payload.lng = this.state.markers[0].position.lng;
                        let casesObjectsList = payload.cases;
                        let casesNames = [];
                        casesObjectsList.filter(caseObject => {
                                casesNames.push(caseObject['id']);
            
                        });
                        payload.cases = casesNames;
                        if (this.state.editMode) {
                                let response = await editPoi(payload.id, payload);
                                message='POI Updated Successfully';
                        }
                        else {
                                let response = await addPoi(payload);
                                message='POI Added Successfully';
                        }
                        this.setState({
                                alertType: 'success',
                                alertTitle: 'POI',
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
                        let response = await deletePoi(rowData.id);
                        this.setState({
                                alertType: 'success',
                                alertTitle: 'POI',
                                alertMessage: 'POI deleted successfully',
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
};

export default withStyles(styles)(POI);