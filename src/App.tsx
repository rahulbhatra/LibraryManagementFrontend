import { Box, Container, Toolbar } from '@mui/material';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { Header, SideBar } from './components/bars/bar';
import Dashboard from './components/dashboard/dashboard';
import Documents from './components/document/documents';
import ProtectedRoutes from './components/ProtectedRoutes/ProtectedRoutes';
import SignIn from './components/signin/signin';
import SignUp from './components/signup/signup';
import User from './components/user/Librarian';

function App() {
  const [open, setOpen] = React.useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <div className="App">
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
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Toolbar />
              <Routes>
                <Route path='/' element={<SignIn />}/>
                <Route path='/sign-up' element={<SignUp />}/>
                <Route path='/sign-in' element={<SignIn />}/>
                <Route element={<ProtectedRoutes />}>
                  <Route path='/dashboard' element={<Dashboard />}/>
                  <Route path='/documents' element={<Documents />}/>
                  <Route path="/user" element={<User />}/>
                </Route>
              </Routes>
            </Container>
          </Box>
        </Box>
      </BrowserRouter>
    </div>
  );
}

export default App;