/* eslint-disable array-callback-return */
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  withStyles,
  Popper, 
  Grow,
  Paper,
  MenuList,
  MenuItem,
  ClickAwayListener,
  Divider,
  Avatar
} from '@material-ui/core';
import axios from 'axios';
import React from 'react';
import { deepPurple } from '@material-ui/core/colors';

import ChangePasswordDialog from '../change-password-dialog-box/change-password-dialog.component';

const styles = (theme) => ({
  root:{
    width: '100%',
  },
  title: {
    flexGrow: 1,
  },
  purple:{
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
  username:{
    textAlign: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  avatarList:{
    textAlign: 'right',
  }
});

const navigationPaths = [
  { name: 'Dashboard', path: '/landing', accessname: 'dashboard' },
  { name: 'AdminOT', path: '/admin', accessname: 'admin' },
  { name: 'CaseOT', path: '/case', accessname: 'caseot' },
  { name: 'CheckOT', path: '/check', accessname: 'checkot' },
  { name: 'FenceOT', path: '/fence', accessname: 'fenceot' },
]

class CustomAppBar extends React.PureComponent {

  constructor(props){
    super(props);
    this.state={
      open: false,
      signoutOpen: false,
      openAvatarOption: false,
      anchorEl: null,
      currentAccount: this.props.currentAccount,
      changePasswordDialogOpen: false
    }

    this.handleListKeyDown = this.handleListKeyDown.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleNavigation = this.handleNavigation.bind(this);
    this.handleSignOutClick = this.handleSignOutClick.bind(this);
    this.handleChangePassDialog = this.handleChangePassDialog.bind(this);
    this.handleAvatarClick = this.handleAvatarClick.bind(this);
  }

  handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      this.setState({open: false});
    }
  }

  handleNavigation(){
    this.setState({
      open: !this.state.open,
    })
  }

  handleClose(path){
    if(path){
      window.location = path
    }
  }

  handleSignOutClick(){
    localStorage.removeItem('current_account');
    delete axios.defaults.headers.common['Authorization'];
    window.location = '/';
  }

  handleChangePassDialog(){
    this.setState({
      changePasswordDialogOpen: !this.state.changePasswordDialogOpen,
      open: false,
    })
  }

  handleAvatarClick(event){
    this.setState({
      openAvatarOption: !this.state.openAvatarOption,
      anchorEl: event.currentTarget,
    })
  }

  render() {
    const {
      classes,
      title,
      leadingIcon,
    } = this.props;

    let selectedPage = window.location.pathname;

    let userDetails = JSON.parse(localStorage.getItem('current_account'));
    let first_name =  userDetails.first_name,
    last_name = userDetails.last_name,
    username = userDetails.username;

    return (
      <div className={classes.root}>
      <AppBar position='static'>
        <Toolbar>
          {leadingIcon ? (
            <div>
              <IconButton
                onClick={this.handleNavigation}
                edge='start'
                color='inherit'
                aria-controls="navigation-menu" 
                aria-haspopup="true" 
              >
                {leadingIcon}
              </IconButton>
              <Popper 
                open={this.state.open} 
                role={undefined} 
                transition 
                disablePortal 
                style={{ 
                  zIndex: 25000 ,
                  top: '4rem',
                  width: '17rem',
                }} 
              >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                >
                  <Paper style={{
                    borderRadius: 0, 
                    color: 'white',
                    backgroundColor: '#363535',
                  }}>
                    <ClickAwayListener onClickAway={() => {this.handleClose()}}>
                      <MenuList autoFocusItem={this.state.open} id="menu-list-grow" onKeyDown={this.handleListKeyDown} >
                        {
                          navigationPaths.map((nav) => {
                            if(
                              nav.accessname === 'dashboard' ||
                              (nav.accessname === 'admin' && this.state.currentAccount['designation'] === 'Admin')
                            ){
                              return (
                                <MenuItem 
                                  onClick={() => {if(nav.path !== selectedPage)this.handleClose(nav.path)}} 
                                  selected={nav.path === selectedPage}
                                  onMouseEnter={(e) => e.target.style.backgroundColor = '#1E1E1E'}
                                  onMouseLeave={(e) => e.target.style.backgroundColor = nav.path === selectedPage? '#1E1E1E' : '#363535'}
                                >{nav.name}</MenuItem>    
                              )
                            }
                            if(nav.accessname !== 'dashboard' && nav.accessname !== 'admin'){
                              if(
                                this.state.currentAccount['modules'][nav.accessname]['view'] || 
                                this.state.currentAccount['designation'] === 'Admin'
                              ){
                                return (
                                  <MenuItem 
                                    onClick={() => {if(nav.path !== selectedPage)this.handleClose(nav.path)}} 
                                    selected={nav.path === selectedPage}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#1E1E1E'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = nav.path === selectedPage? '#1E1E1E' : '#363535'}
                                  >{nav.name}</MenuItem>
                                ) 
                              }
                            }
                          })
                        }
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
              </Popper>
            </div>
          ) : (
            <div />
          )}

          <Typography variant='h2' className={classes.title}>
            {title}
          </Typography>
          
          <div>
            <IconButton
              onClick={this.handleAvatarClick}
              edge='start'
              color='inherit'
              aria-describedby='signout-button'
            >
              {/*trailingIcon*/}
              <Avatar className={classes.purple}>{username[0].toUpperCase()}</Avatar>
            </IconButton>
            <Popper
              id='signout-button'
              anchorEl={this.state.anchorEl}
              style={{
                top:'4rem',
                width: '18rem',
              }}
              open={this.state.openAvatarOption}
              placement='bottom'
              transition
            >
              {({TransitionProps}) => (
                <Grow {...TransitionProps}>
                  <Paper
                    style={{
                      borderRadius: 0, 
                      color: 'white',
                      backgroundColor: '#363535',
                    }}
                  >
                    <ClickAwayListener onClickAway={() => {this.handleClose()}}>
                      <MenuList>
                        <MenuItem className={classes.username}>{`${first_name} ${last_name}`}</MenuItem>
                        <Divider />
                        <MenuItem className={classes.avatarList} onClick={this.handleChangePassDialog}>Change Password</MenuItem>
                        <MenuItem className={classes.avatarList} onClick={this.handleSignOutClick}>Log Out</MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </div>
        </Toolbar>
      </AppBar>
    <ChangePasswordDialog 
      userId={this.state.currentAccount.id} 
      open={this.state.changePasswordDialogOpen} 
      onClose={this.handleChangePassDialog}
    />
     </div>
    );
  }
}

export default withStyles(styles)(CustomAppBar);
