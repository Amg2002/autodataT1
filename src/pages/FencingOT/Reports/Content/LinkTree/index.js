import {
    withStyles,
    Card,
    CardContent,
    TextField,
    IconButton,
    Grid
  } from '@material-ui/core';
  import SearchIcon from '@material-ui/icons/Search';
  import React from 'react';
  // Local
  import { getLinkTreeData, getLinkTreeExtentionData } from '../../../../../util/network';
  import Loader from '../../../../../components/loader/loader.component';

  import LinkTreeGraph from "./LinkTree";

  //axios.defaults.timeout = 50000;

  const styles = theme => ({
    paper: {
      padding: '6px 16px',
    },
    secondaryTail: {
      backgroundColor: theme.palette.secondary.main,
    },
  });
  
  class LinkTree extends React.PureComponent {
    constructor(props) {
      super(props);
      this.fetchLinkTreeData = this.fetchLinkTreeData.bind(this);
    }
  
    state = {
      key: 1,
      data: {},
      searchMsisdn: null,
      mainMsisdn: this.props.selectedJob.query,
      loaderStatus: false
    }
  
    render() {
  
      return (
        <div>
          {false ? (<div style={{position: 'absolute', zIndex:25000, paddingTop: 65, margin: 'auto', width:'48%'}}>
            <Grid container>
              <Grid item xs={3}></Grid>
              <Grid item xs={6}>
                <div style={{margin: 'auto', width: 'auto'}}>
              <Card>
                <CardContent>
                  <TextField 
                    id="search-msisdn" 
                    label="Enter MSISDN Number" 
                    style={{width: '85%'}}
                    onChange={(event) => {this.setState({
                      searchMsisdn: event.target.value
                    })}} />
                  <IconButton aria-label="delete" onClick={() => this.getExtensionData()}>
                    <SearchIcon />
                  </IconButton>
                </CardContent>
              </Card>
              </div>
              </Grid>
              <Grid item xs={3}></Grid>
            </Grid>
          </div>) : null}
          {this.state.loaderStatus && (<Loader />)}
          <div style={{display: this.state.loaderStatus? 'none' : 'block'}}>
            <LinkTreeGraph 
              key={this.state.key} 
              data={this.state.data} 
              mainMsisdn={this.state.mainMsisdn}
              searchMsisdn={(msisdn) => {
                if(msisdn){
                  this.setState({ searchMsisdn: msisdn}, ()=>{this.getExtensionData();});
                }
              }} 
            />
          </div>
        </div>
      );
    }
  
    async componentDidMount() {
      await this.fetchLinkTreeData();
    }
  
    async fetchLinkTreeData() {
      const { selectedJob } = this.props;
      try {
        let response = await getLinkTreeData(selectedJob['id']);
        response = response.map((res) => Number(res.msisdn))

        let data = this.state.data;
        data[this.props.selectedJob.query] = response;
        // eslint-disable-next-line
        this.setState({ data: data, key: this.state.key++ });
      
      } catch (error) {
        console.log(error);
      }
    }

    async getExtensionData(){
      try {
        if(this.state.searchMsisdn){
          this.setState({
            loaderStatus: true
          })
          
          let response = await getLinkTreeExtentionData(
            this.state.searchMsisdn,
            this.props.selectedJob.startTime, 
            this.props.selectedJob.endTime
          );
          console.log(response);
          let newData = this.state.data;
          if(!newData[this.state.searchMsisdn]) newData[this.state.searchMsisdn] = response;

          this.setState({
            data: newData,
            key: this.state.key+1,
            loaderStatus: false
          })
          
          this.setState({loaderStatus: false})
        }
      } catch (error) {
        console.log({...error});
        console.log('Error', error.message);
        this.setState({loaderStatus: false})
      }
    }

  }
  
  export default withStyles(styles)(LinkTree);
  
