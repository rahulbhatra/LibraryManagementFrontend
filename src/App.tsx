import { Box, Container, Toolbar, useTheme } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { Header, SideBar } from './components/bars/bar';
import ManageCopy from './components/ManageCopy/ManageCopy';
import Dashboard from './components/dashboard/dashboard';
import Documents from './components/document/documents';
import ProtectedRoutes from './components/ProtectedRoutes/ProtectedRoutes';
import SignIn from './components/signin/signin';
import SignUp from './components/signup/signup';
import UserComponent from './components/user/user.component';
import BorrowReturnComponent from './components/BorrowReturn/BorrowReturn';
import { UserProvider } from './context/UserContext';
import { BearerAccessRefreshToken } from './models/authentication';

function App() {
  const [open, setOpen] = React.useState(true);
  const [token, setToken] = useState<BearerAccessRefreshToken>({});
  const value = useMemo(
    () => ({ token, setToken }), [token]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <div className="App">
      <UserProvider value={value}>
        <BrowserRouter>
          <Box sx={{ display: 'flex' }}>
            <Header open={open} setOpen={setOpen} toggleDrawer={toggleDrawer} />
            <SideBar open={open} setOpen={setOpen} toggleDrawer={toggleDrawer} />
            <Box
              component="main"
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[900],
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto',
              }}
            >
              <Container maxWidth={'xl'} sx={{ mt: 12, mb: 4 }}>
                <Routes>
                  <Route path='/' element={<SignIn />}/>
                  <Route path='/sign-up' element={<SignUp />}/>
                  <Route path='/sign-in' element={<SignIn />}/>
                  <Route path='/dashboard' element={<Dashboard />}/>
                  <Route element={<ProtectedRoutes />}>
                    <Route path='/documents' element={<Documents />}/>
                    <Route path="/user" element={<UserComponent />}/>
                    <Route path="/manage-copy" element={<ManageCopy />} />
                    <Route path="/borrow-return" element={<BorrowReturnComponent />} />
                  </Route>
                </Routes>
              </Container>
            </Box>
          </Box>
        </BrowserRouter>
      </UserProvider>
    </div>
  );
}

export default App;