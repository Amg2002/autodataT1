import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
// Local
import theme from './theme';
import SignIn from './pages/SignIn';
import Landing from './pages/Landing';
import AdminOT from './pages/AdminOT';
import CaseOT from './pages/CaseOT';
import CheckOT from './pages/CheckOT';
import FencingOT from './pages/FencingOT';

class App extends React.PureComponent {
  render() {
    return (
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Routes>
            <Route path='/' exact element={<SignIn/>} />

            <Route path='/landing' exact element={<Landing/>} />
            <Route path='/admin' exact element={<AdminOT/>} />
            <Route path='/case' exact element={<CaseOT/>} />
            <Route path='/check' exact element={<CheckOT/>} />
            <Route path='/fence' exact element={<FencingOT/>} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    );
  }
}

export default App;
