import React from "react";
import { useState } from "react";
import ShinyText from "./animations/shineyText";
import Stack from "./animations/Stack";
import EventCard from "./animations/eventCard";

const Event=()=>{
      const [details, setDetails] = useState([]);
      const [rules, setRules] = useState([]);
      const [title, setTitle] = useState("");
      const [description, setDescription] = useState("");
      const [image, setImage] = useState("");
      const [display, setDisplay] = useState(false);
     const events = [
    {
      title: "Quiz",
      description: "Test your knowledge in various technical domains.",
      image: "/quiz.png",
      rules: ["Participants must use the provided dataset and submit their solutions within the time limit.", "Collaboration is encouraged, but each participant must submit their own solution.", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure eum veniam reprehenderit odit assumenda alias optio repellat dolorem sunt fuga eveniet, reiciendis quos harum, omnis suscipit sed in eaque!"
      ],
      details: ["Participate in a timed coding challenge and showcase your skills.", "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."]
    },
    {
      title: "Paper Presentation",
      description: "Showcase your research and innovative ideas.",
      image: "/paper.png",
      rules: ["Participants must use the provided dataset and submit their solutions within the time limit.", "Collaboration is encouraged, but each participant must submit their own solution.", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure eum veniam reprehenderit odit assumenda alias optio repellat dolorem sunt fuga eveniet, reiciendis quos harum, omnis suscipit sed in eaque!"
      ],
      details: ["Participate in a timed coding challenge and showcase your skills.", "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."]
    },
    {
      title: "Poster Presentation",
      description: "Visualize your concepts and designs effectively.",
      image: "/poster.png",
      rules: ["Participants must use the provided dataset and submit their solutions within the time limit.", "Collaboration is encouraged, but each participant must submit their own solution.", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure eum veniam reprehenderit odit assumenda alias optio repellat dolorem sunt fuga eveniet, reiciendis quos harum, omnis suscipit sed in eaque!"
      ],
      details: ["Participate in a timed coding challenge and showcase your skills.", "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."]
    },
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
    return(
        <>
        
        <div className="about" id="about" style={{ marginBottom: "2rem" }}>
          <ShinyText text="LIST OF EVENTS" className="shiney" />
          <div className="event-container">
            {
              events.map((event, index) =>
              (<div className="event-elements">
                <EventCard key={index} image={event.image} title={event.title} description={event.description} />
                <h5>{event.title}</h5>
                <button onClick={() => handleExploreClick(event)} className="explore-btn" style={{ marginTop: "0px", padding: "8px 16px", border: "none", borderRadius: "5px", background: "linear-gradient(90deg, #007bff, #00c6ff)", color: "#fff", cursor: "pointer" }}>Explore</button>
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