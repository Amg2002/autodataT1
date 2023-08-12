import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid'

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#F5F5F5',
    color: theme.palette.common.black,
  },
  body: {
    fontSize: 50,
    fontWeight: 200
  },
}))(TableCell);


function createData(name, mod_name, sub_mod) {
  return { name, mod_name, sub_mod };
}

const rows = [
  createData('CaseOT', 'caseot', [
    {name: 'Close Case', mod_name: 'closecase'}, 
    {name: 'Print Case', mod_name: 'printcase'}, 
    {name: 'Add Zone', mod_name: 'addzone'},
    {name: 'Add POI', mod_name: 'addpoi'}, 
    {name: 'Export', mod_name: 'export'} ]
  ),
  createData('LocateOT', 'locateot', [{name: 'New Number', mod_name: 'newnumber'}, {name: 'Schedule', mod_name: 'schedule'}]),
  createData('CheckOT', 'checkot', [
    {name: 'New Number', mod_name: 'newnumber'}, 
    {name: 'Schedule', mod_name: 'schedule'}, 
    {name: 'Export', mod_name: 'export'}]
  ),
  createData('FencingOT', 'fenceot', [
    {name:'Add Zone', mod_name:'addzone'}, 
    {name: 'Add POI', mod_name: 'addpoi'}, 
    {name:'Export', mod_name: 'export'}]
  ),
  createData('MobileOT', 'mobileot', []),
];


export default class AccessForm extends React.Component{

  state={
    modules: this.props.data.modules
  }

  handleChange = (event) => {
    let mod_array = event.target.name.split('_');
    let mod = mod_array[0],
    sub_mod = mod_array[1];

    let stateData = {...this.state.modules};
    stateData[mod][sub_mod] = event.target.checked;
 

    this.setState({
      modules:{
        ...stateData
      }
    }, () => {
      this.props.getData(this.state.modules);
    })

  }

  render(){
    let i = 0;
    return (
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Module</StyledTableCell>
              <StyledTableCell align="center">View Rights</StyledTableCell>
              <StyledTableCell align="center">Add New Rights</StyledTableCell>
              <StyledTableCell align="center">Edit Rights</StyledTableCell>
              <StyledTableCell align="center">Sub Module Rights</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              return (
              <TableRow key={row.mod_name}>
                <TableCell>
                  {row.name}
                </TableCell>
                <TableCell align="center">
                  <FormControlLabel control={
                    <Checkbox 
                      name={row.mod_name+'_view'}  
                      color="primary" 
                      onChange={this.handleChange}
                      checked={this.state.modules[row.mod_name]['view']}
                    />
                  } />
                </TableCell>
                <TableCell align="center">
                  <FormControlLabel control={
                    <Checkbox 
                      name={row.mod_name+'_add'}
                      color="primary" 
                      onChange={this.handleChange}
                      checked={this.state.modules[row.mod_name]['add']} 
                    />} 
                  />
                </TableCell>
                <TableCell align="center">
                  <FormControlLabel control={
                    <Checkbox 
                      name={row.mod_name+'_edit'} 
                      color="primary" 
                      onChange={this.handleChange}
                      checked={this.state.modules[row.mod_name]['edit']} 
                    />} 
                  />
                </TableCell>
                <TableCell align="left">
                  <Grid container>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={6}>
                      <FormControl>
                        <FormGroup>
                          { row.sub_mod.map((sub_mod) => (
                              <FormControlLabel
                                key={i}
                                control={
                                  <Checkbox 
                                    name={row.mod_name+'_'+sub_mod.mod_name} 
                                    color="primary" 
                                    onChange={this.handleChange}
                                    checked={this.state.modules[row.mod_name][sub_mod.mod_name]} 
                                  />
                                }
                                label={sub_mod.name}
                              />  
                            )
                          ) }
                        </FormGroup>
                      </FormControl>
                    </Grid>
                    <Grid item xs={3}></Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </TableContainer>
    );

  }
}
