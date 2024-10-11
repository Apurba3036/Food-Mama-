import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';
import './restaurent.css';  // Import the CSS file
import 'react-toastify/dist/ReactToastify.css'; // Toastify CSS
import { toast } from 'react-toastify';

const RestaurantDetail = () => {
    const { id } = useParams(); 
    const [restaurant, setRestaurant] = useState(null);
    const [selectedQuantities, setSelectedQuantities] = useState({});

    const { addToCart } = useContext(StoreContext);

    useEffect(() => {
        const fetchRestaurantDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/restaurants/${id}`);
                setRestaurant(response.data.data);
            } catch (error) {
                console.error('Error fetching restaurant detail:', error);
            }
        };

        fetchRestaurantDetail(); 
    }, [id]);

    const handleQuantityChange = (itemId, quantity) => {
        setSelectedQuantities((prev) => ({
            ...prev,
            [itemId]: quantity,
        }));
    };

    const handleAddToCart = (item) => {
        const quantity = selectedQuantities[item._id] || 1; 
        addToCart({ ...item, quantity });
        saveToLocalStorage(item._id, item.name, item.description, item.price, item.image, quantity);
        toast.success(`${item.name} added to cart`)
    };

    const saveToLocalStorage = (itemId, name, description, price, image, quantity) => {
        let cart = JSON.parse(localStorage.getItem('cart')) || {};

        cart[itemId] = {
            id: itemId,
            name: name,
            description: description,
            price: price,
            image: image,
            quantity: quantity,
        };

        localStorage.setItem('cart', JSON.stringify(cart));
    };

    if (!restaurant) {
        return <p>Loading...</p>; 
    }

    return (
        <div className="restaurant-detail">
            <div className="restaurant-header">
                <h1>{restaurant.name}</h1>
                <p>{restaurant.location}</p>
                <img className="restaurant-image" src={restaurant.image} alt={restaurant.name} />
            </div>

            <h2>Food Items</h2>
            <ul className="food-item-list">
                {restaurant.food_items.map((item) => (
                    <li key={item._id} className="food-item">
                        <img className="food-item-image" src={`http://localhost:4000/images/${item.image}`} alt={item.name} />
                        <div className="food-item-info">
                            <h3>{item.name}</h3>
                            <p>{item.description}</p>
                            <p className="food-item-price">Price: ${item.price}</p>

                            <div className="quantity-selector">
                                <label htmlFor={`quantity-${item._id}`}>Quantity:</label>
                                <input
                                    id={`quantity-${item._id}`}
                                    type="number"
                                    min="1"
                                    value={selectedQuantities[item._id] || 1}
                                    onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                                />
                            </div>

                            <button className="add-to-cart-button" onClick={() => handleAddToCart(item)}>Add to Cart</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RestaurantDetail;
