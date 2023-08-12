import {
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
  withStyles,
  Card,
  CardContent,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React from 'react';
// Local
import { FONT_SIZE } from '../../config';
import Background from '../../assets/images/background.jpg';
import { signIn } from '../../util/network';

const styles = (theme) => ({
  paper: {
    flex: 1,
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submit: {
    margin: theme.spacing(4, 0, 2),
  },
  card: {
    width: '90%',
    margin:'auto',
  },
  container: {
    marginTop: '8%',
  },

  root: {
    flex: 1,
    position: 'absolute',
    alignItems: 'center',
    background: `linear-gradient(rgba(255,255,255,.1), rgba(255,255,255,.1)), url(${Background})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    width: '100%',
    height: '100%',
  },
  field:{
    fontSize: FONT_SIZE
  }
});

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.onSignInButtonPress = this.onSignInButtonPress.bind(this);
  }

  state = {
    email: '',
    password: '',
    error: null,
    loading: false,
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Container component='main' maxWidth='xs' className={classes.container}>
          <CssBaseline />
          <Card className={classes.card} variant='outlined'>
            <CardContent>
              <div className={classes.paper}>
                <Typography component='h1' variant='h1' style={{fontSize: 27}}>
                  Sign In
                </Typography>

                <TextField
                  variant='outlined'
                  InputProps={{
                    classes: {
                      input: classes.field,
                    }
                  }}
                  InputLabelProps={{classes: {
                      input: classes.field,
                  }}}
                  margin='normal'
                  required
                  fullWidth
                  label='UserName'
                  autoFocus
                  onChange={(event) =>
                    this.setState({ email: event.target.value, error: null })
                  }
                />

                <TextField
                  variant='outlined'
                  InputProps={{
                    classes: {
                      input: classes.field,
                    }
                  }}
                  InputLabelProps={{classes: {
                      input: classes.field,
                  }}}
                  margin='normal'
                  required
                  fullWidth
                  label='Password'
                  type='password'
                  onChange={(event) =>
                    this.setState({ password: event.target.value, error: null })
                  }
                />

                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  color='primary'
                  className={classes.submit}
                  onClick={this.onSignInButtonPress}
                >
                  <b>Sign In</b>
                </Button>

                {this.state.error && (
                  <Alert severity='error'>{this.state.error}</Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </Container>
      </div>
    );
  }

  async onSignInButtonPress() {
    const email = this.state.email;
    const password = this.state.password;
    try {
      let response = await signIn(email, password);
      localStorage.setItem('current_account', JSON.stringify(response));
      window.location = '/landing';
    } catch (error) {
      console.log(error);
      console.log(error);
      
      let err = {...error};
      let errorMessage = err.response.data['error'] ? err.response.data['error'] : error.toString();
      
      this.setState({ error: errorMessage });
    }
  }
}

export default withStyles(styles)(SignIn);
