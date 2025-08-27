import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import GradientText from "./animations/gradientText";
import About from "./About";
import ShinyText from "./animations/shineyText";
import Stack from "./animations/Stack";
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

  const startContentAnimation = () => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.6 } });

    tl.from(containerRef.current.querySelector("h1"), {
      y: -40,
      opacity: 0,
    })

      .from(containerRef.current.querySelectorAll("p"), {
        x: -30,
        opacity: 0,
        stagger: 0.15,
      })

  };

  const images = [
  { id: 1, img: "/r9.jpg" },
  { id: 2, img: "/r8.jpg" },
  { id: 3, img: "/r7.jpg" },
  { id: 4, img: "/r6.jpg" },
  { id: 5, img: "/r5.jpg" },
  { id: 6, img: "/r4.jpg" },
  { id: 7, img: "/r3.jpg" },
  { id: 8, img: "/r2.jpg" },
  { id: 9, img: "/r1.jpg" },
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
            background: "#0a192f", // deep navy blue
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <h1
            ref={splashRef}
            style={{
              fontSize: "5rem",
              fontWeight: "900",
              background: "linear-gradient(90deg, #007bff, #00c6ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "5px",
            }}
          >
            VIBE 2K25
          </h1>
        </div>
      )}

      {/* Main Content */}
      <div
        ref={containerRef}
        className="main-content"
      >
        <h1>
          <GradientText
            colors={["#d2e0efff", "#00c6ff", "#40ffaa"]}
            animationSpeed={3}
            showBorder={false}
            className="main-heading"
          >
            VIBE 2K25 - National Level Technical Symposium
          </GradientText>
        </h1>


        <div className="about" id="about">
          <ShinyText text="ABOUT VIBE 2K25" className="shiney" />
          <About />
        </div>


        <div className="about" id="about">
          <ShinyText text="RULES AND REGULATIONS" className="shiney" />
          <div className="rule-container">
            
            <Stack
              randomRotation={true}
              sensitivity={180}
              sendToBackOnClick={false}
              cardDimensions={{ width: 350, height: 200 }}
              cardsData={images}
            />
          </div>

        </div>


        <button
          onClick={() => navigate("/register")}
          style={{
            padding: "12px 28px",
            fontSize: "18px",
            cursor: "pointer",
            background: "linear-gradient(90deg, #007bff, #00c6ff)",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            marginTop: "20px",
            fontWeight: "600",
            boxShadow: "0px 4px 10px rgba(0,123,255,0.3)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          Register Now
        </button>
      </div>
    </div>
  );
};

export default Home;
