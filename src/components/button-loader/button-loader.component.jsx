import React from 'react';
import Lottie from 'react-lottie';

import LoaderAnimation from '../../assets/lottie/lf30_editor_nfvsqcsg.json';
import './button-loader.styles.css';

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: LoaderAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
};

class Loader extends React.Component{

    render(){
        return(
            <div id='button-loader'>
                <Lottie 
                    options={defaultOptions}
                    height={this.props.height}
                    width={this.props.width}
                />
            </div>
        )
    }    
}

export default Loader;