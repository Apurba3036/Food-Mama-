import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NewCard from './NewCard';
import './restaurent.css'; // Make sure to import your CSS file

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('http://localhost:4000/restaurants');
        setRestaurants(response.data.data);
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
      }
    };

    fetchRestaurants();
  }, []);
  
  return (
    <div className="restaurant-container">
      <h1 className="restaurant-title">Restaurants Near You</h1>
      <div className="restaurant-grid">
        {restaurants.map((restaurant) => (
          <NewCard key={restaurant._id} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
};

export default Restaurants;
