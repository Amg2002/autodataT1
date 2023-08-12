/* eslint-disable no-unused-vars */
import {
    withStyles,
    Typography,
} from '@material-ui/core';
import React from 'react';
import Graph from "react-graph-vis";
// Local
// import "./vis.min.css";
// import "./vis-network.min.css";

const styles = theme => ({

});

let sampleTitle = '<span>IMSI: 9867543287<br/ >IMEI: 8976573429<br />Location: 78.56, 998.66</span>';

const connectionGraph = {
    nodes: [
        { id: 1, label: "9800987675", title: sampleTitle },
        { id: 2, label: "7786543876", title: sampleTitle },
        { id: 3, label: "1234567890", title: sampleTitle },
        { id: 4, label: "1111111111", title: sampleTitle },
        { id: 5, label: "2222222222", title: sampleTitle }
    ],
    edges: [
        { from: 1, to: 2 },
        { from: 1, to: 3 },
        { from: 2, to: 3 },
        { from: 1, to: 5 },
        { from: 5, to: 2 },
        { from: 3, to: 4 },
    ]
};

const connectionGraphOptions = {
    layout: {
        hierarchial: {
            enabled: true,
            levelSeparation: 250,
            nodeSpacing: 300,
            treeSpacing: 200,
            blockShifting: true,
            edgeMinimization: true,
            parentCentralization: true,
            direction: 'UD',        // UD, DU, LR, RL
            sortMethod: 'hubsize',  // hubsize, directed
            shakeTowards: 'leaves'  // roots, leaves
        },
    },
    physics: {
        enabled: false,
    },
    interaction: {
        hover: true,
        tooltipDelay: 100
    },
    nodes: {
        shape: 'ellipse',
        color: '#ff0000',
        fixed: false,
        font: {
            color: 'white',
            size: 18, // px
            face: 'Montserrat-Regular',
            background: 'none',
            strokeWidth: 0, // px
            strokeColor: 'white',
            align: 'center',
            multi: false,
            vadjust: 0,
            bold: {
                color: 'white',
                size: 18, // px
                face: 'Montserrat-Regular',
                vadjust: 0,
                mod: 'bold'
            },
        },
        scaling: {
            label: true
        },
        shadow: true
    },
    edges: {
        color: "#000000",
        smooth: {
            type: 'diagonalCross',
        }
    },
    height: "500px"
};

class LinkTree extends React.PureComponent {
    render() {
        return (
            <div>
                <Typography variant="h5" component="h5">
                    <b>Link Tree</b>
                </Typography>

                <Graph
                    graph={connectionGraph}
                    options={connectionGraphOptions}
                    events={{
                        select: (event) => {
                            let { nodes, edges } = event;
                        }
                    }}
                />
            </div>
        );
    }
}

export default withStyles(styles)(LinkTree);
