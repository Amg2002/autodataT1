import {
    Paper,
    Typography,
    withStyles
} from '@material-ui/core';
import {
    Fastfood,
} from '@material-ui/icons';
import {
    Timeline,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineOppositeContent,
    TimelineSeparator
} from '@material-ui/lab';
import React from 'react';
// Local
import { getHandsetHistory } from '../../../../../../util/network';

const styles = theme => ({
    paper: {
        padding: '6px 16px',
    },
    secondaryTail: {
        backgroundColor: theme.palette.secondary.main,
    },
});

class HandsetHistory extends React.PureComponent {
    constructor(props) {
        super(props);
        this.fetchHandsetHistory = this.fetchHandsetHistory.bind(this);
    }

    state = {
        history: [],
    }

    render() {
        const {
            classes
        } = this.props;

        return (
            <div>
                <Typography variant="h5" component="h5">
                    <b>Handset History</b>
                </Typography>

                <Timeline align="alternate">
                    {
                        this.state.history.map(historyObj =>
                            <TimelineItem key={historyObj['id']}>
                                <TimelineOppositeContent>
                                    <Typography variant="body1" color="textSecondary">
                                        <br />
                                        <b>IMSI: </b>{historyObj['imsi']}
                                    </Typography>
                                </TimelineOppositeContent>
                                <TimelineSeparator>
                                    <TimelineDot>
                                        <Fastfood />
                                    </TimelineDot>
                                    <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent>
                                    <Paper elevation={3} className={classes.paper}>
                                        <Typography>
                                            <b>ID: </b>{historyObj['id']}
                                            <br />
                                            <b>History Type: </b>{historyObj['history_type']}
                                            <br />
                                            <b>MSISDN / IMEI: </b>{historyObj['msisdnorimei']}
                                            <br />
                                            <b>Start Time: </b>{historyObj['startTime']}
                                            <br />
                                            <b>End Time: </b>{historyObj['endTime']}
                                        </Typography>
                                    </Paper>
                                </TimelineContent>
                            </TimelineItem>
                        )
                    }
                </Timeline>
            </div>
        );
    }

    async componentDidMount() {
        await this.fetchHandsetHistory();
    }

    async fetchHandsetHistory() {
        const { selectedJob } = this.props;
        try {
            let response = await getHandsetHistory(selectedJob['id']);
            this.setState({ history: response });
        } catch (error) {
            console.log(error);
        }
    }
}

export default withStyles(styles)(HandsetHistory);
