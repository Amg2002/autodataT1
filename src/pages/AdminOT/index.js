import React from 'react';
import { withStyles, Tabs, Tab } from '@material-ui/core';
import { Home, ExitToApp } from '@material-ui/icons';

// Local
import CustomAppBar from '../../components/CustomAppBar';
import Users from './Users';
import Departments from './Departments';

import { getCurrentAccountDetails } from '../../util/network';

const styles = (theme) => ({
  tabs: {
    backgroundColor: '#557A95',
  },
});

class AdminOT extends React.Component {
  constructor(props) {
    super(props);
    this.getHeader = this.getHeader.bind(this);
    this.getContent = this.getContent.bind(this);
  }

  state = {
    currentAccount: null,
    activeTab: 'Users',
  };

  render() {
    if(!this.state.currentAccount){
      return <div></div>
    }
    return (
      <div>
        {this.getHeader()}
        {this.getContent()}
      </div>
    );
  }

  getHeader() {
    const { classes } = this.props;

    return (
      <div>
        <CustomAppBar
          currentAccount={this.state.currentAccount}
          title='Admin OT'
          leadingIcon={<Home />}
          onLeadingIconPress={() => (window.location = '/landing')}
          trailingIcon={<ExitToApp />}
          onTrailingIconPress={() => (window.location = '/')}
        />
        <Tabs
          className={classes.tabs}
          variant='fullWidth'
          centered
          value={this.state.activeTab}
          onChange={(event, newVal) => this.setState({ activeTab: newVal })}
        >
          <Tab label={<b style={{ color: 'white' }}>Users</b>} value='Users' />
          <Tab
            label={<b style={{ color: 'white' }}>Departments</b>}
            value='Departments'
          />
        </Tabs>
      </div>
    );
  }

  getContent() {
    return (
      <div>
        {this.state.activeTab === 'Users' ? <Users currentAccount={this.state.currentAccount}/> : <div />}
        {this.state.activeTab === 'Departments' ? <Departments currentAccount={this.state.currentAccount} /> : <div />}
      </div>
    );
  }

  componentDidMount(){
    this.fetchCurrentAccountDetails();
  }

  async fetchCurrentAccountDetails(){
    try{
      let response = await getCurrentAccountDetails();
      this.setState({
        currentAccount: response
      })
    }catch(error){
      console.log(error);
    }
  }
}

export default withStyles(styles)(AdminOT);
