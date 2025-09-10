import React from "react";
import "./org.css";

const Organizers = () => {
  const faculty = [
    { name: "Dr. C. Chandrasekar", img: "https://www.periyaruniversity.ac.in/PU_FACULTY/employee/upload/emp_photo/dr.c.c_new.jpg" ,des:"Senior Professor And Head"},
    { name: "Dr. R. Rathipriya", img: "https://www.periyaruniversity.ac.in/PU_FACULTY/employee/upload/emp_photo/rr.jpg", des:"Professor"},
    { name: "Dr. S. Sathish", img: "https://www.periyaruniversity.ac.in/PU_FACULTY/employee/upload/emp_photo/ss.jpg",des:"Associate Professor" },
  ]; 

  const students = [
    { name: "D. Dhanush", img: "https://www.svgrepo.com/show/508699/landscape-placeholder.svg"  , des:"II MCA"},
    { name: "D. Tusitha", img: "https://www.svgrepo.com/show/508699/landscape-placeholder.svg" , des:"II MSC DS" },
    { name: "V. UdhayaBoopathi", img: "https://www.svgrepo.com/show/508699/landscape-placeholder.svg" , des:"II MSC CS" },
  ];

  const developers=[
    {name:"B. Sam",img:"sam.jpg",des:"MCA"},
    {name:"G. Gowtham",img:"gowtham.jpg",des:"MCA"},
    {name:"P. Sarath Kumar",img:"sarath.jpg",des:"MCA"}
  ]

  return (
    <div className="organizers-container">
      <h2>Organizers</h2>

      <h3>Faculty Organizers</h3>
      <div className="cards-wrapper">
        {faculty.map((person, idx) => (
          <div key={idx} className="organizer-card">
            <img src={person.img} alt={person.name} />
            <p className="org-name" >{person.name}</p>
            <p className="org-des" >{person.des}</p>
          </div>
        ))}
      </div>

      <h3>Student Organizers</h3>
      <div className="cards-wrapper">
        {students.map((person, idx) => (
          <div key={idx} className="organizer-card">
            <img src={person.img} alt={person.name} />
            <p className="org-name"> {person.name}</p>
            <p className="org-des"> {person.des}</p>
          </div>
        ))}
      </div>

      <h3>Developers</h3>
      <div className="cards-wrapper">
        {developers.map((person, idx) => (
          <div key={idx} className="organizer-card">
            <img src={person.img} alt={person.name} />
            <p className="org-name"> {person.name}</p>
            <p className="org-des"> {person.des}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Organizers;
