import React from 'react';
import {
    withStyles,
    TextField
} from '@material-ui/core';
import {
    Autocomplete
} from '@material-ui/lab';

const styles = theme => ({

});

class DataTable extends React.PureComponent {
    render() {
        const {
            allColumns,
            selectedColumns,
            onChange,
        } = this.props;

        return (
            <div>
                <Autocomplete
                    style={{ marginTop: 0,marginLeft: 12,marginRight: 8}}
                    multiple
                    options={allColumns}
                    getOptionLabel={(option) => option}
                    value={selectedColumns}
                    onChange={onChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="standard"
                            label="Columns" 
                        />
                    )}
                />
            </div>
        );
    }
};

export default withStyles(styles)(DataTable);
