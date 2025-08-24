import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate();
  return (
    <>
    <h1>Technical Symposium - Periyar University, Salem</h1>
    <p>
        Welcome to the  Technical Symposium conducted by Periyar University, Salem. 
        Join us for a day filled with insightful talks and exciting competitions 
        in the fields of Computer Science, Engineering, and Technology.
    </p>
    <ul>
        <li>Keynote Sessions by Industry Experts</li>
        <li>Paper Presentations</li>
        <li>Technical Quizzes</li>
        <li>Project Expo</li>
        <li>Workshops on Emerging Technologies</li>
        <li>Networking Opportunities</li>
    </ul>
    <p>
        Date: 25th August 2025<br />
        Venue: Periyar University Campus, Salem<br />
        For registration and more details, visit our official website.
    </p>

    <button onClick={() => navigate('/register')} >Register Now</button>
    </>
  )
}

export default Home