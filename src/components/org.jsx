import React from "react";
import "./org.css";

const Organizers = () => {
  const faculty = [
    { name: "Dr. C. Chandrasekar", img: "https://www.periyaruniversity.ac.in/PU_FACULTY/employee/upload/emp_photo/dr.c.c_new.jpg" ,des:"Senior Professor And Head"},
    { name: "Dr. R. Rathipriya", img: "https://www.periyaruniversity.ac.in/PU_FACULTY/employee/upload/emp_photo/rr.jpg", des:"Professor"},
    { name: "Dr. S. Sathish", img: "https://www.periyaruniversity.ac.in/PU_FACULTY/employee/upload/emp_photo/ss.jpg",des:"Associate Professor" },
  ]; 

  const students = [
    { name: "D. Dhanush", img: "dhanush.jpeg"  , des:"II MCA",role:"Coordinator  "},
    { name: "V. UdhayaBoopathi", img: "president.jpg" , des:"II MSC CS",role:"President" },
    { name: "D. Thusitha", img: "vice-president.jpeg" , des:"II MSC DS",role:"Vice President" },  
    { name: "D. Krithika Sri", img: "secretary.jpg" , des:"II MSC CS",role:"Secretary" },
    { name: "P. Dhayanidhi", img: "joint-secretary.jpg" , des:"II MSC DS",role:"Joint-Secretary" },  
  ];

  const developers=[
    {name:"B. Sam",img:"sam.jpg",des:"MCA"},
    {name:"G. Gowtham",img:"gowtham.jpg",des:"MCA"},
    {name:"P. Sarathkumar",img:"sarath-img.jpeg",des:"MCA"}
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
            <p className="org-des"> {person.role}</p>
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
