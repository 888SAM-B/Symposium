import { useEffect, useRef, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import AOS from "aos";
import "aos/dist/aos.css";
import gsap from "gsap";

// Components
import Home from "./components/home";
import TeamRegistrationForm from "./components/register";
import Idgen from "./components/idgen";
import Register1 from "./components/SymposiumRegistration";
import Event from "./components/event";
import Org from "./components/org";

function Sidebar({ isOpen, setIsOpen }) {
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      gsap.to(sidebarRef.current, {
        x: 0,
        duration: 0.6,
        ease: "power3.out",
      });
    } else {
      gsap.to(sidebarRef.current, {
        x: "-100%",
        duration: 0.6,
        ease: "power3.in",
      });
    }
  }, [isOpen]);

  return (
    <div ref={sidebarRef} className="sidebar">
      <div className="sidebar-header">
        <h2>Navigation</h2>
        <button onClick={() => setIsOpen(false)}>✖</button>
      </div>
      <nav>
        <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
        <Link to="/register" onClick={() => setIsOpen(false)}>Register</Link>
        
        <Link to="/reg" onClick={() => setIsOpen(false)}>Symposium Reg</Link>
        <Link to="/event" onClick={() => setIsOpen(false)}>Events</Link>
        <Link to="/org" onClick={() => setIsOpen(false)}>Organizers</Link>
      </nav>
    </div>
  );
}

function App() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <>
      {/* Navbar */}
      <header>
        <h1 className="logo">VIBE 2K25</h1>
        {/* Hamburger always visible on mobile */}
        <button onClick={() => setIsOpen(true)} className="hamburger">
          ☰
        </button>

        {/* Desktop navigation only */}
        <nav className="desktop-nav">
          <Link to="/">Home</Link>
          <Link to="/register">Register</Link>
          
          <Link to="/reg">Symposium Reg</Link>
          <Link to="/event">Events</Link>
          <Link to="/org">Organizers</Link>
        </nav>
      </header>

      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Content */}
      <main className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<TeamRegistrationForm />} />
          <Route path="/get-id" element={<Idgen />} />
          <Route path="/reg" element={<Register1 />} />
          <Route path="/event" element={<Event />} />
          <Route path="/org" element={<Org />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </main>
    </>
  );
}

export default App;
