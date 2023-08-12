/* eslint-disable no-unused-vars */
import {
  withStyles,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  ButtonGroup,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from '@material-ui/core';
import { ExitToApp } from '@material-ui/icons';
import axios from 'axios';
import React from 'react';
import CustomAppBar from '../../components/CustomAppBar';
import { getCurrentAccountDetails } from '../../util/network';

//images
import Background from '../../assets/images/background.jpg';
import Admin from '../../assets/images/admin.png';
import Check from '../../assets/images/check.png';
import Case from '../../assets/images/case.png';
import Fence from '../../assets/images/fence.png';
import Mobile from '../../assets/images/mobile.png';

const styles = (theme) => ({
  title: {
    flexGrow: 1,
  },
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    background: `linear-gradient(rgba(255,255,255,.2), rgba(255,255,255,.2)), url(${Background})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    minWidth: '99vw',
    minHeight: '95vh',
    position: 'absolute',
    paddingBottom: 150,
    zIndex: '-200'
  },
  cont: {},
  content: {
    flex: 1,
    textAlign: 'center',
    paddingTop: theme.spacing(2),
  },
  button:{
    background: "#212121",
    color: '#fff',
    transition: 'transform 0.5s, background 0.5s',
    "&:hover": {
      background: "#2D2D2D",
      transform: 'scale(0.96, 0.96)',
    },
  },
  buttonGrid: {
    marginTop: window.innerHeight / 5,
  },
  cover: {
    width: 90,
    height: 90,
    margin: 'auto',
    paddingTop: 10,
  },
  card:{
    width: '85%',
    margin: 'auto',
    cursor: 'pointer',
    transition: 'transform 0.5s',
    "&:hover":{
      transform: 'scale(1.2, 1.2)'
    }
  }
});


class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.getContent = this.getContent.bind(this);
    this.getCard = this.getCard.bind(this);
    this.fetchCurrentAccountDetails = this.fetchCurrentAccountDetails.bind(this);
  }

  state={
    currentAccount: null
  }

  render() {
    const { classes } = this.props;
    if(!this.state.currentAccount){
      return <div></div>
    }
    return (
      <div>
        <CustomAppBar
          currentAccount={this.state.currentAccount}
          title='AutoData'
          trailingIcon={<ExitToApp title='Sign Out' />}
          onTrailingIconPress={() => {
            localStorage.removeItem('current_account');
            delete axios.defaults.headers.common['Authorization'];
            window.location = '/';
          }}
        />

        <div className={classes.root}>
          {this.getContent()}
        </div>
      </div>
    );
  }

  getContent() {
    const { classes } = this.props;

    return (
      <div className={classes.cont}>
        <Container className={classes.content}>
          <ButtonGroup color='primary'>
            <Button className={classes.button}>LocateNow</Button>
            <Button className={classes.button}>GeoLocation</Button>
            <Button className={classes.button}>Tools</Button>
          </ButtonGroup>

          <Grid
            spacing={4}
            container
            justify='center'
            className={classes.buttonGrid}
          >
            {(this.state.currentAccount['designation'] === 'Admin'
              ) && (
              <Grid item md={4}>
                {this.getCard(
                  'Admin OT',
                  'View, Add or Delete users',
                  Admin,
                  () => (window.location = '/admin')
                )}
              </Grid>
            )}

            {(this.state.currentAccount['designation'] === 'Admin' ||
              this.state.currentAccount['designation'] === 'Supervisor' ||
              this.state.currentAccount.modules.caseot.view ) && (
              <Grid item md={4}>
                {this.getCard(
                  'Case OT',
                  'View, Add or Delete cases',
                  Case,
                  () => (window.location = '/case')
                )}
              </Grid>
            )}

            {(this.state.currentAccount['designation'] === 'Admin' ||
              this.state.currentAccount.modules.checkot.view ) && (
              <Grid item md={4}>
              {this.getCard(
                'Check OT',
                'Description for Check OT',
                Check,
                () => (window.location = '/check')
              )}
            </Grid>
            )}

            {(this.state.currentAccount['designation'] === 'Admin' ||
              this.state.currentAccount.modules.fenceot.view ) && (
            <Grid item md={4}>
              {this.getCard(
                'Fencing OT',
                'Description for Fencing OT',
                Fence,
                () => (window.location = '/fence')
              )}
            </Grid>
            )}

            {(this.state.currentAccount['designation'] === 'Admin' ||
              this.state.currentAccount.modules.mobileot.view ) && (
              <Grid item md={4}>
                {this.getCard('Mobile OT', 'Description for Mobile OT', Mobile, null)}
              </Grid>
            )}

          </Grid>
        </Container>
      </div>
    );
  }

  getCard(title, description, image, onPress) {
    const { classes } = this.props;

    return (
      <Card elevation={4} onClick={onPress} className={classes.card}>
        <CardMedia
          component="img"
          alt="Contemplative Reptile"
          image={image}
          title="Contemplative Reptile"
          className={classes.cover}
          
        />
        <CardContent>
          <Typography variant='h5' component='h5'> {title} </Typography>
          <Typography variant='subtitle1' color='textSecondary'>{description}</Typography>
        </CardContent>
      </Card>
    );
  }

  componentDidMount(){
    this.fetchCurrentAccountDetails();
  }

  async fetchCurrentAccountDetails(){
    try {
        let response = await getCurrentAccountDetails()
        this.setState({
          currentAccount: response
        })
    } catch (error) {
        console.log(error);
    }
  }

}

export default withStyles(styles)(Landing);
