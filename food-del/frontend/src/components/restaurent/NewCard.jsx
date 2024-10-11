import React from 'react';
import { Link } from 'react-router-dom';
import './card.css';

const NewCard = ({ restaurant }) => {
    console.log(restaurant);
    return (
        <div className="card">
      <img src={restaurant.image} alt={restaurant.name} className="card-img" />
      <div className="card-details">
        <h2>{restaurant.name}</h2>
        <p>{restaurant.location}</p>
        <Link to={`/restaurant/${restaurant._id}`}>
          <button className="view-btn">View</button>
        </Link>
      </div>
    </div>
    );
};

export default NewCard;