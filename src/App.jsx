import { useEffect, useState } from 'react'
import {Routes,Route} from 'react-router-dom'
import './App.css'

import Home from './components/home'
import Admin from './components/admin';
import SpotReg from './components/spotReg';
import AdminPage from './components/AdminPage';
import Solo from './components/solo';
function App() {
   
  return (
    <>
     <div>
      <Routes>
        <Route path='/' element={<Home/>} ></Route>
        <Route path='/spotReg' element={<SpotReg/>} ></Route>
        <Route path='/admin' element={<Admin/>} ></Route>
        <Route path='/admin-page' element={<AdminPage/>} ></Route>
        <Route path='/solo' element={<Solo/>} ></Route>
        <Route path='*' element={<h1>404 Not Found</h1>} ></Route>

      </Routes>
     </div>
    </>
  )
}

export default App
