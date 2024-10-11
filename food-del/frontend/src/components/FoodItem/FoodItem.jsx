import React, { useContext, useEffect, useState } from 'react';
import './FoodItem.css'; // Assuming you have your CSS here
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Toastify CSS

const FoodItem = ({ image, name, price, desc, id }) => {
  const { url, currency } = useContext(StoreContext);
  const [cartItems, setCartItems] = useState({});

  // Fetch cart items from localStorage on component mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || {};
    setCartItems(savedCart);
  }, []);

  // Add to Cart and update localStorage
  const addToCart = (itemId) => {
    const updatedCart = { ...cartItems };
    if (!updatedCart[itemId]) {
      updatedCart[itemId] = {
        id: itemId,
        name,
        price,
        image,
        quantity: 1
      };
    } else {
      updatedCart[itemId].quantity += 1;
    }
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    // Show success toast
    toast.success(`${name} added to cart!`, { position: "top-center" });
  };

  // Remove from Cart and update localStorage
  const removeFromCart = (itemId) => {
    const updatedCart = { ...cartItems };
    if (updatedCart[itemId]) {
      updatedCart[itemId].quantity -= 1;
      if (updatedCart[itemId].quantity === 0) {
        delete updatedCart[itemId];
      }
    }
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  return (
    <div className='food-item'>
      <div className='food-item-img-container'>
        <img className='food-item-image' src={`${url}/images/${image}`} alt={name} />
        {!cartItems[id] ? (
          <img
            alt=""
            className='add'
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
          />
        ) : (
          <div className="food-item-counter">
            <img
              alt=""
              src={assets.remove_icon_red}
              onClick={() => removeFromCart(id)}
            />
            <p>{cartItems[id]?.quantity || 0}</p>
            <img
              alt=""
              src={assets.add_icon_green}
              onClick={() => addToCart(id)}
            />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="Rating" />
        </div>
        <p className="food-item-desc">{desc}</p>
        <p className="food-item-price">{currency}{price}</p>
      </div>

     
    </div>
  );
};

export default FoodItem;
