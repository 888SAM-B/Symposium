import React from 'react';
import './eventCard.css';

const EventCard = ({ image, title, description }) => {
  return (
    <div className="event-card">
      <img src={image} className="event-img" alt={title} />
      <div className="overlay">
        <h3 className="event-title">{title}</h3>
        <p className="event-description">{description}</p>
      </div>
    </div>
  );
};

export default EventCard;
