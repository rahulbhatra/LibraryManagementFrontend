import React from 'react';
<<<<<<< HEAD
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './components/dashboard/dashboard';
import ProtectedRoutes from './components/ProtectedRoutes/ProtectedRoutes';
import SignIn from './components/signin/signin';
=======
import './App.css';
>>>>>>> 8a0fa49 (initial setup)
import SignUp from './components/signup/signup';

function App() {
  return (
    <div className="App">
<<<<<<< HEAD
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
=======
      <header className="App-header">
        <SignUp />
      </header>
>>>>>>> 8a0fa49 (initial setup)
    </div>
  );
}

export default App;