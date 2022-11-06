import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import SignIn from './components/signin/signin';
import SignUp from './components/signup/signup';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<SignUp />}/>
          <Route path='/sign-in' element={<SignIn />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;