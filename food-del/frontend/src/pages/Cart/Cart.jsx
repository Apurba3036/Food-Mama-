import React, { useState, useEffect } from 'react';
import './Cart.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Cart = () => {
  const [cartItems, setCartItems] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [discountedTotal, setDiscountedTotal] = useState(0); // New state for discounted total
  const navigate = useNavigate();
  const url = "http://localhost:4000"; // assuming your image url base
  const currency = "$"; // assuming dollar currency
  const deliveryCharge = 10; // example delivery charge

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
    setDiscountedTotal(total + deliveryCharge); // Initialize discounted total
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    const updatedCart = { ...cartItems };
    delete updatedCart[itemId];
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
    toast.warn(`removed from the cart`);
  };

  // Handle promo code submission
  const handlePromoCodeSubmit = () => {
    if (promoCode === 'eid') {
      const discount = totalAmount * 0.05; // Calculate 5% discount
      const newTotal = totalAmount - discount + deliveryCharge; // Apply discount to total
      setDiscountedTotal(newTotal);
      toast.success('Promo code applied! You received a 5% discount.');
    } else {
      toast.error('Invalid promo code!');
    }
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
            <div className="cart-total-details"><b>Total</b><b>{currency}{discountedTotal === 0 ? 0 : discountedTotal}</b></div>
          </div>
          <button onClick={() => navigate('/order', { state: { totalAmount: discountedTotal, deliveryCharge } })}>
            PROCEED TO CHECKOUT
          </button>
        </div>

        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, Enter it here</p>
            <div className='cart-promocode-input'>
              <input
                type="text"
                placeholder='promo code'
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)} // Update promo code state
              />
              <button onClick={handlePromoCodeSubmit}>Submit</button> {/* Handle promo code submission */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
