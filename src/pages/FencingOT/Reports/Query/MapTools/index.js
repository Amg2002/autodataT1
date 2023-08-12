import React from 'react';
import { 
  CardContent,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Grid
} from '@material-ui/core';


class MapToolsQuery extends React.Component{
    constructor(props){
        super(props);

        this.state={
            mapEditMode: this.props.mapEditMode,
            featureMode: this.props.featureMode?this.props.featureMode: 'shortestPath',
            alongDistance: 200,
            mapEditToolsData: this.props.mapEditToolsData,
        }

    }

    render(){

        const {spData, coordinatesData, lengthData, areaData} = this.state.mapEditToolsData;

        return (
            <div>
            {
                this.props.mapEditMode && (          
                
                    <CardContent>
                    {this.state.featureMode && (<div>
                        <FormControl variant="outlined" style={{width:'100%'}}>
                        <InputLabel>Select Feature</InputLabel>
                        <Select
                            aria-label="featureType" 
                            name="featureType"
                            value={this.state.featureMode} 
                            onChange={(event) => {
                                this.setState({ featureMode: event.target.value }, () => {this.props.handleFeatureChange(this.state.featureMode)})
                            }}
                            label="names"
                        >
                            <MenuItem value='shortestPath'>Shortest Path</MenuItem>
                            <MenuItem value='along'>Along</MenuItem>
                        </Select>
                        </FormControl>
                        {this.state.featureMode === 'shortestPath'? 
                        (<div>
                            <FormHelperText id="my-helper-text">Selected Start Point and End Point Using Marker Tool</FormHelperText>
                            <br/>
                            <Box className='shortestPathDiv' component="div">
                            <strong>Start Point:</strong><span id='startPoint'>{spData? spData[0][0]+', '+spData[0][1] :null}</span><br/>
                            </Box>
                            <Box className='shortestPathDiv' component="div">
                            <strong>End Point:</strong><span id='endPoint'>{spData?spData[1][0]+', '+spData[1][1]:null}</span>
                            </Box>
                        </div>): (
                            <div>
                                <FormHelperText id="my-helper-text">
                                    Enter the radius<br />
                                    Create a path using Line String Tool
                                </FormHelperText>
                            </div>
                        )}
                        {
                            coordinatesData? ( <Box component='div'>
                                <br/>
                                <strong>Coordinates</strong><span>{coordinatesData}</span>
                            </Box>) : null
                        }
                        <Grid container>
                            {
                                lengthData?
                                (<Grid item xs={6}>
                                    <br/>
                                    <h4>Distance: </h4>
                                    <p><strong>{lengthData}</strong> kilometers</p>
                                    <p><strong>{(lengthData*1000)}</strong> meters</p>
                                    <p><strong>{Math.round(lengthData*0.621371)}</strong> miles</p>
                                    <p><strong>{Math.round(lengthData*1093.61)}</strong> yards</p> 
                                    <p><strong>{Math.round(lengthData*3280.84)}</strong> feet</p>
                                </Grid>)
                                : null
                            }
                            
                            {
                                areaData? 
                                (<Grid item xs={6}>
                                    <br/>
                                    <h4>Area: </h4>
                                    <p><strong>{Math.round(areaData)}</strong> square meters</p>
                                    <p><strong>{Math.round(areaData/1000000)}</strong> square km</p>
                                    <p><strong>{Math.round(areaData*0.000247105)}</strong> Acres</p>
                                    <p><strong>{Math.round(areaData/10000)}</strong> Hectare</p>
                                    <p><strong>{Math.round(areaData*10.764)}</strong> square feet</p>
                                </Grid>): null
                            }
                        </Grid>

                        </div>)}
                    </CardContent>
                )
            }
        </div>
        
        )
    }
}

export default MapToolsQuery;