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
  const [about, setAbout] = useState("")
  const [language, setLanguage] = useState("")
  const [image, setImage] = useState("");
  const [eligibility, setEligibility] = useState("")
  const [display, setDisplay] = useState(false);


  const events = [
    {
      "title": "PAPER PRESENTATION",
      "description": "Showcase your innovative research and ideas through a structured presentation",
      "image": "paper-presentation.png",
      "teamSize": "1 - 2 members",
      "eligibility": "UG & PG (Computer Science, IT & allied fields)",
      "language": "English",
      "about": "Students can present research ideas, trends, and academic work in Computer Science. This mini-conference format helps showcase originality, technical skills, and communication.",
      "details": [
        "Present innovative research in Computer Science",
        "Eligibility: UG & PG students (CS/IT & allied fields), solo or team (max 2)",
        "Submission: Abstract (max 300 words), Full paper (6–10 pages IEEE format), PDF/PPT only",
        "Evaluation: Originality 30, Technical Depth 30, Presentation 20, Relevance 10, Q&A 10 (Total 100)",
        "Awards: Best Paper Award 🏆, E-certificates 📜, Selected papers may be published 📚"
      ],
      "rules": [
        "Plagiarism check (max 15%)",
        "Presentation – 8 mins + 2 mins Q&A",
        "Slides in PDF/PPT, bring backups",
        "Dress formally/semi-formally",
        "Report 30 mins early",
        "No late or duplicate submissions"
      ],
      "coordinators": [
        { "name": "D. DHANUSH", "phone": "+91 9080682245" }

      ]
    },
    {
      "title": "POSTER PRESENTATION",
      "description": "Express concepts creatively with visuals, infographics, and concise explanations",
      "image": "poster-presentation.jpg",
      "teamSize": "1 - 2 members",
      "eligibility": "UG & PG (Computer Science, IT & related fields)",
      "language": "English",
      "about": "Participants present research work, project ideas, or innovative concepts as a poster. The event evaluates both technical content and the ability to communicate complex ideas clearly, concisely, and visually.",
      "details": [
        "Present research work, project ideas, or innovative concepts as a poster.",
        "Eligibility: UG & PG students (CS/IT & related fields), solo or team (max 2)",
        "Submission: Abstract (max 200 words), Poster size A1 or A2, PDF/JPEG format, printed by participants",
        "Evaluation: Originality/Creativity 25, Technical Content 30, Visual Design/Clarity 25, Presentation 10, Q&A 10 (Total 100)",
        "Awards: Best Poster Award 🏆, E-certificates for all shortlisted participants 📜, Outstanding posters may be displayed."
      ],
      "rules": [
        "Posters must be original work; copyrighted or plagiarized content not allowed",
        "Presentation: 5 minutes explanation + 2 minutes Q&A",
        "Posters should clearly show problem, methodology, results, and conclusion",
        "Visual appeal, readability, and clarity are important",
        "Participants must be present during evaluation",
        "Display posters neatly in the assigned space",
        "Report 30 minutes early",
        "Formal/semi-formal dress code required",
        "Only one poster per team",
        "Late or incomplete submissions not accepted",
        "Misconduct may lead to disqualification"
      ],
      "coordinators": [
        { "name": "D.KRITHIKA SRI", "phone": "+91 6369255254" }
      ]
    },
    
    {
      "title": "QUIZ ",
      "description": "Test your knowledge and quick thinking in the exciting world of Artificial Intelligence.",
      "image": "quiz.png",
      "teamSize": "1 – 2 members",
      "eligibility": "UG & PG",
      "date": "SEP 26",
      "language": "English Only",
      "about": "The Quiz Competition is designed to spark curiosity and test students’ knowledge in the exciting domain of Artificial Intelligence (AI) and related technologies. The event provides an interactive platform for participants to demonstrate their understanding of AI concepts, applications, and recent trends while enhancing their problem-solving and critical thinking abilities.",
      "details": [

        "Enhance problem-solving and critical thinking abilities.",
        "The event will be conducted in two rounds:",
        "Round 1 – Preliminary (Online Mode): Multiple Choice Questions (MCQ) based on Artificial Intelligence, covering topics such as machine learning, deep learning, neural networks, natural language processing, and real-world AI applications.",
        "Round 2 – Final (Buzzer Round): The top 5 teams from Round 1 will qualify for the on-stage buzzer round. This stage will challenge participants’ quick thinking, teamwork, and technical depth in AI through dynamic and competitive questioning.",
        "The competition encourages students to go beyond classroom learning, stay updated with the latest advancements in AI, and showcase their technical sharpness in a professional environment."
      ],
      "rules": [
        "Specific rules for each round will be provided before the event.",
        "Fair play and sportsmanship are expected from all participants.",
        "The organizing committee's decision will be final and binding."
      ],
      "coordinators": [
        { "name": "D. TUSITHA", "phone": "+91 8072024200" }
      ]
    },
    {
      "title": "PROMPT BUILDER",
      "description": "Nurture creativity and logical thinking in AI prompt engineering.",
      "image": "/social-eng.png",
      "teamSize": "Individual only",
      "eligibility": "UG & PG (Computer Science, IT & allied disciplines)",
      "language": "English",
      "about": "This event nurtures creativity and logical thinking in AI prompt engineering. Participants explore how well-crafted prompts influence the accuracy, creativity, and usefulness of AI outputs. The competition includes a theoretical and practical component, giving exposure to AI-human interaction design.",
      "details": [
        "Design AI prompts creatively and test outputs",
        "Eligibility: UG & PG students (CS/IT & allied disciplines), individual only",
        "Rounds: 1) Prompt Analytics (online, 1 hr) 2) Live Prompt-to-Code Challenge (LAN, 2 hrs)",
        "Evaluation: Accuracy of Output 40, Prompt Structure Effectiveness 25, Creativity/Innovation 15, Rule Compliance 20 (Total 100)",
        "Awards: Winner Award 🏆, Runner-up Award 🥈, E-Certificates for all shortlisted participants 📜, Best prompts may be showcased."
      ],
      "rules": [
        "Report 30 minutes early",
        "Bring laptop for Round 2 unless provided",
        "Maintain professional behavior; misuse leads to disqualification",
        "Only one prompt per participant",
        "Late submissions in Round 1 not accepted",
        "Round 2: Only HTML, CSS, JS allowed, No frameworks, Full-screen mode required, Prompts executed by admin"
      ],
      "coordinators": [
        { "name": "I. SOUNDHARYA", "phone": "+91 9487142487" },
      ]
    },

    {
      "title": "SOCIAL ENGINEERING APP",
      "description": "Design and present an interactive application to simulate social engineering attacks and educate users on cybersecurity.",
      "image": "s-e-app.png",
      "teamSize": "1 - 2 members",
      "eligibility": "UG & PG (Computer Science, IT & allied disciplines)",
      "date": "To be updated",
      "language": "English",
      "about": "The Social Engineering App event challenges participants to develop an interactive application that not only simulates various social engineering attack vectors but also effectively educates users on how to identify, avoid, and report such threats. This competition fosters innovative thinking in cybersecurity education and application development.",
      "details": [
        "Participants must design and present an interactive application (web/mobile/desktop) that simulates different social engineering attacks.",
        "Examples of attacks to simulate include phishing, vishing, tailgating, baiting, pretexting, or quid pro quo.",
        "The application must also educate users on preventive measures and best practices to safeguard against these attacks.",
        "The goal is to create an engaging and informative tool that enhances cybersecurity awareness.",
        "Participants will be evaluated on the realism of the simulations, the clarity and effectiveness of the educational content, user experience, and technical implementation."
      ],
      "rules": [
        "Teams can consist of 1 to 2 members.",
        "The application can be developed for web, mobile (Android/iOS), or desktop platforms.",
        "All code and assets must be original or properly attributed open-source components.",
        "The application must be fully functional and presented with a live demo.",
        "A short presentation (e.g., 5-7 minutes) explaining the app's features, attack simulations, and educational approach is required.",
        "Participants should be prepared for a Q&A session from the judges.",
        "Focus on user experience (UX) and user interface (UI) for maximum impact and clarity.",
        "Further technical guidelines and judging criteria will be provided upon registration."
      ],
      "coordinators": [
        { "name": "D. VASIKARAN", "phone": "+91 8056519759" },
      ]
    },

    {
      "title": "API FUSION",
      "description": "A hands-on technical challenge focusing on API integration.",
      "image": "api.png",
      "teamSize": "1 - 2 members",
      "eligibility": "UG & PG (Computer Science, IT & allied disciplines)",
      "date": "To be updated",
      "about": "This is a hands-on technical challenge focusing on API integration. Participants design and develop functional applications using a given set of APIs, enhancing programming skills, problem-solving, and innovative thinking.",
      "details": [
        "Design and develop functional applications using a given set of APIs.",
        "Eligibility: UG & PG students (CS/IT & allied disciplines), team (max 3)",
        "Rounds: 1) API Quiz (1 hr) 2) Coding Round (2 hrs): Build a functional application using provided APIs.",
        "Evaluation: API Integration 30, Application Functionality 25, Code Quality 20, Presentation 15, Quiz Performance 10 (Total 100)",
        "Awards: 1st Place: Cash Prize + Certificate of Excellence 🏆, E-Certificate of Participation for all shortlisted participants 📜."
      ],
      "rules": [
        "Integrate minimum 2 APIs from the provided set (5–10 APIs). Additional API usage encouraged for extra credit.",
        "Languages: C, C++, Java, Python, JavaScript, etc.",
        "Environment: Any IDE/framework/tools",
        "Devices: Personal laptops preferred; university systems provided if needed",
        "Submission: Source code, Application demo/executable, Documentation explaining API usage",
        "Time limits: Round 1 (1 hour), Round 2 (2 hours); no extensions.",
        "Maintain professional behavior during the event."
      ],
      "coordinators": [
        { "name": "V. UDHAYA BOOPATHI", "phone": "+91 6369255254" },
      ]
    },



    {
      "title": "DATA VISION",
      "description": "Showcase your data analysis, visualization, and storytelling skills to communicate powerful insights.",
      "image": "story.png",
      "teamSize": "Individual",
      "eligibility": "UG & PG",
      "language": "English Only",
      "about": "The Story Telling event is designed to test participants' knowledge, analytical thinking, and data visualization skills. This event emphasizes not only technical skills but also the ability to communicate data-driven insights effectively. Participants will be evaluated on problem-solving, creativity, clarity, and storytelling impact.",
      "details": [
        "The Data Vision event is designed to test participants' knowledge through a two-round challenge.",
        "Round 1: A 25-question MCQ quiz focused on Data Analysis and Data Science concepts.",
        "Round 2: Shortlisted participants will be provided with a dataset and a problem statement.",
        "Participants must analyze the dataset, derive insights, and present their findings in a clear, structured, and visually engaging data storytelling format.",
        "This event emphasizes not only technical skills but also the ability to communicate data-driven insights effectively.",
        "Participants will be evaluated on problem-solving, creativity, clarity, and storytelling impact.",
        "ON SPOT REGISTRATION AVAILABLE"
      ],
      "rules": [
        "Further rules and specific guidelines for each round will be provided at the event.",
        "Participants must adhere to the time limits provided fo parr each round.",
        "Plagiarism in analysis or presentation is strictly prohibited.",
        "Fair play and ethical data handling are expected."

      ],
      "coordinators": [
        { "name": "P. DHAYANIDHI", "phone": "+91 8148024396" },
      ]
    }, 
  ]

  const handleExploreClick = (event) => {
    setDisplay(true);
    setTitle(event.title);
    setDescription(event.description);
    setImage(event.image);
    setTeamsize(event.teamSize)
    setEligibility(event.eligibility)
    setRules(event.rules);
    setAbout(event.about);
    setLanguage(event.language ? event.language : "");
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
        <div className="pop-container" style={{ display: display ? "flex" : "none" }} onClick={() => setDisplay(false)} >
          <div className="pop-up" style={{ display: display ? "block" : "none" }} onClick={(e) => e.stopPropagation()} >
            <div className="pop-title">

              <h1>{title}</h1>
            </div>
            <div className="popElements" >
              <img src={image || null} alt=" " />
              <div className="contents">
                <h2 style={{ textAlign: "center" }} >{teamSize}</h2>
                <h2 className="ch">ABOUT {title}</h2>
                <p> {about} </p>
                <h2 className="ch">ELIGIBILITY</h2>
                <p>{eligibility}</p>
                {
                  language && <><h2 className="ch"> Language </h2>
                    <p>{language}</p></>
                }
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
                <h2 className="ch" >Coordinator</h2>
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