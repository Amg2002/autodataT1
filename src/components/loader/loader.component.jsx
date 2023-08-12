import React from 'react';
import Lottie from 'react-lottie';

import LoaderAnimation from '../../assets/lottie/lf30_editor_cwukpzab.json';
import './loader.styles.css';

export default function Loader(){
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: LoaderAnimation,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
    };

    return(
        <div id='loader'>
            <Lottie 
                options={defaultOptions}
                height={275}
                width={275}
            />
        </div>
    )    
}