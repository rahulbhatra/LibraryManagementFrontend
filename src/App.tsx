import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './components/dashboard/dashboard';
import ProtectedRoutes from './components/ProtectedRoutes/ProtectedRoutes';
import SignIn from './components/signin/signin';
import SignUp from './components/signup/signup';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<SignIn />}/>
          <Route path='/sign-up' element={<SignUp />}/>
          <Route path='/sign-in' element={<SignIn />}/>
          <Route element={<ProtectedRoutes />}>
            <Route path='/dashboard'/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;