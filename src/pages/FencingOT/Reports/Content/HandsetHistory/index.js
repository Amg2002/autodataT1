import {
  Typography,
  withStyles
} from '@material-ui/core';
import React from 'react';

// Local
import HandsetHistoryGraph from "./HandsetHistoryXrange";
import { getHandsetHistory } from '../../../../../util/network';

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

    return (
      <div>
        <Typography variant="h5" component="h5">
          <b>Handset History</b>
        </Typography>
        <HandsetHistoryGraph data={this.state.history} />
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
