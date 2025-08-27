import React from 'react'
import GlareHover from './animations/GlareHover'




const About = () => {
    return (
        <>
            <div className="about">
                <div className="about-contents">
                    <img src="https://www.svgrepo.com/show/508699/landscape-placeholder.svg" alt="" />
                    <p>

                        This prestigious event serves as a vibrant platform for students from across the nation to showcase their talent, creativity, and technical excellence through a variety of engaging competitions.
                        <br /> From challenging quizzes to innovative project presentations and exciting contests, VIBE 2K25 is designed to inspire participation and healthy competition.
                        <br />
                        Here, every participant gets the chance to prove their skills, unleash their potential, and make their mark. The best talents will be honored with awards and recognition, celebrating not just victory, but the spirit of innovation and teamwork.
                    </p>
                </div>
                <div className="about-cards">
                <GlareHover className='glare-hover'>
                      <img src='/calendar.png'className='icon' />15th September 2025
                </GlareHover>
                <GlareHover className='glare-hover'>
                        <img src='/clock.png' className='icon'  />10:00 AM - 5:00 PM
                </GlareHover>
                  <GlareHover className='glare-hover long'>
                       <img src='/location.png'  className='icon' alt="" /> Department of Computer Science, Periyar University, Salem
                </GlareHover>
                  <GlareHover className='glare-hover mid '>
                        Registraion Ends On  : 5th Sep 2025  
                </GlareHover>
                </div>
                
            </div>
        </>
    )
}

export default About