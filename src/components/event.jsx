import React from "react";
import { useState } from "react";
import ShinyText from "./animations/shineyText";
import Stack from "./animations/Stack";
import EventCard from "./animations/eventCard";

const Event = () => {
  const [details, setDetails] = useState([]);
  const [rules, setRules] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [display, setDisplay] = useState(false);
  const events = [
    {
      title: "PAPER PRESENTATION",
      description: "Start the vibe",
      image: "/paper-presentation.png",
      details: ["Showcase your ideas, research, and innovations in the field of Computer Science.", " Present your work in front of a panel of experts and peers, highlighting your concept, methodology, and results.", "This event gives you the chance to share knowledge, gainfeedback, and inspire others with your presentation skills."],
      rules: [
        "Submit your paper in the required format before the deadline.",
        "Presentations are limited to 10 minutes plus for 5 minutes Q&A.",
        "Present original, unpublished work with proper citations.",
        "Arrive 15 minutes early for setup and maintain professionalism."
      ]
    },
    {
      title: "POSTER PRESENTATION",
      description: "Start the vibe",
      image: "/poster-presentation.jpg",
      details: [
        "The Poster Presentation event gives participants the chance to express their research, projects, and innovative concepts in a creative visual format.",
        "Instead of lengthy papers, ideas are communicated through eye-catching posters with charts, diagrams, and graphics that make complex concepts easy to understand."
      ]
      ,
      rules: [
        "Posters should visually communicate your research or project clearly and creatively.",
        "Poster size must not exceed the specified dimensions (e.g., 36 x 48 inches).",
        "Presenters should be available at their poster during the assigned session time for discussion.",
        "Ensure all content is original and properly cited; no offensive or plagiarized material allowed."
      ]
    },
    {
      title: "QUIZ",
      description: "Visualize your concepts and designs effectively.",
      image: "/quiz-image.png",
      details: [
        "The Technical Quiz is a fast-paced event designed to test your knowledge, speed, and presence of mind in the field of Computer Science and general technology.",
        "Participants will face a mix of conceptual questions, logical puzzles, and real-world tech scenarios that challenge both accuracy and quick thinking."
      ]
      ,
      rules: [
        "Participants must register before the deadline to be eligible for the quiz.",
        "The quiz will consist of multiple rounds with increasing difficulty levels.",
        "Use of electronic devices or external help during the quiz is strictly prohibited.",
        "Winners will be decided based on accuracy and speed; tie-breakers may be used if necessary."
      ]
    },
    {
      title: "WORD HUNT",
      description: "Visualize your concepts and designs effectively.",
      image: "/word-hunt.png",
      details: [
        "The Word Hunt is a fun and brain-teasing event where participants search, decode, and solve hidden words and puzzles related to Computer Science and technology.",
        "It tests your speed, vocabulary, and logical thinking as you race against time to crack the challenge.",
        "This event is not just about finding words — it’s about sharpening your mind, improving focus, and enjoying a playful competition with your peers."
      ],
      rules: [
        "Participants must complete the puzzles within the given time limit to qualify.",
        "All words must be related to Computer Science and technology topics.",
        "No use of external help, dictionaries, or electronic devices is allowed during the event.",
        "Winners will be decided based on the number of correct words found and speed of completion."
      ]
    },
    {
      title: "SOCIAL ENGINEERING ",
      title2:"APP",
      description: "Visualize your concepts and designs effectively.",
      image: "/social-eng.png",
      details: [
        "The Social Engineering App event is designed to test how well you understand the human side of cybersecurity.",
        "Participants will face real-life inspired scenarios where they need to identify tricks, detect risks, and create smart solutions against social engineering attacks like phishing, fake apps, and data theft.",
        "This event helps participants improve their awareness of cyber threats and sharpen their problem-solving skills in a practical and fun way."
      ]

      ,
      rules: [
        "Participants must analyze scenarios and provide effective countermeasures against social engineering attacks.",
        "Use of external resources or collaboration during the event is not allowed.",
        "Solutions will be judged based on creativity, practicality, and understanding of cybersecurity principles.",
        "Participants should demonstrate clear awareness of common social engineering tactics and preventive strategies."
      ]

    },
    {
      title: "API FUSION",
      description: "Visualize your concepts and designs effectively.",
      image: "/api.png",
      details: [
        "The API Fusion event is all about bringing different systems together using the power of APIs (Application Programming Interfaces).",
        "Participants will be given tasks where they need to connect services, share data, and build solutions by integrating multiple APIs.",
        "This event focuses on your coding skills, creativity, and problem-solving ability to design apps that work smoothly and efficiently."
      ]


      ,
      rules: [
        "Participants must build solutions by integrating multiple APIs within the given time frame.",
        "All code should be original and written during the event; pre-built libraries are allowed unless otherwise specified.",
        "Solutions will be evaluated based on functionality, creativity, and efficient use of APIs.",
        "Teams or individuals should ensure their applications run smoothly without errors during the demo."
      ]

    },
    {
      title: "STORY TELLING",
      description: "Visualize your concepts and designs effectively.",
      image: "/story.png",
      details: [
        "The Storytelling event is all about using your imagination and creativity to share ideas through stories.",
        "Participants can create and present stories related to technology, innovation, or everyday life in a way that is engaging and inspiring.",
        "This event helps you improve your communication skills, confidence, and creativity, while also entertaining and connecting with the audience."
      ]
      ,
      rules: [
        "Stories must be original and created by the participant.",
        "Each participant will be given 3–5 minutes to present their story.",
        "Stories should be related to technology, innovation, or everyday life.",
        "Participants will be judged on creativity, clarity, expression, and audience engagement."
      ]
    }


  ];
  const handleExploreClick = (event) => {
    setDisplay(true);
    setTitle(event.title);
    setDescription(event.description);
    setImage(event.image);
    setRules(event.rules);
    setDetails(event.details);
    console.log(title);
  };
  return (
    <>

      <div className="about" id="about" style={{ marginBottom: "2rem" }}>
        <ShinyText text="LIST OF EVENTS" className="shiney" />
        <div className="event-container">
          {
            events.map((event, index) =>
            (<div className="event-elements">
              <EventCard key={index} image={event.image} title={event.title} title2={event.title2} description={event.description} />
              <h5>{event.title}{event.title2}</h5>
              <button onClick={() => handleExploreClick(event)} className="explore-btn" >Explore</button>
            </div>
            ))
          }
        </div>
        <div className="pop-up" style={{ display: display ? "block" : "none" }}>
          <div className="pop-title">
            <h1>{title}</h1>
          </div>
          <div className="popElements" >
            <img src={image || null} alt=" " width="100px" />
            <div className="contents">
              <h2 className="ch" >Details</h2>
              {details.map((rule, index) => (
                <p key={index}>{rule}</p>
              ))}
              <h2 className="ch" >Rules</h2>
              {rules.map((rule, index) => (
                <p key={index}>{rule}</p>
              ))}
            </div>

          </div>
          <button style={{ marginTop: "0px", padding: "8px 16px", border: "none", borderRadius: "5px", background: "linear-gradient(90deg, #007bff, #00c6ff)", color: "#fff", cursor: "pointer" }} onClick={() => setDisplay(false)} className="close-btn" >close</button>
        </div>
      </div>

    </>
  )
}
export default Event;