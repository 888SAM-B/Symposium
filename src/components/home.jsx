import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import GradientText from "./animations/gradientText";
import About from "./About";
import ShinyText from "./animations/shineyText";
import Stack from "./animations/Stack";
import EventCard from "./animations/eventCard";


const Home = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const splashRef = useRef(null);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Splash Animation
    const splashTl = gsap.timeline({
      onComplete: () => {
        setShowSplash(false); // hide splash
        startContentAnimation(); // show main content
      },
    });

    splashTl
      .fromTo(
        splashRef.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1.3, duration: 0.9, ease: "back.out(3)" }
      )
      .to(splashRef.current, {
        opacity: 0,
        duration: 0.9,
        delay: 0.3,
        scale: 0.8,
      });
  }, []);

  

  const images = [
    { id: 1, img: "/9.png" },
    { id: 2, img: "/8.png" },
    { id: 3, img: "/7.png" },
    { id: 4, img: "/6.png" },
    { id: 5, img: "/5.png" },
    { id: 6, img: "/4.png" },
    { id: 7, img: "/3.png" },
    { id: 8, img: "/2.png" },
    { id: 9, img: "/1.png" },
  ];
  
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* Splash Screen */}
      {showSplash && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "#0a192f",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "0 1rem",
            textAlign: "center",
          }}
        >
          <h1
            ref={splashRef}
            style={{
              fontSize: "clamp(2rem, 15vw, 5rem)",
              fontWeight: "900",
              background: "linear-gradient(90deg, #007bff, #00c6ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "0.2em",
              lineHeight: 1.1,
            }}
          >
          VIBE  <br />  2K25
          </h1>
        </div>
      )}

      {/* Main Content */}
      <div
        ref={containerRef}
        className="main-content"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "2rem 1rem",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "1.5rem" }}>
          <GradientText
            colors={["#d2e0efff", "#00c6ff", "#40ffaa"]}
            animationSpeed={3}
            showBorder={false}
            className="main-heading"
          >
            VIBE 2K25 - National Level Technical Symposium
          </GradientText>
        </h1>

        <div className="about" id="about" style={{ marginBottom: "2rem" }}>
          <ShinyText text="ABOUT VIBE 2K25" className="shiney" />
          <About />
        </div>

        <div className="about" id="rules" style={{ marginBottom: "2rem" }}>
          <ShinyText text="RULES AND REGULATIONS" className="shiney" />
          <div className="rule-container">
            <Stack
              className="rule-stack"
              randomRotation={true}
              sensitivity={180}
              sendToBackOnClick={false}
              cardDimensions={{ width: 350, height: 200 }}
              cardsData={images}
            />
          </div>
        </div>

                      
        <ShinyText text="JOIN THE VIBE" className="shiney" />
        <div className="btn-container">
        <button
          className="reg-button"
          onClick={() => navigate("/register")}
          style={{
            padding: "12px 28px",
            fontSize: "clamp(16px, 4vw, 18px)",
            cursor: "pointer",
            background: "linear-gradient(90deg, #007bff, #00c6ff)",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            marginTop: "20px",
            fontWeight: "600",
            boxShadow: "0px 4px 10px rgba(0,123,255,0.3)",
            transition: "all 0.3s ease",
            zIndex: 1
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          Register Now
        </button>


          <button
          className="reg-button"
          onClick={() => navigate("/get-id")}
          style={{
            padding: "12px 28px",
            fontSize: "clamp(16px, 4vw, 18px)",
            cursor: "pointer",
            background: "linear-gradient(90deg, #007bff, #00c6ff)",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            marginTop: "20px",
            fontWeight: "600",
            boxShadow: "0px 4px 10px rgba(0,123,255,0.3)",
            transition: "all 0.3s ease",
            zIndex: 1
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          Download your ID 
        </button>
        </div>

      </div>
    </div>
  );
};

export default Home;
