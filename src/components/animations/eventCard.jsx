import React from 'react';
import './eventCard.css';

const EventCard = ({ image, title,title2, description }) => {
  return (
    <>
    <div className="event-card">
      <img src={image} className="event-img" alt={title} />
      <div className="overlay">
        <h3 className="event-title">{title}</h3>
        <h3 className="event-title">{title2}</h3>
        <h5 className="event-description">{description}</h5>
      </div>
    </div>
    
    </>
  );
};

export default EventCard;
