import React from 'react';
import Lottie from 'react-lottie';
import { Alert, AlertTitle } from '@material-ui/lab';
import Fade from '@material-ui/core/Fade';

import ErrorAnimation from '../../assets/lottie/11201-fail.json';
import SuccessAnimation from '../../assets/lottie/8659-success-tick.json';
import './alert-card.styles.css';

class AlertCard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            fade: true,
            defaultOptions: {
                loop: true,
                autoplay: true,
                animationData: this.props.type === 'error'? ErrorAnimation : SuccessAnimation,
                rendererSettings: {
                  preserveAspectRatio: "xMidYMid slice"
                }
            }
        }
    }

    componentDidMount(){
        setTimeout( () => {
            this.setState({
                fade: false
            })
        }, 5000);
        setTimeout(this.props.onClose, 5300)
    }

    render(){

        return (
            <div className='alert-card'>
                <Fade in={this.state.fade} timeout={300}>
                    <Alert
                        icon={<Lottie 
                                options={this.state.defaultOptions}
                                height={50}
                                width={50}
                            />
                        } 
                        severity={this.props.type} 
                        onClose={() => {
                            this.setState({
                                fade: false
                            }, ()=>{setTimeout(this.props.onClose, 300)});
                        }}
                    >
                        <AlertTitle>{this.props.title}</AlertTitle>
                        {this.props.message}
                    </Alert>
                </Fade>
            </div>
        )
    }
}

export default AlertCard;