import React, { useState, useEffect } from 'react';
import './Cart.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Cart = () => {
  const [cartItems, setCartItems] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();
  const url = "http://localhost:4000"; // assuming your image url base
  const currency = "$"; // assuming dollar currency
  const deliveryCharge = 10 // example delivery charge

  
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    setCartItems(cart);
    calculateTotal(cart);
  }, []);

  // Calculate total cart amount
  const calculateTotal = (cart) => {
    let total = 0;
    Object.keys(cart).forEach(itemId => {
      total += cart[itemId].price * cart[itemId].quantity;
    });
    setTotalAmount(total);
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    const updatedCart = { ...cartItems };
    delete updatedCart[itemId];
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
    toast.warn(`remove from the cart`)
  };

  if (Object.keys(cartItems).length === 0) {
    return <p>Your cart is empty!</p>;
  }

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p> <p>Title</p> <p>Price</p> <p>Quantity</p> <p>Total</p> <p>Remove</p>
        </div>
        <br />
        <hr />
        {Object.keys(cartItems).map((itemId, index) => {
          const item = cartItems[itemId];
          return (
            <div key={index}>
              <div className="cart-items-title cart-items-item">
                <img src={`${url}/images/${item.image}`} alt={item.name} />
                <p>{item.name}</p>
                <p>{currency}{item.price}</p>
                <div>{item.quantity}</div>
                <p>{currency}{item.price * item.quantity}</p>
                <p className='cart-items-remove-icon' onClick={() => removeFromCart(itemId)}>x</p>
              </div>
              <hr />
            </div>
          );
        })}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details"><p>Subtotal</p><p>{currency}{totalAmount}</p></div>
            <hr />
            <div className="cart-total-details"><p>Delivery Fee</p><p>{currency}{totalAmount === 0 ? 0 : deliveryCharge}</p></div>
            <hr />
            <div className="cart-total-details"><b>Total</b><b>{currency}{totalAmount === 0 ? 0 : totalAmount + deliveryCharge}</b></div>
          </div>
          <button onClick={() => navigate('/order', { state: { totalAmount, deliveryCharge } })}>
            PROCEED TO CHECKOUT
          </button>
        </div>

        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, Enter it here</p>
            <div className='cart-promocode-input'>
              <input type="text" placeholder='promo code' />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
