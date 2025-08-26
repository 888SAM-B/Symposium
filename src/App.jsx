import { useEffect, useState } from 'react'
import {Routes,Route} from 'react-router-dom'
import './App.css'
import AOS from 'aos';
import 'aos/dist/aos.css';
import Home from './components/home'
import Register from './components/register';

function App() {
    useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration in ms
      once: true,     // whether animation should happen only once
    });
  }, []);
  return (
    <>
     <div>
      <Routes>
        <Route path='/' element={<Home/>} ></Route>
        <Route path='/register' element={<Register/>} ></Route>
        
        <Route path='*' element={<h1>404 Not Found</h1>} ></Route>

      </Routes>
     </div>
    </>
  )
}

export default App
