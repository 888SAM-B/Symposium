import React from "react";
import "./org.css";

const Organizers = () => {
  const faculty = [
    { name: "Faculty One", img: "https://www.svgrepo.com/show/508699/landscape-placeholder.svg" },
    { name: "Faculty Two", img: "https://www.svgrepo.com/show/508699/landscape-placeholder.svg" },
    { name: "Faculty Three", img: "https://www.svgrepo.com/show/508699/landscape-placeholder.svg" },
  ];

  const students = [
    { name: "Student One", img: "https://www.svgrepo.com/show/508699/landscape-placeholder.svg" },
    { name: "Student Two", img: "https://www.svgrepo.com/show/508699/landscape-placeholder.svg" },
  ];

  return (
    <div className="organizers-container">
      <h2>Organizers</h2>

      <h3>Faculty Organizers</h3>
      <div className="cards-wrapper">
        {faculty.map((person, idx) => (
          <div key={idx} className="organizer-card">
            <img src={person.img} alt={person.name} />
            <p>{person.name}</p>
            <p>Designation</p>
          </div>
        ))}
      </div>

      <h3>Student Organizers</h3>
      <div className="cards-wrapper">
        {students.map((person, idx) => (
          <div key={idx} className="organizer-card">
            <img src={person.img} alt={person.name} />
            <p>{person.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Organizers;
