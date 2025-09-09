import React from "react";
import { useState } from "react";
import ShinyText from "./animations/shineyText";
import Stack from "./animations/Stack";
import EventCard from "./animations/eventCard";

const Event = () => {
  const [details, setDetails] = useState([]);
  const [rules, setRules] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [teamSize, setTeamsize] = useState("")
  const [image, setImage] = useState("");
  const [display, setDisplay] = useState(false);
  const events = [
    {
      title: "PAPER PRESENTATION",
      description: "Showcase your innovative research and ideas through a structured presentation",
      image: "/paper-presentation.png",
      teamSize: "Team Size : 1 - 2",
      details: [
        "Present innovative research in Computer Science",
        "Eligibility: UG & PG students (CS/IT), solo or team (max 2)",
        "Submission: Abstract (≤300 words), Full paper (6–10 pages IEEE), PDF/PPT format",
        "Evaluation: Originality 30, Technical Depth 30, Presentation 20, Theme 10, Q&A 10 (Total 100)",
        "Rewards: Best Paper Award + E-Certificates"
      ],
      rules: [
        "No plagiarism (>15% similarity = rejection)",
        "8 min presentation + 2 min Q&A",
        "Formal attire required; report 30 mins early",
        "Only one submission per student",
        "Bring backup slides (PPT/PDF)"
      ],
      coordinators: [
        { name: "Name", phone: "9876543210" },
        { name: "Name", phone: "9876543210" }
      ]
    },
    {
      title: "POSTER PRESENTATION",
      description: "Express concepts creatively with visuals, infographics, and concise explanations",
      image: "/poster-presentation.jpg",
      teamSize: "Team Size : 1 - 2",
      details: [
        "Design AI prompts creatively and test outputs",
        "Eligibility: UG & PG students (CS/IT), individual only",
        "Rounds: 1) Prompt Analytics (online) 2) Live Coding (HTML/CSS/JS only)",
        "Evaluation: Accuracy 40, Structure 25, Creativity 15, Rule Compliance 20 (Total 100)",
        "Rewards: Winner & Runner-up Awards, Best prompts showcased"
      ],
      rules: [
        "No frameworks (React/Angular etc.)",
        "No external tools or websites",
        "Laptops mandatory in Round 2",
        "Only HTML/CSS/JS code allowed"
      ],
      coordinators: [
        { name: "Name", phone: "9876543210" },
        { name: "Name", phone: "9876543210" }
      ]
    },
    {
      title: "QUIZ",
      description: "Test your knowledge and quick thinking across multiple domains",
      image: "/quiz-image.png",
      teamSize: "Team Size : 1 -2 ",
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
      ],
      coordinators: [
        { name: "Name", phone: "9876543210" },
        { name: "Name", phone: "9876543210" }
      ]
    },
    {
      title: "SOCIAL ENGINEERING APP",
      description: "Explore and Build",
      image: "/word-hunt.png",
      teamSize: "Team Size : 1 - 2",
      details: [
        "The Prompt Builder event is designed to nurture creativity and logical thinking among students in the emerging field of Artificial Intelligence (AI) prompt engineering.",
        "In the age of AI-powered applications, the ability to construct precise, structured, and context-rich prompts has become a highly valued skill.",
        "This event encourages participants to explore how carefully crafted prompts influence the accuracy, creativity, and usefulness of AI-generated outputs."
      ],
      rules: [
        "Participants must complete the prompt within the given time limit to qualify.",
        "All words must be related to Computer Science and technology topics.",
        "No use of external help, dictionaries, or electronic devices is allowed during the event.",
        "Winners will be decided based on the number of correct words found and speed of completion."
      ],
      coordinators: [
        { name: "Name", phone: "9876543210" },
        { name: "Name", phone: "9876543210" }
      ]
    },
    {
      title: "PROMPT BUILDER",
      teamSize: "Individual Participation ",
      description: "Craft powerful prompts to unlock AI’s full potential with creativity and precision",
      image: "/social-eng.png",
      details: [
        "Design AI prompts creatively and test outputs",
        "Eligibility: UG & PG students (CS/IT), individual only",
        "Rounds: 1) Prompt Analytics (online) 2) Live Coding (HTML/CSS/JS only)",
        "Evaluation: Accuracy 40, Structure 25, Creativity 15, Rule Compliance 20 (Total 100)",
        "Rewards: Winner & Runner-up Awards, Best prompts showcased"
      ],

      rules: [
        "No frameworks (React/Angular etc.)",
        "No external tools or websites",
        "Laptops mandatory in Round 2",
        "Only HTML/CSS/JS code allowed"
      ],
      coordinators: [
        { name: "Name", phone: "9876543210" },
        { name: "Name", phone: "9876543210" }
      ]

    },
    {
      title: "API FUSION",
      description: "Build unique solutions by creatively integrating and using APIs",
      image: "/api.png",
      teamSize: "Team Size : 1 to 3",
      details: [
        "Build applications using APIs for real-world problems",
        "Eligibility: UG & PG students (CS/IT), teams of 1–3",
        "Rounds: 1) API Quiz (1 hr) 2) Coding Challenge (2 hrs with ≥2 APIs)",
        "Evaluation: API Usage 30, Functionality 25, Code Quality 20, Presentation 15, Quiz 10 (Total 100)",
        "Rewards: 1st Place Cash Prize + Certificates"
      ],

      rules: [
        "Must integrate at least 2 given APIs",
        "Applications must solve real-world problems",
        "Submit source code, demo, and documentation",
        "Strict time-bound schedule; no extensions"
      ],
      coordinators: [
        { name: "Name", phone: "9876543210" },
        { name: "Name", phone: "9876543210" }
      ]

    },
    {
      title: "DATA VISION",
      description: "Share your imagination and creativity through engaging and impactful stories",
      image: "/story.png",
      teamSize: "Team Size : 1 - 2",
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
      ],
      coordinators: [
        { name: "Name", phone: "9876543210" },
        { name: "Name", phone: "9876543210" }
      ]
    }


  ];
  const handleExploreClick = (event) => {
    setDisplay(true);
    setTitle(event.title);
    setDescription(event.description);
    setImage(event.image);
    setTeamsize(event.teamSize)
    setRules(event.rules);
    setDetails(event.details);
    const c = event.coordinators.map((coordinator, index) => (
      <p key={index}>{coordinator.name} : {coordinator.phone}</p>
    ));
    setCoordinators(c);

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
        <div className="pop-container" style={{ display: display ? "flex" : "none" }}>
          <div className="pop-up" style={{ display: display ? "block" : "none" }}>
            <div className="pop-title">
              <button onClick={() => setDisplay(false)} className="close-btn" >X</button>
              <h1>{title}</h1>
            </div>
            <div className="popElements" >
              <img src={image || null} alt=" " />
              <div className="contents">
                <h2 style={{ textAlign: "center" }} >{teamSize}</h2>
                <h2 className="ch" >Details</h2>
                {details.map((rule, index) => (
                  <p key={index}>{rule}</p>
                ))}
                <h2 className="ch" >Rules</h2>
                {rules.map((rule, index) => (
                  <p key={index}>{rule}</p>
                ))}
                <h2 className="ch" >Price Money</h2>
                <pre className="price-amount" >1st Place    : &#8377; 1500</pre>
                <pre className="price-amount" >2nd Place  : &#8377; 1000</pre>
                <pre className="price-amount" >3rd Place   : &#8377; 500</pre>
                <h2 className="ch" >Coordinators</h2>
                {coordinators}
              </div>

            </div>
          </div>
        </div>
      </div>

    </>
  )
}
export default Event;