import orange from '@material-ui/core/colors/orange';
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#212121'
        },
        secondary: orange,
    },
    typography: {
        fontFamily: 'Montserrat-Regular',
        h1:{
            fontSize: 21
        },
        h2:{
            fontSize: 19
        },
        h3:{
            fontSize: 17
        },
        h6:{
            fontSize: 17
        },
        body1:{
            fontSize: 15
        },
        body2:{
            fontSize: 13
        },
        subtitle1:{
            fontSize: 15,
        },
        subtitle2:{
            fontSize: 12
        },
        button: {
            textTransform: 'none',
            fontSize: 14
        },
    },
    overrides: {
        MuiTab: {
            fullWidth: {
                maxWidth: '100%'
            },
        },
        MuiAutocomplete:{
            root:{
                fontSize: 12
            },
            tag:{
                fontSize: 12
            }
        }
    }
});

export default theme;
