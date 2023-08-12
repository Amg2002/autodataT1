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

/*
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
*/

let connectionGraphOptions = {
    layout: {
        hierarchical: {
            enabled: true,
            levelSeparation: 250,
            nodeSpacing: 300,
            treeSpacing: 200,
            blockShifting: true,
            edgeMinimization: true,
            parentCentralization: true,
            direction: 'UD',        // UD, DU, LR, RL
            sortMethod: 'hubsize',  // hubsize, directed
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
        shape: 'dot',
        color: '#ff9800',
        fixed: false,
        font: {
            color: 'black',
            size: 20, // px
            face: 'Montserrat-Regular',
            background: 'none',
            strokeWidth: 0, // px
            strokeColor: 'white',
            align: 'center',
            multi: false,
            vadjust: 0,
            bold: {
                color: 'black',
                size: 20, // px
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
    height: window.innerHeight / 1.5,
};

class LinkTree extends React.PureComponent {
    render() {
        const {
            selectedJobCdrList,
            height
        } = this.props;

        connectionGraphOptions['height'] = height + 150;

        let nodesList = new Set();
        let edgesList = [];

        selectedJobCdrList.forEach(cdr => {
            let callingNumber = cdr['callingnumber'];
            let calledNumber = cdr['callednumber'];

            nodesList.add(callingNumber);
            nodesList.add(calledNumber);

            edgesList.push({
                from: callingNumber,
                to: calledNumber,
            });
        });

        let nodes = [];
        nodesList.forEach(node => {
            nodes.push({
                id: node,
                label: " " + node.toString() + " ",
                title: node.toString(),
            })
        });

        let connectionGraph = {
            nodes: nodes,
            edges: edgesList,
        };

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
                            // eslint-disable-next-line no-unused-vars
                            let { nodes, edges } = event;
                        }
                    }}
                    getNetwork={network => {
                        //  if you want access to vis.js network api you can set the state in a parent component using this property

                    }}
                />
            </div>
        );
    }
}

export default withStyles(styles)(LinkTree);
