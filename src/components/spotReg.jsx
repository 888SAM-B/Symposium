import React from 'react'
import { useNavigate } from 'react-router-dom'
const  SpotReg = () => {
  const navigate = useNavigate();
  return (
    <>
    <h1>SPOT REGISTRATION</h1>
    <button className='solo' onClick={() => navigate('/solo')}>TEAM</button>
    <button onClick={() => navigate('/solo')}>INDIVIDUAL</button>
    </>
  )
}

export default SpotReg