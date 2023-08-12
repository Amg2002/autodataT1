import React from 'react';
import {
    Dialog,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Slide,
    DialogActions,
    DialogContent,
    Button
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Formik, Form, Field } from 'formik';
import {TextField as FormikTextField} from 'formik-material-ui';
import * as Yup from 'yup';

import AlertCard from '../alert-card/alert-card.component';

import { adminPasswordReset, resetPassword } from '../../util/network';
import { FONT_SIZE } from '../../config';

let Transition = React.forwardRef(function(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class ChangePasswordDialog extends React.Component{
    constructor(props){
        super(props);
        this.state={
            username: this.props.username,
            password: null,
            adminReset: this.props.adminReset,
            alertTitle: 'Reset Password',
            alertOpen: false,
            alertMessage: '',
            alertType: '',
        }

        this.onAlertClose = this.onAlertClose.bind(this);
        this.resetToDefault = this.resetToDefault.bind(this);
        this.onSubmitPassword = this.onSubmitPassword.bind(this);
    }

    resetToDefault(){
        this.setState({
            username: null,
            adminReset: null,
            password: null,
        });
        this.props.onClose();
    }

    onAlertClose(){
        this.setState({
            alertOpen : false,
            alertMessage: '',
            alertType: '',
        })
    }

    render(){
        
        let {classes} = this.props;
        classes = {
            ...classes,
            field:{
                fontSize: FONT_SIZE,
            },
            drawerPaper:{
                width: '100%',
                height: '100%',
                fontSize: FONT_SIZE
            },
        }
        const validationSchema = Yup.object().shape({
            password: Yup.string().required('Password Required'),
            confirmPassword: Yup.string()
            .required('Please confirm the entered password')
            .test('passwords-match', 'Passwords must match', function(value) {
                return this.parent.password === value;
            }),
        })

        return (
            <div>
                {this.state.alertOpen && (
                    <AlertCard
                        onClose={this.onAlertClose} 
                        type={this.state.alertType} 
                        title={this.state.alertTitle} 
                        message={this.state.alertMessage} 
                    />
                )}
                <Dialog 
                    open={this.props.open} 
                    onClose={() => this.resetToDefault()} 
                    TransitionComponent={Transition}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <AppBar 
                        position='static'
                        style={{
                            backgroundColor: '#18202c'
                        }}
                    >
                    <Toolbar>
                        <Typography variant="h6">
                            {'Change Password'}
                        </Typography>

                        <IconButton 
                            edge="start" 
                            color="inherit" 
                            onClick={this.resetToDefault} 
                            style={{ position: 'absolute', right: '2rem' }} 
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                    </AppBar>
                    
                    <Formik
                        initialValues={this.state}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting }) => {
                            setSubmitting(false);
                            this.onSubmitPassword();
                        }}
                    >
                        {( {errors, touched, handleChange, submitForm, isSubmitting} ) => (
                            <div>
                            <DialogContent style={{padding: 32, fontSize: FONT_SIZE}}>
                                <Form>
                                    <Field
                                        component={FormikTextField}
                                        style={{ marginTop: 16 }}
                                        InputProps={{
                                            classes: {
                                            input: classes.field,
                                            }
                                        }}
                                        InputLabelProps={{classes: {
                                            input: classes.field,
                                        }}}
                                        label='Password'
                                        type='password'
                                        name='password'
                                        fullWidth
                                        required
                                        value={this.state.password}
                                        onChange={(event) => {
                                            event.persist = () => {};
                                            handleChange(event);
                                            this.setState({
                                                password: event.target.value,
                                            })
                                        }}
                                    />
                                    <br />
                                    <Field
                                        component={FormikTextField}
                                        style={{ marginTop: 16 }}
                                        InputProps={{
                                            classes: {
                                            input: classes.field,
                                            }
                                        }}
                                        InputLabelProps={{classes: {
                                            input: classes.field,
                                        }}}
                                        label='Confirm Password'
                                        type='password'
                                        name='confirmPassword'
                                        fullWidth
                                        required
                                    />
                                </Form>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    fullWidth
                                    variant='contained'
                                    color='primary'
                                    disabled={isSubmitting}
                                    onClick={submitForm}
                                >Change Password</Button>
                            </DialogActions>
                            </div>
                        )}
                        
                    </Formik>
                </Dialog>
            </div>
        )
    }

    async onSubmitPassword(){
        try{
            let {username, password, adminReset} = this.state;
            // eslint-disable-next-line no-unused-vars
            let response;
            if(adminReset){
                response = await adminPasswordReset(username, password);
            }else{
                // eslint-disable-next-line
                response = await resetPassword(password);
            }
            this.setState({
                alertType: 'success',
                alertMessage: 'Password Changed Successfully',
                alertOpen: true,
            }, () => {
                if(this.props.adminAlert){
                    this.props.adminAlert(this.state.alertType, this.state.alertTitle, this.state.alertMessage);
                }
            });
            this.resetToDefault();
        }catch(error){
            console.log(error);
            this.setState({
                alertType: 'error',
                alertMessage: 'Unable to Change Password',
                alertOpen: true,
            }, () => {
                if(this.props.adminAlert){
                    this.props.adminAlert(this.state.alertType, this.state.alertTitle, this.state.alertMessage);
                }
            });
            
            this.resetToDefault();
        }
    }
}

export default ChangePasswordDialog;
