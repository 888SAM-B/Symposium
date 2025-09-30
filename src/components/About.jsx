import React from 'react'
import GlareHover from './animations/GlareHover'

import TiltedCard from './animations/TiltedCard'



const About = () => {
    return (
        <>
            <div className="about">
                <div className="about-contents">
                    <div className="tilted-card lr" >
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
                    <br /> <br />
                    <p className='lr1'>

                        VIBE 2025– Value-drivenInnovation for Better Era is the technical symposium organized by the Department of ComputerScience, PeriyarUniversity.
                        Scheduled for 8th October 2025,this one-day event is designed to bring together students,researchers,and industry professionals to explore, exchange,and celebrate innovations in the field of Computer Science and emerging technologies.
                        <br />
                        Here, every participant gets the chance to prove their skills, unleash their potential, and make their mark. The best talents will be honored with awards and recognition, celebrating not just victory, but the spirit of innovation and teamwork.
                    </p>
                </div>
                <br />
                <div className="about-cards">
                    <GlareHover className='glare-hover'>
                        <img src='/calendar.png' className='icon' />8th October 2025
                    </GlareHover>
                    <GlareHover className='glare-hover'>
                        <img src='/clock.png' className='icon' />10:00 AM - 5:00 PM
                    </GlareHover>
                    <GlareHover className='glare-hover long'>
                        <img src='/location.png' className='icon' alt="" /> Periyar University, Salem- 636011
                    </GlareHover>
                    <GlareHover className='glare-hover mid '>
                   <img src='/cutlery.png' className='icon' alt="" /> Food will be provided
                </GlareHover>
                    
                </div>
                <div className="bottom-2">
                <GlareHover className='glare-hover mid '>
                    Registraion Fee  :  ₹ 150 Per Person
                </GlareHover>
                <GlareHover className='glare-hover mid '>
                        Registraion Ends On  : 7th October 2025
                    </GlareHover>
                    </div>
            </div>
        </>
    )
}

export default About
