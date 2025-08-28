import React from 'react'
import GlareHover from './animations/GlareHover'

import TiltedCard from './animations/TiltedCard'



const About = () => {
    return (
        <>
            <div className="about">
                <div className="about-contents">
                    <div className="tilted-card">
                    <TiltedCard
                        imageSrc="/vibe2.png"
                        containerHeight="300px"
                        containerWidth="300px"
                        imageHeight="300px"
                        imageWidth="300px"
                        rotateAmplitude={12}
                        scaleOnHover={1.2}
                        showMobileWarning={false}
                        showTooltip={false}
                        displayOverlayContent={true}
                        
                    />
                    </div>

                    <p>

                        This prestigious event serves as a vibrant platform for students from across the nation to showcase their talent, creativity, and technical excellence through a variety of engaging competitions.
                        <br /> From challenging quizzes to innovative project presentations and exciting contests, VIBE 2K25 is designed to inspire participation and healthy competition.
                        <br />
                        Here, every participant gets the chance to prove their skills, unleash their potential, and make their mark. The best talents will be honored with awards and recognition, celebrating not just victory, but the spirit of innovation and teamwork.
                    </p>
                </div>
                <div className="about-cards">
                    <GlareHover className='glare-hover'>
                        <img src='/calendar.png' className='icon' />15th September 2025
                    </GlareHover>
                    <GlareHover className='glare-hover'>
                        <img src='/clock.png' className='icon' />10:00 AM - 5:00 PM
                    </GlareHover>
                    <GlareHover className='glare-hover long'>
                        <img src='/location.png' className='icon' alt="" /> Periyar University, Salem- 636011
                    </GlareHover>
                    <GlareHover className='glare-hover mid '>
                        Registraion Ends On  : 5th September 2025
                    </GlareHover>
                </div>

            </div>
        </>
    )
}

export default About